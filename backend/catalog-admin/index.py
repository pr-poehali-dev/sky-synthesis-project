import json
import os
import psycopg2


ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')


def check_auth(event: dict) -> bool:
    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token', '')
    return token == ADMIN_PASSWORD


def handler(event: dict, context) -> dict:
    """Управление каталогом: добавление и удаление элементов (только для администратора)."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    cors = {'Access-Control-Allow-Origin': '*'}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Unauthorized'})}

    method = event.get('httpMethod')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute("SELECT id, title, description, category, image, downloads, rating, tag FROM catalog_items ORDER BY id DESC")
        rows = cur.fetchall()
        items = [
            {'id': r[0], 'title': r[1], 'description': r[2], 'category': r[3],
             'image': r[4], 'downloads': r[5], 'rating': float(r[6]), 'tag': r[7]}
            for r in rows
        ]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'items': items}, ensure_ascii=False)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            "INSERT INTO catalog_items (title, description, category, image, downloads, rating, tag) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (body['title'], body['description'], body['category'], body['image'],
             int(body.get('downloads', 0)), float(body.get('rating', 5.0)), body['tag'])
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 201, 'headers': cors, 'body': json.dumps({'id': new_id})}

    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        item_id = params.get('id')
        if not item_id:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'id required'})}
        cur.execute("DELETE FROM catalog_items WHERE id = %s", (int(item_id),))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

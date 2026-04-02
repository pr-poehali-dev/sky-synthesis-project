import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список элементов каталога с фильтрацией по категории."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    params = event.get('queryStringParameters') or {}
    category = params.get('category', 'all')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if category and category != 'all':
        cur.execute(
            "SELECT id, title, description, category, image, downloads, rating, tag, file_url FROM catalog_items WHERE category = %s ORDER BY downloads DESC",
            (category,)
        )
    else:
        cur.execute(
            "SELECT id, title, description, category, image, downloads, rating, tag, file_url FROM catalog_items ORDER BY downloads DESC"
        )

    rows = cur.fetchall()
    cur.close()
    conn.close()

    items = [
        {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'image': row[4],
            'downloads': row[5],
            'rating': float(row[6]),
            'tag': row[7],
            'file_url': row[8],
        }
        for row in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'items': items}, ensure_ascii=False)
    }
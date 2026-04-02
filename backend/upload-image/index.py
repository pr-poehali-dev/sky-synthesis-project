import base64
import json
import mimetypes
import os
import uuid

import boto3


ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')


def handler(event: dict, context) -> dict:
    """Загружает картинку в S3 и возвращает CDN-ссылку."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    cors = {'Access-Control-Allow-Origin': '*'}

    headers = event.get('headers') or {}
    if headers.get('X-Admin-Token', '') != ADMIN_PASSWORD:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Unauthorized'})}

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('file')
    filename = body.get('filename', 'image.jpg')

    if not file_data:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No file provided'})}

    if ',' in file_data:
        file_data = file_data.split(',', 1)[1]

    image_bytes = base64.b64decode(file_data)

    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
    content_type = mimetypes.types_map.get(f'.{ext}', 'image/jpeg')
    key = f'catalog/{uuid.uuid4()}.{ext}'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=image_bytes, ContentType=content_type)

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/files/{key}'

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'url': cdn_url})
    }

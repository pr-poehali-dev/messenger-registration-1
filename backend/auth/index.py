import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для регистрации и входа пользователей в мессенджер Lites'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                phone = body.get('phone')
                nickname = body.get('nickname')
                username = body.get('username')
                avatar_type = body.get('avatar_type', 'emoji')
                avatar_value = body.get('avatar_value', '😊')
                
                cur.execute(
                    "INSERT INTO users (phone, nickname, username, avatar_type, avatar_value) VALUES (%s, %s, %s, %s, %s) RETURNING id, phone, nickname, username, avatar_type, avatar_value, is_premium",
                    (phone, nickname, username, avatar_type, avatar_value)
                )
                user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'user': {
                            'id': user[0],
                            'phone': user[1],
                            'nickname': user[2],
                            'username': user[3],
                            'avatar_type': user[4],
                            'avatar_value': user[5],
                            'is_premium': user[6]
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                phone = body.get('phone')
                
                cur.execute(
                    "SELECT id, phone, nickname, username, avatar_type, avatar_value, is_premium FROM users WHERE phone = %s",
                    (phone,)
                )
                user = cur.fetchone()
                
                if user:
                    cur.execute(
                        "UPDATE users SET last_online = %s WHERE id = %s",
                        (datetime.now(), user[0])
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'user': {
                                'id': user[0],
                                'phone': user[1],
                                'nickname': user[2],
                                'username': user[3],
                                'avatar_type': user[4],
                                'avatar_value': user[5],
                                'is_premium': user[6]
                            }
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': False, 'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()

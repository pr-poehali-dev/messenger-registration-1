import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для работы с чатами, сообщениями и контактами'''
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
            
            if action == 'create_chat':
                chat_type = body.get('type', 'personal')
                name = body.get('name')
                description = body.get('description')
                created_by = body.get('created_by')
                members = body.get('members', [])
                
                cur.execute(
                    "INSERT INTO chats (type, name, description, created_by) VALUES (%s, %s, %s, %s) RETURNING id",
                    (chat_type, name, description, created_by)
                )
                chat_id = cur.fetchone()[0]
                
                if chat_type == 'group' or chat_type == 'channel':
                    cur.execute(
                        "INSERT INTO chat_members (chat_id, user_id, role) VALUES (%s, %s, %s)",
                        (chat_id, created_by, 'admin')
                    )
                
                for member_id in members:
                    if member_id != created_by:
                        cur.execute(
                            "INSERT INTO chat_members (chat_id, user_id) VALUES (%s, %s)",
                            (chat_id, member_id)
                        )
                
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'chat_id': chat_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'send_message':
                chat_id = body.get('chat_id')
                sender_id = body.get('sender_id')
                content = body.get('content')
                message_type = body.get('message_type', 'text')
                
                cur.execute(
                    "INSERT INTO messages (chat_id, sender_id, content, message_type) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                    (chat_id, sender_id, content, message_type)
                )
                message = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': {
                            'id': message[0],
                            'chat_id': chat_id,
                            'sender_id': sender_id,
                            'content': content,
                            'created_at': message[1].isoformat() if message[1] else None
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'add_contact':
                user_id = body.get('user_id')
                contact_id = body.get('contact_id')
                
                cur.execute(
                    "INSERT INTO contacts (user_id, contact_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (user_id, contact_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            chat_id = params.get('chat_id')
            action = params.get('action')
            
            if action == 'get_chats' and user_id:
                cur.execute(
                    """
                    SELECT DISTINCT c.id, c.type, c.name, c.description, c.avatar_url,
                           (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
                    FROM chats c
                    LEFT JOIN chat_members cm ON c.id = cm.chat_id
                    WHERE cm.user_id = %s OR c.created_by = %s
                    ORDER BY c.id DESC
                    """,
                    (user_id, user_id)
                )
                chats = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'chats': [{
                            'id': c[0],
                            'type': c[1],
                            'name': c[2],
                            'description': c[3],
                            'avatar_url': c[4],
                            'last_message': c[5]
                        } for c in chats]
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_messages' and chat_id:
                cur.execute(
                    """
                    SELECT m.id, m.sender_id, m.content, m.message_type, m.created_at,
                           u.nickname, u.avatar_type, u.avatar_value
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at ASC
                    LIMIT 100
                    """,
                    (chat_id,)
                )
                messages = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'messages': [{
                            'id': m[0],
                            'sender_id': m[1],
                            'content': m[2],
                            'message_type': m[3],
                            'created_at': m[4].isoformat() if m[4] else None,
                            'sender': {'nickname': m[5], 'avatar_type': m[6], 'avatar_value': m[7]}
                        } for m in messages]
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_contacts' and user_id:
                cur.execute(
                    """
                    SELECT u.id, u.nickname, u.username, u.avatar_type, u.avatar_value, u.is_premium
                    FROM users u
                    JOIN contacts c ON u.id = c.contact_id
                    WHERE c.user_id = %s
                    ORDER BY u.nickname
                    """,
                    (user_id,)
                )
                contacts = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'contacts': [{
                            'id': c[0],
                            'nickname': c[1],
                            'username': c[2],
                            'avatar_type': c[3],
                            'avatar_value': c[4],
                            'is_premium': c[5]
                        } for c in contacts]
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid request'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
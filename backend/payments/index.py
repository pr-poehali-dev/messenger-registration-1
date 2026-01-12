import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для обработки платежей: Premium подписка (350₽/месяц), СПБ и карты'''
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
            
            if action == 'create_payment':
                user_id = body.get('user_id')
                payment_type = body.get('payment_type', 'premium_subscription')
                payment_method = body.get('payment_method')
                amount = body.get('amount', 350.00)
                
                cur.execute(
                    """
                    INSERT INTO payments (user_id, amount, payment_type, payment_method, status, transaction_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, transaction_id
                    """,
                    (user_id, amount, payment_type, payment_method, 'pending', f'TXN_{user_id}_{int(datetime.now().timestamp())}')
                )
                payment = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'payment_id': payment[0],
                        'transaction_id': payment[1],
                        'amount': amount,
                        'payment_url': f'https://payment.example.com/pay/{payment[1]}'
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'confirm_payment':
                transaction_id = body.get('transaction_id')
                
                cur.execute(
                    "UPDATE payments SET status = %s, completed_at = %s WHERE transaction_id = %s RETURNING user_id, payment_type",
                    ('completed', datetime.now(), transaction_id)
                )
                payment_info = cur.fetchone()
                
                if payment_info and payment_info[1] == 'premium_subscription':
                    user_id = payment_info[0]
                    premium_until = datetime.now() + timedelta(days=30)
                    
                    cur.execute(
                        "UPDATE users SET is_premium = %s, premium_until = %s WHERE id = %s",
                        (True, premium_until, user_id)
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
                        'message': 'Payment confirmed and premium activated'
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('user_id')
            
            if user_id:
                cur.execute(
                    """
                    SELECT id, amount, currency, payment_type, payment_method, status, created_at
                    FROM payments
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    """,
                    (user_id,)
                )
                payments = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'payments': [{
                            'id': p[0],
                            'amount': float(p[1]),
                            'currency': p[2],
                            'payment_type': p[3],
                            'payment_method': p[4],
                            'status': p[5],
                            'created_at': p[6].isoformat() if p[6] else None
                        } for p in payments]
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

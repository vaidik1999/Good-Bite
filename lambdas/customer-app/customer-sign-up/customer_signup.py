import json
import boto3
import logging

logging.basicConfig(level=logging.INFO)
dynamodb = boto3.resource('dynamodb')
table_name = 'table_reservation_app_user'  
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        body = event
        email_id = body.get('email_id')
        first_name = body.get('first_name')
        last_name = body.get('last_name')
        contact_number = body.get('contact_number')
        logging.info("Performing input validation")
        # Performing input validation
        if not email_id or not first_name or not last_name or not contact_number:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'All fields are required.'})
            }
        
        # Storing user data in DynamoDB
        user_item = {
            'email_id': email_id, 
            'first_name': first_name,
            'last_name': last_name,
            'contact_number': contact_number,
            'role': 'customer'
        }
        
        table.put_item(Item=user_item)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User signed up successfully.'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

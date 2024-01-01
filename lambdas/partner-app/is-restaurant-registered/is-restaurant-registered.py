import boto3
import logging

logging.basicConfig(level=logging.INFO)
dynamodb = boto3.resource('dynamodb')
table_name = 'table_reservation_app_user'  
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    
    try:
        # Extract email from the event
        email = event['email_id']
        logging.info(email)
        
        # Check if the email exists in the DynamoDB table
        response = table.get_item(Key={'email_id': email})
        logging.info(response)
        # If the email exists, check the role attribute
        if 'Item' in response:
            role = response['Item'].get('role', '')
            logging.info(role)
            if role == 'restaurant':
                return True
            else:
                return False
        else:
            # If the email doesn't exist in the table
            return False
    
    except Exception as e:
        # Handle any errors that may occur
        return {'error': str(e)}

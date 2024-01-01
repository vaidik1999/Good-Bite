import json
import boto3
import logging

logging.basicConfig(level=logging.INFO)
dynamodb = boto3.resource('dynamodb')
table_name = 'table_reservation_app_user'  
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    email_id = event['email_id']
    logging.info(email_id)
    
    try:
        logging.info("fetching record from the table")
        response = table.get_item(
            Key={
                'email_id': email_id
            }
        )
        
        item = response.get('Item')
        logging.info(item)
        if item:
            role = item.get('role')
            logging.info(role)
            logging.info("returning the user role")
            return {
                'role': role
                }
        else:
            logging.info("item not found")
            return {
                'statusCode': 404,
                'body': json.dumps('Item not found')
            }
    except Exception as e:
        logging.info("error in returning the user role")
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

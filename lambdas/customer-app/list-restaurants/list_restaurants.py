import boto3
import logging

logging.basicConfig(level=logging.INFO)
dynamodb = boto3.resource('dynamodb')
table_name = 'table_reservation_app_restaurants'  
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Scanning the DynamoDB table to fetch all restaurants
        logging.info("Scanning the DynamoDB table to fetch all restaurants")
        response = table.scan()
        list_of_restaurants = response['Items']
        
        # Return the list of restaurants as a response
        return {
            'statusCode': 200,
            'body': list_of_restaurants
        }
    except Exception as e:
        # Return an error response if something goes wrong
        return {
            'statusCode': 500,
            'body': str(e)
        }

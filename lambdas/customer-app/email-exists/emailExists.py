import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'table_reservation_app_user'  
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    # Extracting the email from the incoming event
    email = event.get('email')
    
    # Checking if email is provided
    if not email:
        return False  
    try:
        # Querying DynamoDB to check if the email exists
        response = table.get_item(
            Key={
                'email_id': email
            }
        )
        
        # Check if the item was found
        if 'Item' in response:
            return True
        else:
            return False
    except Exception as e:
        return False

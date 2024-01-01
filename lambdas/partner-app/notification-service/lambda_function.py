import json
import boto3
import time

snsClient = boto3.client('sns')

notificationList = []

def lambda_handler(event, context):
    
    print("EVENT IN LAMBDA====>", event)
    
    if(event.get('Records', False)):
        for record in event['Records']:
            messageJson = json.loads(json.loads(record["body"]))
            
            if not messageJson.get('type', False) or not messageJson.get('message', False):
                return {
                    'statusCode': 400,
                    'body': json.dumps('Invalid Request')
                }
                
            notificationType = messageJson['type']
            message = messageJson['message']
            response = snsClient.publish(TopicArn='arn:aws:sns:us-east-1:252809092212:email-notification', Message=message)
            print("Message published")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Notification Service!')
    }

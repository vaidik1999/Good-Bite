import json
import random
import boto3
from datetime import datetime, timedelta

event_bridge = boto3.client('scheduler')

def lambda_handler(event, context):
    
    if(event.get('Records', False)):
        for record in event['Records']:
            messageJson = json.loads(json.loads(record["body"]))
            
            if not messageJson.get('time', False) or not messageJson.get('message', False):
                return {
                    'statusCode': 400,
                    'body': json.dumps('Invalid Request')
                }
            
            notificationTime = datetime.strptime(messageJson['time'], "%Y-%m-%d %H:%M:%S")
            message = messageJson['message']
            notification_message = '\"{\\"type\\":\\"EMAIL\\",\\"message\\":\\"' + message + '\\"}\"'
            
            
            uuid = random.randint(1,9999999999)
            scheduler_name = 'my-scheduler-' + str(uuid)
            queue_arn = 'arn:aws:sqs:us-east-1:252809092212:notification-queue'
        
            cron_exp = f"cron({notificationTime.minute} {notificationTime.hour} {notificationTime.day} {notificationTime.month} ? {notificationTime.year})"
        
            scheduler_response = event_bridge.create_schedule(
                FlexibleTimeWindow={
                    'Mode': 'OFF'
                },
                Name=scheduler_name,
                ScheduleExpression=cron_exp,
                State='ENABLED',
                Target={
                    'Arn': queue_arn,
                    'RoleArn': 'arn:aws:iam::252809092212:role/service-role/Amazon_EventBridge_Scheduler_SQS_633496e586',
                    'Input': notification_message
                }
            )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

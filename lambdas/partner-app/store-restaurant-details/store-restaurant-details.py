import boto3
import base64
import logging
from botocore.exceptions import ClientError

logging.basicConfig(level=logging.INFO)
dynamodb = boto3.resource('dynamodb')
table_name = "table_reservation_app_restaurants"
table = dynamodb.Table(table_name)
s3 = boto3.client('s3')
s3_bucket = "table-reservation-app-s3-bucket"

def lambda_handler(event, context):
    try:
        # Extracting values from event
        logging.info("Extracting values from event")
        res_name = event['name']
        restaurant_id = event['email']
        res_closing_time = event['closing_time']
        res_opening_time = event['opening_time']
        res_address = event['address']
        res_total_tables = event['total_tables']
        res_image_base64 = event['image_base64']

        # Decoding Base64 image data
        logging.info("Decoding Base64 image data")
        res_image= base64.b64decode(res_image_base64)

        # Generating S3 key for the image
        logging.info("Generating S3 key for the image")
        res_image_key = f'{restaurant_id}_{res_name}_image.jpg'

        # Uploading image to S3 bucket
        logging.info("Uploading image to S3 bucket")
        res_image_url = upload_to_s3_bucket(res_image, res_image_key)

        if res_image_url is None:
            logging.info("Error uploading image to S3")
            return False

        #Creating a  DynamoDB Item
        logging.info("Creating a  DynamoDB Item")
        item = {
            'restaurant_id': restaurant_id,
            'res_name': res_name,
            'res_closing_time': res_closing_time,
            'res_opening_time': res_opening_time,
            'res_address': res_address,
            'res_total_tables': res_total_tables,
            'res_image_url': res_image_url
        }

        # Putting the item into DynamoDB table
        logging.info("Putting the item into DynamoDB table")
        table.put_item(Item=item)
        logging.info("Item added to DynamoDB and image uploaded to S3 successfully")
        return True
    
    except Exception as e:
        logging.info(str(e))
        return False

def upload_to_s3_bucket(image_content, image_key):
    try:
        s3.put_object(Body=image_content, Bucket=s3_bucket, Key=image_key)
        return f'https://{s3_bucket}.s3.amazonaws.com/{image_key}'
    except ClientError as e:
        logging.info(f"Error uploading to S3: {str(e)}")
        return None

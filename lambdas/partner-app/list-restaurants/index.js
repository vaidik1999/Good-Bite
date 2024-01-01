const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'table_reservation_app_restaurants';

exports.handler = async (event) => {
    try {
       const{queryStringParameters}= event;
      
        const {id:restaurantId} = queryStringParameters;

        const params = {
            TableName: tableName,
            Key: {
                'restaurant_id': restaurantId
            }
        };

        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Restaurant not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve restaurant' }),
        };
    }
};

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'table_reservation_app_restaurants';

exports.handler = async (event, context) => {
    const { restaurant_id } = event;
    if (!restaurant_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Restaurant ID is required' })
        };
    }

    const item = {
        restaurant_id: restaurant_id,
        res_name: event.name,
        res_closing_time: event.res_closing_time,
        res_opening_time: event.res_opening_time,
        res_location: event.res_location,
        res_total_tables: event.res_total_tables,
        res_image_url: event.res_image_url
    };

    const putParams = {
        TableName: tableName,
        Item: item
    };

    try {
        await dynamoDb.put(putParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Restaurant updated successfully' })
        };
    } catch (error) {
        console.error('Error updating restaurant:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not update restaurant' })
        };
    }
};

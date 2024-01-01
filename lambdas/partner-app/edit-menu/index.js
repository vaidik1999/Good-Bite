const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const { menu_id, items, menu_discount, menu_discount_rate, res_id } = requestBody;

        const params = {
            TableName: 'menu',
            Key: {
                menu_id: menu_id,
            },
            UpdateExpression: 'SET #items = :items, #menu_discount = :menu_discount, #menu_discount_rate = :menu_discount_rate, #res_id = :res_id',
            ExpressionAttributeNames: {
            '#items': 'items',
            '#menu_discount': 'menu_discount',
            '#menu_discount_rate': 'menu_discount_rate',
            '#res_id': 'res_id',
            },
            ExpressionAttributeValues: {
            ':items': items,
            ':menu_discount': menu_discount,
            ':menu_discount_rate': menu_discount_rate,
            ':res_id': res_id,
            },
            ReturnValues: 'ALL_NEW',
        };

        await dynamoDB.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify('Menu item updated successfully'),
        };
    } catch (error) {
        console.error('Error updating menu item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error updating menu item'),
        };
    }
};

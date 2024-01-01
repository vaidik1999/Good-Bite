const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { menu_id, item_id } = requestBody;

        // Retrieve the existing menu data
        const getMenuParams = {
            TableName: 'menu',
            Key: {
                menu_id: menu_id,
            },
        };

        const existingMenu = await dynamoDB.get(getMenuParams).promise();

        if (!existingMenu.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify('Menu not found'),
            };
        }

        // Remove the item from the "items" array
        const updatedItems = existingMenu.Item.items.filter(item => item.item_id !== item_id);
        console.log("updatedItems",updatedItems);
        // Update the menu with the modified "items" array
        const updateMenuParams = {
            TableName: 'menu',
            Key: {
                menu_id: menu_id,
            },
            UpdateExpression: 'SET #items = :updatedItems',
            ExpressionAttributeNames: {
                '#items': 'items',
            },
            ExpressionAttributeValues: {
                ':updatedItems': updatedItems,
            },
            ReturnValues: 'ALL_NEW',
        };

        await dynamoDB.update(updateMenuParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify('Menu item deleted successfully'),
        };
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error deleting menu item'),
        };
    }
};

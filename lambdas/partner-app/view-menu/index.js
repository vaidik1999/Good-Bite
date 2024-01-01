const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB();

exports.handler = async (event) => {
    try {
        const menuId = event.queryStringParameters.menu_id;
        console.log("menu_id", menuId);
        const params = {
            TableName: 'menu',
            Key: {
                menu_id: {
                    S: menuId
                }
            }
        };

        const result = await dynamoDB.getItem(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify('Menu not found'),
            };
        }

        const menuData = {
            menu_id: result.Item.menu_id.S,
            items: result.Item.items.L.map(item => ({
                category: item.M.category.L.map(category => category.S),
                description: item.M.description.S,
                item_discount: item.M.item_discount.BOOL,
                item_discount_rate: item.M.item_discount_rate.S,
                item_id: item.M.item_id.S,
                item_image_url: item.M.item_image_url.S,
                item_name: item.M.item_name.S
            })),
            menu_discount: result.Item.menu_discount.BOOL,
            menu_discount_rate: result.Item.menu_discount_rate.S,
            res_id: result.Item.res_id.S
        };

        return {
            statusCode: 200,
            body: JSON.stringify(menuData),
        };
    } catch (error) {
        console.error('Error fetching menu:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error fetching menu'),
        };
    }
};

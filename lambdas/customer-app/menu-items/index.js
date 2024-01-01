const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log("event:", event);
  const restaurantId = event.restaurantId;
  if (!restaurantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing restaurantId in query parameters",
      }),
    };
  }

  const params = {
    TableName: "restaurant_menu_details",
    FilterExpression: "res_id = :restaurantId",
    ExpressionAttributeValues: {
      ":restaurantId": restaurantId,
    },
  };
  console.log("params:", params);
  try {
    const data = await dynamoDB.scan(params).promise();
    console.log("data:", data);

    if (data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Restaurant not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

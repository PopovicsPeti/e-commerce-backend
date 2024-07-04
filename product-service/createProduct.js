const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event) => {
    console.log('Received event:', JSON.stringify(event));
    const { title, description, price } = JSON.parse(event.body);
    const productId = AWS.util.uuid.v4(); 

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
            id: productId,
            title: title,
            description: description,
            price: price
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Product created successfully",
                productId: productId,
                product: params.Item
            }),
             headers: {
                'Access-Control-Allow-Origin': '*', // Adjust this to your specific domain if needed
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
            }
        };
    } catch (error) {
        console.error('Create product failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create product' }),
             headers: {
                'Access-Control-Allow-Origin': '*', // Adjust this to your specific domain if needed
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
            }
        };
    }
};

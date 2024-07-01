const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event) => {
    const { title, description, price } = JSON.parse(event.body);
    const productId = AWS.util.uuid.v4(); // Generate unique ID for the product

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
            })
        };
    } catch (error) {
        console.error('Create product failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create product' })
        };
    }
};

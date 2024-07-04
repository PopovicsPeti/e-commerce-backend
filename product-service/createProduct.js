const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
            }
        };
    }

    const { title, description, price, count } = event;
    if (!title || !description || !price || count === undefined) {
        console.error('Missing one or more of the required fields:', { title, description, price, count });
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
            }
        };
    }

    const productId = AWS.util.uuid.v4(); // Assuming this method works in your environment

    const productParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
            id: productId,
            title: title,
            description: description,
            price: price
        }
    };

    const stockParams = {
        TableName: process.env.STOCK_TABLE,
        Item: {
            product_id: productId,
            count: count
        }
    };

    try {
        await dynamoDb.put(productParams).promise();
        await dynamoDb.put(stockParams).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Product created successfully",
                productId: productId,
                product: productParams.Item,
                stock: stockParams.Item
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
            }
        };
    } catch (error) {
        console.error('Create product or stock entry failed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create product or stock entry' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
            }
        };
    }
};

'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getProductById(productId) {
    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: {
            id: productId  
        }
    };
    const data = await dynamoDb.get(params).promise();
    return data.Item;
}

async function getStockById(productId) {
    const params = {
        TableName: process.env.STOCK_TABLE,
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {
            ':product_id': productId
        }
    };
    const data = await dynamoDb.query(params).promise();
    return data.Items[0]; 
}

module.exports.getProductById = async (event) => {
    const productId = event.pathParameters.productid;

    try {
        const product = await getProductById(productId);
        if (!product) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Product not found' }),
            };
        }

        const stock = await getStockById(productId);
        const productWithStock = {
            ...product,
            count: stock ? stock.count : 0 
        };

        return {
            statusCode: 200,
            body: JSON.stringify(productWithStock),
        };
    } catch (error) {
        console.error('Database operation failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load product' }),
        };
    }
};

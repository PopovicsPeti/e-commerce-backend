'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getProducts() {
    const params = {
        TableName: process.env.PRODUCT_TABLE,
    };
    const data = await dynamoDb.scan(params).promise();
    return data.Items;
}

async function getStock(productId) {
    const params = {
        TableName: process.env.STOCK_TABLE,
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {
            ':product_id': productId,
        }
    };
    const data = await dynamoDb.query(params).promise();
    return data.Items[0]; 
}

module.exports.getProductsList = async (event) => {
    try {
        const products = await getProducts();
        const productsWithStock = await Promise.all(products.map(async (product) => {
            const stock = await getStock(product.id);
            return { ...product, count: stock ? stock.count : 0 }; 
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(productsWithStock),
        };
    } catch (error) {
        console.error('Database operation failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load products' }),
        };
    }
};

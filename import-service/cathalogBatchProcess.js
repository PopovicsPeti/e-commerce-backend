const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const { v4: uuidv4 } = require('./layer/node_modules/uuid/dist/index.js'); // Ensure path correctness

exports.catalogBatchProcess = async (event) => {
    console.log("Batch process start:", JSON.stringify(event));

    const records = event.Records.map(record => JSON.parse(record.body));
    const results = [];

    for (let record of records) {
        console.log("Processing record:", record);
        if (record.price === null) {
            console.log("Skipping product due to null price:", record);
            continue;  // Skip products with null price
        }
        const result = await createProduct(record);
        results.push(result);
    }

    console.log("Batch processing complete.");
    return results;
};

const createProduct = async (productData) => {
    const { title, description, price } = productData;
    if (price === null) {
        console.log("Product price is null, cannot create product:", productData);
        return { status: 'error', message: 'Product price is null' };
    }
    
    const productId = uuidv4();
    const count = Math.floor(Math.random() * 10) + 1;  // Random stock count
    console.log("Creating product with ID:", productId, "and count:", count);

    const productParams = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
            id: productId,
            title: title,
            description: description,
            price: price | 0
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
        await Promise.all([
            dynamoDb.put(productParams).promise(),
            dynamoDb.put(stockParams).promise()
        ]);
        console.log("Product and stock created successfully:", productParams.Item);

        const message = {
            Message: JSON.stringify({
                default: "New product created",
                email: `New product created: ${JSON.stringify({...productParams.Item, count})}`
            }),
            TopicArn: process.env.SNS_TOPIC_ARN,
            MessageStructure: 'json'
        };
        await sns.publish(message).promise();
        console.log('Notification sent successfully.');

        return { status: 'success', message: 'Product and stock created successfully', data: {...productParams.Item, count} };
    } catch (error) {
        console.error('Create product failed:', error);
        return { status: 'error', message: 'Failed to create product', error };
    }
};

import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const dynamoDbClient = new DynamoDBClient();
const snsClient = new SNSClient();
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);  

const createProduct = async (productData) => {
    const { title, description, price } = productData;
    const productId = AWS.util.uuid.v4(); 
    const count = Math.floor(Math.random() * 10) + 1;

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
            id: productId,
            count: count
        }
    };

    try {
        await Promise.all([
            docClient.send(new PutCommand(productParams)),
            docClient.send(new PutCommand(stockParams))
        ]);
        console.log("Product and stock created successfully", productParams.Item);

        const message = {
            Message: JSON.stringify({
                default: "New product created",
                email: `New product created: ${JSON.stringify({...productParams.Item, count: count})}`
            }),
            TopicArn: process.env.SNS_TOPIC_ARN,
            MessageStructure: 'json'
        };
        await snsClient.send(new PublishCommand(message));
        console.log('Notification sent successfully.');

        return { status: 'success', message: 'Product and stock created successfully', data: {...productParams.Item, count: count} };
    } catch (error) {
        console.error('Create product failed', error);
        return { status: 'error', message: 'Failed to create product', error };
    }
};

export const catalogBatchProcess = async (event) => {
    const records = event.Records.map(record => JSON.parse(record.body));
    console.log("Batch process start:", records);
  
    for (let record of records) {
        console.log("Processing record:", record);
        await createProduct(record);  
    }
  
    console.log("Batch processing complete.");
};


const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;  // Ensure this environment variable is set

exports.handler = async (event) => {
    console.log("Function started, event:", JSON.stringify(event));
  
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        console.log(`Processing file from bucket: ${bucketName}, key: ${key}`);

        const params = {
            Bucket: bucketName,
            Key: key
        };

        try {
            console.log("Attempting to get object from S3 with params:", params);
            const s3Data = await s3.getObject(params).promise();
            const dataString = s3Data.Body.toString('utf-8');
            console.log('Data received from S3.');

            const csvLines = dataString.split('\n');
            for (let line of csvLines) {
                if (line.trim()) { // Skip empty lines
                    await sendProductDataToSQS(line);
                }
            }

            // After processing all lines, handle the file management
            const filename = key.split('/').pop();
            const destinationKey = `uploaded/${filename}`;
            console.log(`Copying file to: ${destinationKey}`);
            const copyParams = {
                Bucket: bucketName,
                CopySource: `${bucketName}/${key}`,
                Key: destinationKey
            };

            await s3.copyObject(copyParams).promise();
            console.log('File copied successfully.');

            console.log(`Deleting original file: ${key}`);
            await s3.deleteObject(params).promise();
            console.log('Original file deleted successfully.');

        } catch (err) {
            console.error(`Error processing file ${key} from bucket ${bucketName}:`, err);
        }
    }
};

// Helper function to parse CSV and send structured data to SQS
async function sendProductDataToSQS(csvLine) {
    const parts = csvLine.split(',');
    if (parts.length < 3) return; // Check for complete data
    const productData = {
        title: parts[0],
        description: parts[1],
        price: parseFloat(parts[2])
    };

    const message = {
        QueueUrl: SQS_QUEUE_URL,
        MessageBody: JSON.stringify(productData)
    };

    try {
        const sendResult = await sqs.sendMessage(message).promise();
        console.log('Message sent to SQS:', sendResult.MessageId, message.MessageBody);
    } catch (error) {
        console.error('Failed to send message to SQS:', error);
    }
}

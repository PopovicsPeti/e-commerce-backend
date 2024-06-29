const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log("Function started, event:", JSON.stringify(event));
  
  for (const record of event.Records) {
    const bucketName = 'product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p'; 
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    console.log(`Processing file from bucket: ${bucketName}, key: ${key}`);

    const params = {
        Bucket: bucketName,
        Key: key
    };

    try {
        console.log("Attempting to get object from S3 with params:", params);
        const data = await s3.getObject(params).promise();
        console.log('Data:', data.Body.toString('utf-8'));  
        
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

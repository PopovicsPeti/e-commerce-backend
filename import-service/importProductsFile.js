const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const fileName = event.queryStringParameters.name;
    const params = {
        Bucket: 'product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p',
        Key: `import/${fileName}`,
        Expires: 3600,  
        ContentType: 'text/csv',  
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode: 200,
            body: JSON.stringify({ signedUrl })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not generate URL" })
        };
    }
};

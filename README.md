backend for aws cloud modul Popovics Péter

<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

This template does not include any kind of persistence (database). For more advanced examples, check out the [serverless/examples repository](https://github.com/serverless/examples/) which includes Typescript, Mongo, DynamoDB and other examples.

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: serverless-http-api-dev-hello (1.6 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.

GetProductList -> https://yc1b9wcf50.execute-api.eu-north-1.amazonaws.com/default/products
GetProductById -> https://n6nzzwc7ok.execute-api.eu-north-1.amazonaws.com/default/getProductsbyid/94826239-97d5-4c38-91f0-dcfd72e0fe23
CreateProduct  -> https://c4jmdpe3ab.execute-api.eu-north-1.amazonaws.com/default/product-service-dev-addProduct
it works from postman if the body is provided with the required properties i tried with this one 
{
    "title": "Dixit",
    "description": "associaton/psichology card game",
    "price": 25
}

all products IDs can be found in the products.txt file

CreateSignedUrl -> https://bg1iuwjmod.execute-api.eu-north-1.amazonaws.com/default/import-service-dev-importProductsFile?name=products1.csv

The lambda copies the files from /import directory and puts them into /updated but i cannot log my data onto the console I even got an error message from the AWS deshbort thet they are not able to creat cloudWatch loggrup and even if i create one with the same name and try to set it properly and vire it together with the lambda the logs jusst dont appears there.

log from my AWS lambda consol (test result)

START RequestId: 3fd541ef-64f5-4d69-97e2-6e0a13a11fc3 Version: $LATEST
2024-06-29T13:52:47.649Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Function started, event: {"Records":[{"eventVersion":"2.1","eventSource":"aws:s3","awsRegion":"eu-north-1","eventTime":"2020-01-01T12:00:00.000Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"EXAMPLE"},"requestParameters":{"sourceIPAddress":"127.0.0.1"},"responseElements":{"x-amz-request-id":"C3D13FE58DE4C810","x-amz-id-2":"MzRISOwyjmnupNQW..."},"s3":{"s3SchemaVersion":"1.0","configurationId":"testConfigRule","bucket":{"name":"product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p","ownerIdentity":{"principalId":"A3NL1KOZZKExample"},"arn":"arn:aws:s3:::product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p"},"object":{"key":"import/products2.csv","size":1024,"eTag":"0123456789abcdef0123456789abcdef","sequencer":"0A1B2C3D4E5F678901"}}}]}
2024-06-29T13:52:47.650Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Processing file from bucket: product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p, key: import/products2.csv
2024-06-29T13:52:47.688Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Attempting to get object from S3 with params: {
  Bucket: 'product-service-dev-serverlessdeploymentbucket-zaa6fmhns43p',
  Key: 'import/products2.csv'
}
2024-06-29T13:52:48.609Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Data: 68d5a63a-20c5-46a5-b613-b9da4dbe6f9b,BoardGame_2046f5,Strategy and fun collide in this exciting board game.,94.64,10
7c74a440-7b58-4c71-8e3c-00a7406ea87b,BoardGame_05850a,Strategy and fun collide in this exciting board game.,80.22,10
9cd80f18-8bee-4d96-9820-33f2332fe397,BoardGame_b8a64b,Strategy and fun collide in this exciting board game.,117.94,12
da40348e-fb27-477f-ac2c-16111ac692ad,BoardGame_0fa8a1,Strategy and fun collide in this exciting board game.,32.43,16
5ddaf89a-992d-4370-ac28-e3a7ba35adff,BoardGame_fb80df,Strategy and fun collide in this exciting board game.,137.0,19
dd807523-fd6b-4ca8-be16-a3f095262ee0,BoardGame_9ec25f,Strategy and fun collide in this exciting board game.,139.53,14
5785747a-2a28-454c-8a3b-c8987e0abdef,BoardGame_752e20,Strategy and fun collide in this exciting board game.,23.42,17
c87c348e-b1b6-4163-96a2-dd9f42f3c3a0,BoardGame_961704,Strategy and fun collide in this exciting board game.,85.45,15
15a24570-715a-4b56-babb-210670e64963,BoardGame_ec860d,Strategy and fun collide in this exciting board game.,129.84,13
e3d80bc6-2ee5-4d43-8452-2f61fa761d30,BoardGame_0aaa1e,Strategy and fun collide in this exciting board game.,125.86,6

2024-06-29T13:52:48.609Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Copying file to: uploaded/products2.csv
2024-06-29T13:52:48.852Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	File copied successfully.
2024-06-29T13:52:48.852Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Deleting original file: import/products2.csv
2024-06-29T13:52:49.014Z	3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	INFO	Original file deleted successfully.
END RequestId: 3fd541ef-64f5-4d69-97e2-6e0a13a11fc3
REPORT RequestId: 3fd541ef-64f5-4d69-97e2-6e0a13a11fc3	Duration: 1398.93 ms	Billed Duration: 1399 ms	Memory Size: 128 MB	Max Memory Used: 87 MB	Init Duration: 450.90 ms


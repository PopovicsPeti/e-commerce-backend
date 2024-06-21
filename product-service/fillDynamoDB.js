const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-north-1'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsTable = process.env.PRODUCTS_TABLE;
const stockTable = process.env.STOCK_TABLE;

const products = [
  { title: "Anachrony", price: 29.99, description: "Heavy euro board game" },
  { title: "Ark Nova", price: 40.99, description: "Heavy euro board game" },
  { title: "Bloodrage", price: 13.99, description: "Confrontative game" },
  { title: "Brass", price: 15, description: "Heavy euro board game" },
  { title: "Citadella", price: 23, description: "Role play card game" },
  { title: "Five Tribes", price: 23, description: "Strategic board game" },
  { title: "Gaia Project", price: 15, description: "Heavy euro board game" },
  { title: "Terraforming Mars", price: 15, description: "Euro board game" }
];

const insertTestData = async () => {
  for (const product of products) {
    const id = AWS.util.uuid.v4();
    const productItem = {
      id,
      title: product.title,
      description: product.description,
      price: product.price
    };

    const stockItem = {
      product_id: id,
      count: Math.floor(Math.random() * 100) + 1
    };

    try {
      await dynamoDb.put({
        TableName: productsTable,
        Item: productItem
      }).promise();

      await dynamoDb.put({
        TableName: stockTable,
        Item: stockItem
      }).promise();

      console.log(`Inserted product: ${product.title} with stock count: ${stockItem.count}`);
    } catch (error) {
      console.error(`Error inserting product: ${product.title}`, error);
      throw error; 
    }
  }
};

module.exports.insertTestData = async (event) => {
  try {
    await insertTestData();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data insertion completed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};

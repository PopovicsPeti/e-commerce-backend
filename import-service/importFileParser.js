const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const csv = require('csv-parser');

module.exports.importFileParser = async (event) => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    const params = {
      Bucket: bucketName,
      Key: key
    };

    const results = [];

    try {
      const s3Stream = s3.getObject(params).createReadStream();
      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
          results.push(data);
        })
        .on('end', () => {
          console.log(`CSV file ${key} processing complete. Total records: ${results.length}`);
        });
    } catch (err) {
      console.error(`Error processing file ${key} from bucket ${bucketName}:`, err);
      throw err;
    }
  }
};


const fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAQ6CRAKVDST2LSDRU';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: "chitchatprofilepics",
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};


uploadFile('cat.jpg');
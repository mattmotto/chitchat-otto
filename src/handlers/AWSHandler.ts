var AWS = require('aws-sdk');
var uuid = require('uuid');
const fs = require('fs');

import {Users} from '../models/users';

const ID = 'AKIAQ6CRAKVDST2LSDRU';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

export class SSS {
	uploadProfPic(user, picture) {
		const fileContent = fs.readFileSync(picture);

		let url = '';

		const params = {
	        Bucket: "chitchatprofilepics",
	        Key: user + 'profilepic.jpg',
	        Body: fileContent
	    };

	    s3.upload(params, function(err, data) {
	        if (err) {
	            throw err;
	        }
	        url = data.Location;
	        console.log(`File uploaded successfully. ${data.Location}`);
	    });

	    new Users().updateProfPic(user, url);
	}
}
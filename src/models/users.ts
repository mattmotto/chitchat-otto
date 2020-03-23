import * as sql from "./db"
import * as crypto from 'crypto';

export class Users {

	private table:String = "USERS";
	private sqlClient:any = (sql as any);

	makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id):void {
		console.log(password);
		let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
		this.sqlClient.query("INSERT INTO USERS (name, email, password_hash, university, photo_url, instagram_id, snapchat_id)\
								VALUES ("+name+", "+email+", "+hashedPassword+", "+university+", "+photo_url+", "+instagram_id+", "+snapchat_id+");", (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted new user!");
		})
	}
}

	
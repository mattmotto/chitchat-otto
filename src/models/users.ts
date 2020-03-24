import * as sql from "./db"
import * as crypto from 'crypto';

export class Users {

	private table:String = "USERS";
	private sqlClient:any = (sql as any);

	makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id):void {
		let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
		let sqlquery = "INSERT INTO USERS (`name`, `email`, `password_hash`, `university`, `photo_url`, `instagram_id`, `snapchat_id`, `signed_up`, `last_login`)\
								VALUES ('"+name+"', '"+email+"', '" +hashedPassword+"', "+university+", '"+photo_url+"', '"+instagram_id+"', '"+snapchat_id+"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
		this.sqlClient.query(sqlquery, (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted new user! email: " + email);
		});
	}

	getUser(auto_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT auto_id, name, email, university, photo_url, instagram_id, snapchat_id FROM USERS WHERE auto_id=" +auto_id+";", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	loginUser(email, password): Promise<Object>{
		return new Promise((resolve, reject) => {
			let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
			this.sqlClient.query("SELECT email, password_hash, auto_id FROM USERS WHERE email='" +email+"';", (err, results, fields) => {
				if (results.length==0){
					resolve({"status":1});
				}
				else if (hashedPassword != results[0]['password_hash']){
					resolve({"status":2});
				}
				else{
					resolve({"status":0, "auto_id":results[0]['auto_id']});
				}
			});
		});
	}

	updateLoginTime(user): void {
		let sqlquery = "UPDATE USERS SET last_login=CURRENT_TIMESTAMP WHERE auto_id=" + user + ";";
		this.sqlClient.query(sqlquery, (err, results, fields) => {
			if (err) throw err;
		})
	}
}

	
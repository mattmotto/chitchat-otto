import * as sql from "./db"
import * as crypto from 'crypto';

export class Users {

	private table:String = "USERS";
	private sqlClient:any = (sql as any);

	makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id):void {
		let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
		let sqlquery = "INSERT INTO USERS (`name`, `email`, `password_hash`, `university`, `photo_url`, `instagram_id`, `snapchat_id`)\
								VALUES ('"+name+"', '"+email+"', '" +hashedPassword+"', "+university+", '"+photo_url+"', '"+instagram_id+"', '"+snapchat_id+"');";
		this.sqlClient.query(sqlquery, (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted new user!");
		});
	}

	getUser(auto_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT auto_id, name, email, university, photo_url, instagram_id, snapchat_id FROM USERS WHERE auto_id=" +auto_id+";", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	loginUser(email, password): Promise<Integer>{
		let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
		let user = new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT email, password_hash FROM USERS WHERE email=" +email+";", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});

		if (user.length == 0){
			return 1;
		}
		else if (hashedPassword != user['password_hash']){
			return 2;
		}
		else{
			return 0;
		}
	}
}

	
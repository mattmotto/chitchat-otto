import * as sql from "./db"
import * as crypto from 'crypto';

export class Users {

	private table:String = "USERS";
	private sqlClient:any = (sql as any);

	makeUser(name, email, password, university, photo_url, instagram_id, snapchat_id):Promise<Object> {		
		let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
		let checkQuery = "SELECT * FROM USERS WHERE email='" + email + "';"
		let sqlquery = "INSERT INTO USERS (`name`, `email`, `password_hash`, `university`, `photo_url`, `instagram_id`, `snapchat_id`, `signed_up`)\
								VALUES ('"+name+"', '"+email+"', '" +hashedPassword+"', '"+university+"', '"+photo_url+"', '"+instagram_id+"', '"+snapchat_id+"', CURRENT_TIMESTAMP);";
		return new Promise((resolve, reject) => {
			this.sqlClient.query(checkQuery, (err, results, fields) => {
				if (err) throw err;
				if (results.length==0){
					this.sqlClient.query(sqlquery, (err, results, fields) => {
						if (err) throw err;
						console.log("Inserted new user! email: " + email);
						resolve({"status":0});
					});
				}
				else {
					resolve({"status":1});
				}
			});
		});
	}

	getUser(auto_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT auto_id, name, email, university, photo_url, instagram_id, snapchat_id, is_banned FROM USERS WHERE auto_id=" +auto_id+";", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	getUserByEmail(email): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT auto_id, name, email, university, photo_url, instagram_id, snapchat_id, is_banned FROM USERS WHERE email='" +email+"';", (err, results, fields) => {
				console.log(results);
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	loginUser(email, password): Promise<Object>{
		return new Promise((resolve, reject) => {
			let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
			this.sqlClient.query("SELECT email, password_hash, auto_id, is_banned, last_login FROM USERS WHERE email='" +email+"';", (err, results, fields) => {
				if (results.length==0){
					resolve({"status":1});
				}
				else if (hashedPassword != results[0]['password_hash']){
					resolve({"status":2});
				}
				else if (results[0]['is_banned'] == 1){
					resolve({'status':3});
				}
				else{
					resolve({"status":0, "auto_id":results[0]['auto_id'], "last_login":results[0]['last_login']});
				}
			});
		});
	}

	updateLoginTime(user): void {
		let sqlquery = "UPDATE USERS SET last_login=CURRENT_TIMESTAMP WHERE auto_id=" + user + ";";
		this.sqlClient.query(sqlquery, (err, results, fields) => {
			if (err) throw err;
		});
	}

	banUser(user): void {
		let sqlquery = "UPDATE USERS SET is_banned=1 where auto_id=" + user + ";";
		this.sqlClient.query(sqlquery, (err, results, fields) => {
			if (err) throw err;
		});
	}
}

	
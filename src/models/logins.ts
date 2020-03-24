import * as sql from "./db"

export class Logins{
	private table:String = "LOGINS";
	private sqlClient:any = (sql as any);

	addLogin(user): void{
		this.sqlClient.query("INSERT INTO LOGINS (user_id, login_time) VALUES (" + user + ", CURRENT_TIMESTAMP);", (err, results, fields) => {
			if (err) throw err;
		});
	}
}
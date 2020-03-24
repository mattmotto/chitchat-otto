import * as sql from "./db"

export class Matches{
	private table:String = "MATCHES";
	private sqlClient:any = (sql as any);

	makeMatch(user_1, user_2):void{
		this.sqlClient.query("INSERT INTO MACTHES (user_1, user_2) VALUES(" + user_1 + ", " + user_2 + ");", (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted new match!");
		});

		this.sqlClient.query("INSERT INTO MACTHES (user_1, user_2) VALUES(" + user_2 + ", " + user_1 + ");", (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted new match!");
		});
	}

	getMatches(user_1): Promise<Object>{
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT auto_id, user_1, user_2 FROM MATCHES WHERE user_1=" + user_1 + " AND DELTED != 1;"), (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	deleteMatch(user_1, user_2):void{
		this.sqlClient.query("UPDATE MATCHES SET deleted=1 WHERE user_1=" + user_1 + " and user_2=" + user_2 + ";", (err, results, fields) => {
			if (err) throw err;
			console.log("Made pair!");
		});

		this.sqlClient.query("UPDATE MATCHES SET deleted=1 WHERE user_1=" + user_2 + " and user_2=" + user_1 + ";", (err, results, fields) => {
			if (err) throw err;
			console.log("Made pair!");
		});
	}
}
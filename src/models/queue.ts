import * as sql from "./db"

export class Queue {

	private table:String = "QUEUE";
	private sqlClient:any = (sql as any)

	private addToQueue(socket_id): void {
		this.sqlClient.query("INSERT INTO QUEUE (socket_id) VALUES ("+socket_id+")", (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted: "+socket_id)
		})
	}

	private getFromQueue(): Promise<String> {
		return new Promise((resolve, reject) => {
				this.sqlClient.query("SELECT * FROM QUEUE ORDER BY auto_id LIMIT 1;", async (err, results, fields) => {
				if (err) throw err;
				let target = results[0]["socket_id"];

				const delResult = await this.deleteFromQueue(target);

				if (delResult) {
					resolve(target);
				} else {
					console.log("Unexpected Failure");
					reject(null);
				}
			})
		})	
	}

	private deleteFromQueue(socket_id): Promise<Boolean> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("DELETE FROM QUEUE WHERE socket_id="+socket_id, (err, results, fields) => {
				if (err) throw err;
				resolve(true);
			})
		});
	}
}
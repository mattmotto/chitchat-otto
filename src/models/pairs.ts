import * as sql from "./db"

export class Pairs {

	private table:String = "CURRENT_PAIRS";
	private sqlClient:any = (sql as any);

	private getMatch(socket_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket_id+"\" OR socket_id_2=\""+socket_id+"\" LIMIT 1;", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	private findMatch(): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_2 IS NULL", (err, results, fields) => {
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	private makeMatch(current_socket, new_socket) {
		this.sqlClient.query("UPDATE CURRENT_PAIRS SET socket_id_2=\""+new_socket+"\" WHERE socket_id_1=\""+current_socket+"\"", (err, results, fields) => {
			if (err) throw err;
			console.log("Made pair!");
		})
	}

	private removeEntry(socket) {
		this.sqlClient.query("DELETE FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket+"\" OR socket_id_2=\""+socket+"\"", (err, results, fields) => {
			if (err) throw err;
			console.log("Removed pair!");
		})
	}

	private addLoneSocket(socket) {
		this.sqlClient.query("INSERT INTO CURRENT_PAIRS (socket_id_1) VALUES (\""+socket+"\")", (err, results, fields) => {
			if (err) throw err;
			console.log("Inserted lone pair!");
		})
	}
}
import * as sql from "./db"
import { resolve } from "dns";

export class Pairs {

	private table:String = "CURRENT_PAIRS";
	private sqlClient:any = (sql as any);

	private getMatch(socket_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket_id+"\" OR socket_id_2=\""+socket_id+"\" LIMIT 1;", (err, results, fields) => {
				if (err) throw err;
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	private findMatch(): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_2 IS NULL", (err, results, fields) => {
				if (err) throw err;
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	private makeMatch(current_socket, new_socket) {
		this.sqlClient.query("UPDATE CURRENT_PAIRS SET socket_id_2=\""+new_socket+"\" WHERE socket_id_1=\""+current_socket+"\"", (err, results, fields) => {
			if (err) throw err;
		})
	}

	private removeEntry(socket): Promise<String> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket+"\" LIMIT 1", (err, results, fields) => {
				if (err) throw err;
				if(!results || results.length==0) {
					this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_2=\""+socket+"\" LIMIT 1", (err, results, fields) => {
						if (err) throw err;
						if(results && results.length > 0) {
							this.sqlClient.query("DELETE FROM CURRENT_PAIRS WHERE socket_id_2=\""+socket+"\"", (err, deleteResults, fields) => {
								if (err) throw err;
								resolve(results[0]["socket_id_1"]);
							})
						} else {
							resolve(null);
						}
					})
				} else {
					console.log(JSON.stringify(results))
					this.sqlClient.query("DELETE FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket+"\"", (err, deleteResults, fields) => {
						if (err) throw err;
						resolve(results[0]["socket_id_2"])
					})
				}
			})
		})
	}

	private addLoneSocket(socket) {
		this.sqlClient.query("INSERT INTO CURRENT_PAIRS (socket_id_1) VALUES (\""+socket+"\")", (err, results, fields) => {
			if (err) throw err;
		})
	}
}
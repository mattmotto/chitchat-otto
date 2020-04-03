import * as sql from "./db"
import { resolve } from "dns";
import {Users} from "./users";

export class Pairs {

	private table:String = "CURRENT_PAIRS";
	private sqlClient:any = (sql as any);

	getMatch(socket_id): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket_id+"\" OR socket_id_2=\""+socket_id+"\" LIMIT 1;", (err, results, fields) => {
				if (err) throw err;
				resolve(results.length==0 ? {} : results[0])
			});
		});
	}

	async findMatch(email, mode): Promise<Object> {
		return new Promise(async (resolve, reject) => {
			if (mode == 'C'){
				let data = await new Users().getUserByEmail(email);
				this.sqlClient.query("Select current_pairs.auto_id, `user_1`, `email_1`, `socket_id_1`, `mode_1`, `university` from current_pairs\
	join users on current_pairs.user_1 = users.auto_id\
	where current_pairs.socket_id_2 is null and `university` = '"+ data['university'] + "' and `mode_1` = 'C';", (err, results, fields) => {
					if (err) throw err;
					resolve(results.length==0 ? {} : results[0])
				});
			} else{
				this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_2 IS NULL and mode_1='G';", (err, results, fields) => {
					if (err) throw err;
					resolve(results.length==0 ? {} : results[0])
				});
			}
		});
	}

	async makeMatch(current_socket, new_socket, email, mode) {
		let data = await new Users().getUserByEmail(email);
		this.sqlClient.query("UPDATE CURRENT_PAIRS SET user_2="+data['auto_id']+", email_2=\""+data['email']+"\", socket_id_2=\""+new_socket+"\", mode_2=\""+mode+"\" WHERE socket_id_1=\""+current_socket+"\"", (err, results, fields) => {
			if (err) throw err;
		});
	}

	removeEntry(socket): Promise<String> {
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
					this.sqlClient.query("DELETE FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket+"\"", (err, deleteResults, fields) => {
						if (err) throw err;
						resolve(results[0]["socket_id_2"])
					})
				}
			})
		})
	}

	async addLoneSocket(socket, email, mode) {
		let data = await new Users().getUserByEmail(email);
		this.sqlClient.query("INSERT INTO CURRENT_PAIRS (user_1, email_1, mode_1, socket_id_1) VALUES ("+data['auto_id']+", \""+data['email']+"\", \""+mode+"\", \""+socket+"\");", (err, results, fields) => {
			if (err) throw err; 
		})
	}

	private getUserFromSocket(socket_id): Promise<Number> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT user_1 FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket_id+"\" LIMIT 1;", (err, results, fields) => {
				if (err) throw err;
				if(results.length != 0) {
					resolve(results[0]["user_1"])
				} else {
					this.sqlClient.query("SELECT user_2 FROM CURRENT_PAIRS WHERE socket_id_2=\""+socket_id+"\" LIMIT 1;", (err, results, fields) => {
						if (err) throw err;
						resolve((results.length !=0 ? results[0]["user_2"] : -1));
					})
				}
			});
		})
	}

	getUserData(socket_id): Promise<Object> {
		return new Promise( async (resolve, reject) => {
			const auto_id = await this.getUserFromSocket(socket_id);
			console.log("FOUND ID: "+JSON.stringify(auto_id))
			const result = await new Users().getUser(auto_id);
			resolve(result);
		})
	}

	fetchMatchData(socket_id, mode): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_1=\""+socket_id+"\" AND mode_1=\""+mode+"\" LIMIT 1;", (err, results, fields) => {
				if (err) throw err;
				if(results.length != 0) {
					resolve(results[0])
				} else {
					this.sqlClient.query("SELECT * FROM CURRENT_PAIRS WHERE socket_id_2=\""+socket_id+"\" AND mode_2=\""+mode+"\" LIMIT 1;", (err, results, fields) => {
						if (err) throw err;
						resolve((results.length !=0 ? results[0] : -1));
					})
				}
			});
		})
	}

	getAllActive(): Promise<Object>{
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT COUNT(auto_id) AS total_paired FROM CURRENT_PAIRS WHERE socket_id_2 is not null;", (err, results, fields) => {
				if (err) throw err;
				this.sqlClient.query("SELECT COUNT(auto_id) AS total_lone FROM CURRENT_PAIRS WHERE socket_id_2 is null;", (err2, results2, fields2) => {
					if (err2) throw err2;
					let total = results2[0]['total_lone'] + (2 * results[0]['total_paired']);
					resolve({'numUsers': total});
				});
			});
		});
	}
}
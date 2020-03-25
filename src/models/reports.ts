import * as sql from "./db"

export class Reports{
	private table:String = "REPORTS";
	private sqlClient:any = (sql as any);

	reportUser(user, report_description): void {
		let sqlQuery = "INSERT INTO REPORTS (`user_id`, `report_time`, `report_description`) VALUES (" + user + ", CURRENT_TIMESTAMP, '" + report_description + "');";
		this.sqlClient.query(sqlQuery, (err, results, fields) => {
			if (err) throw err;
		});
	}
}
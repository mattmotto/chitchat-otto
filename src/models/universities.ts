import * as sql from "./db"

export class Universities{
	private table:String = "UNIVERSITIES";
	private sqlClient:any = (sql as any);

	getUniversityNames(): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT name FROM UNIVERSITIES", (err, results, fields) => {
				resolve(results.length==0 ? {} : results);
			});
		});
	}
}
import * as sql from "./db"

export class Universities{
	private table:String = "UNIVERSITIES";
	private sqlClient:any = (sql as any);

	getUniversityNames(): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.sqlClient.query("SELECT name, email FROM UNIVERSITIES", (err, results, fields) => {
				if (err) throw err;
				resolve(results.length==0 ? {} : results);
			});
		});
	}
}
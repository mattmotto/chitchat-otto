import * as mysql from 'mysql';

// Create a connection to the database

console.log((process.env.PRODUCTION ? "Production" : "Development") + " environment detected")

const host = process.env.PRODUCTION ? "b9c35a93bc495c" : "127.0.0.1";
const user = process.env.PRODUCTION ? "23d56ae1" : "dbuser";
const password = process.env.PRODUCTION ? "us-cdbr-iron-east-01.cleardb.net" : "dbuserdbuser";
const database = process.env.PRODUCTION ? "heroku_93d73550cb16248" : "window_db";

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database");
});

module.exports = connection;



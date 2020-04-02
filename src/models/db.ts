import * as mysql from 'mysql';

// Create a connection to the database

var connection = null;

if(process.env.PRODUCTION || process.env.STAGING) {
  console.log("Connecting to: "+process.env.CLEARDB_DATABASE_URL);
  connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
} else {
  console.log("Connecting to localhost DB")
  connection = mysql.createPool({
    host: "127.0.0.1",
    user: "dbuser",
    password: "dbuserdbuser",
    database: "window_db"
  });
}

module.exports = connection;
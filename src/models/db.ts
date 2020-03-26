import * as mysql from 'mysql';

// Create a connection to the database

var connection = null;

if(process.env.CLEARDB_DATABASE_URL) {
  console.log("Connecting to: "+process.env.CLEARDB_DATABASE_URL);
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
} else {
  console.log("Connecting to localhost DB")
  connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "dbuser",
    password: "dbuserdbuser",
    database: "window_db"
  });
}

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database");
});

module.exports = connection;



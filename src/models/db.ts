import * as mysql from 'mysql';

// Create a connection to the database

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'dbuserdbuser',
  database: 'window_db'
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;



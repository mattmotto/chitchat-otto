import pymysql

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables
	connectionInstance = pymysql.connect(host="127.0.0.1", user="dbuser", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")
	try:
		cursor = connectionInstance.cursor()

		cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")
		queue_db = '''CREATE TABLE CURRENT_PAIRS (
		auto_id INT NOT NULL AUTO_INCREMENT,
		socket_id_1 VARCHAR(100) NOT NULL,
		socket_id_2 VARCHAR(100),
		PRIMARY KEY(auto_id)
		);'''
		cursor.execute(queue_db)

		# TODO: Create the rest of the tables, and execute the SQL for them

		# Can you finish the rest @Otto?
		user_db = '''CREATE TABLE USERS (
		  auto_id INT NOT NULL AUTO_INCREMENT,
		  name VARCHAR(100) NOT NULL,
		  email VARCHAR(100) NOT NULL,
		  university VARCHAR(100) NOT NULL,
		  photo_url VARCHAR(300) NOT NULL,
		  instagram_id VARCHAR(100) NOT NULL,
		  snapchat_id VARCHAR(100) NOT NULL,
		  PRIMARY KEY(auto_id),
		  FOREIGN KEY (university) REFERENCES UNIVERSITIES(name)
		);'''
		connectionInstance.commit()
		print("Done! Closing DB connection")
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()


	
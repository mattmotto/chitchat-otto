import pymysql

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables
	connectionInstance = pymysql.connect(host="127.0.0.1", user="root", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")
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

		# Can you finish the rest @Otto? I would fucking love to -Otto
		cursor.execute("DROP TABLE IF EXISTS USERS;")
		user_db = '''CREATE TABLE USERS (
		  auto_id INT NOT NULL AUTO_INCREMENT,
		  name VARCHAR(100) NOT NULL,
		  email VARCHAR(100) NOT NULL,
		  password_hash VARCHAR(100) NOT NULL,
		  university VARCHAR(100) NOT NULL,
		  photo_url VARCHAR(300) NOT NULL,
		  instagram_id VARCHAR(100) NOT NULL,
		  snapchat_id VARCHAR(100) NOT NULL,
		  PRIMARY KEY(auto_id),
		  CONSTRAINT `USERS_ibfk_1` FOREIGN KEY (university) REFERENCES UNIVERSITIES (name)
		);'''

		cursor.execute("DROP TABLE IF EXISTS MATCHES;")
		matches_db = '''CREATE TABLE MATCHES (
			auto_id INT NOT NULL AUTO_INCREMENT,
			FOREIGN KEY (user) REFERENCES USERS(auto_id),
			FOREIGN KEY (match) REFERENCES USERS(auto_id),
			PRIMARY KEY(user, auto_id)
			);'''
		cursor.execute(matches_db)

		cursor.execute("DROP TABLE IF EXISTS UNIVERSITIES;")
		universities_db = '''CREATE TABLE UNIVERSITIES (
			auto_id INT NOT NULL AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) NOT NULL,
			country VARCHAR(100) NOT NULL,
			PRIMARY KEY(auto_id, name)
			);
		'''
		cursor.execute(universities_db)

		cursor.execute(user_db)

		connectionInstance.commit()
		print("Done! Closing DB connection")
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()


	
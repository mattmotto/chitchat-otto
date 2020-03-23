import pymysql

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables
	connectionInstance = pymysql.connect(host="127.0.0.1", user="root", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")
	try:
		cursor = connectionInstance.cursor()

		# cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")
		queue_db = '''CREATE TABLE CURRENT_PAIRS (
		auto_id INT NOT NULL AUTO_INCREMENT,
		socket_id_1 VARCHAR(100) NOT NULL,
		socket_id_2 VARCHAR(100),
		PRIMARY KEY(auto_id)
		);'''

		# TODO: Create the rest of the tables, and execute the SQL for them

		# Can you finish the rest @Otto? I would fucking love to -Otto
		# cursor.execute("DROP TABLE IF EXISTS USERS;")
		user_db = '''CREATE TABLE USERS (
		  auto_id INT NOT NULL AUTO_INCREMENT,
		  name VARCHAR(100) NOT NULL,
		  email VARCHAR(100) NOT NULL,
		  password_hash VARCHAR(100) NOT NULL,
		  university INT NOT NULL,
		  photo_url VARCHAR(300) NOT NULL,
		  instagram_id VARCHAR(100) NOT NULL,
		  snapchat_id VARCHAR(100) NOT NULL,
		  is_banned BINARY(1) NOT NULL DEFAULT 0,
		  PRIMARY KEY(auto_id),
		  CONSTRAINT `USERS_ibfk_1` FOREIGN KEY (university) REFERENCES UNIVERSITIES (auto_id)
		);'''

		# cursor.execute("DROP TABLE IF EXISTS MATCHES;")
		# matches_db = '''CREATE TABLE MATCHES (
		# 	auto_id INT NOT NULL AUTO_INCREMENT,
		# 	user INT NOT NULL,
		# 	match INT NOT NULL,
		# 	PRIMARY KEY(user, auto_id),
		# 	CONSTRAINT `MATCHES_ibfk_1` FOREIGN KEY (user) REFERENCES USERS (auto_id),
		# 	CONSTRAINT `MATCHES_ibfk_2` FOREIGN KEY (match) REFERENCES USERS (auto_id)
		# 	);'''

		matches_db = '''CREATE TABLE `window_db`.`MATCHES` (
						  `auto_id` INT NOT NULL AUTO_INCREMENT,
						  `user_1` INT NOT NULL,
						  `user_2` INT NOT NULL,
						  PRIMARY KEY (`auto_id`, `user_1`),
						  INDEX `user_1_idx` (`user_1` ASC) VISIBLE,
						  INDEX `user_2_idx` (`user_2` ASC) VISIBLE,
						  CONSTRAINT `user_1`
						    FOREIGN KEY (`user_1`)
						    REFERENCES `window_db`.`USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION,
						  CONSTRAINT `user_2`
						    FOREIGN KEY (`user_2`)
						    REFERENCES `window_db`.`USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION);'''

		# cursor.execute("DROP TABLE IF EXISTS UNIVERSITIES;")
		universities_db = '''CREATE TABLE UNIVERSITIES (
			auto_id INT NOT NULL AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) NOT NULL,
			country VARCHAR(100) NOT NULL,
			PRIMARY KEY(auto_id, name)
			);
		'''

		cursor.execute("DROP TABLE IF EXISTS MATCHES;")
		cursor.execute("DROP TABLE IF EXISTS USERS;")
		cursor.execute("DROP TABLE IF EXISTS UNIVERSITIES;")
		cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")

		cursor.execute(queue_db)
		cursor.execute(universities_db)
		cursor.execute(user_db)
		cursor.execute(matches_db)

		connectionInstance.commit()
		print("Done! Closing DB connection")
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()


	
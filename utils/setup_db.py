import pymysql

remote_username="b9c35a93bc495c"
remote_password="23d56ae1"
remote_host="us-cdbr-iron-east-01.cleardb.net"
remote_db="heroku_93d73550cb16248"

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables
	connectionInstance = pymysql.connect(host=remote_host, user=remote_username, password=remote_password ,cursorclass=pymysql.cursors.DictCursor, database=remote_db)
	# connectionInstance = pymysql.connect(host="127.0.0.1", user="dbuser", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")
	try:
		cursor = connectionInstance.cursor()

		# cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")
		queue_db = '''CREATE TABLE CURRENT_PAIRS (
		auto_id BIGINT NOT NULL AUTO_INCREMENT,
		socket_id_1 VARCHAR(100) NOT NULL,
		socket_id_2 VARCHAR(100),
		PRIMARY KEY(auto_id)
		);'''

		# cursor.execute("DROP TABLE IF EXISTS USERS;")
		user_db = '''CREATE TABLE USERS (
		  auto_id BIGINT NOT NULL AUTO_INCREMENT,
		  name VARCHAR(100) NOT NULL,
		  email VARCHAR(100) NOT NULL,
		  password_hash VARCHAR(100) NOT NULL,
		  university VARCHAR(100) NOT NULL,
		  photo_url VARCHAR(300) NOT NULL,
		  instagram_id VARCHAR(100) NOT NULL,
		  snapchat_id VARCHAR(100) NOT NULL,
		  signed_up TIMESTAMP NOT NULL,
		  last_login TIMESTAMP NOT NULL,
		  is_banned BIT(1) NOT NULL DEFAULT 0,
		  PRIMARY KEY(auto_id, name),
		  CONSTRAINT `name`
			  FOREIGN KEY (`university`)
			  REFERENCES `UNIVERSITIES` (`name`)
			  ON DELETE NO ACTION
			  ON UPDATE NO ACTION
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

		matches_db = '''CREATE TABLE `MATCHES` (
						  `auto_id` BIGINT NOT NULL AUTO_INCREMENT,
						  `user_1` BIGINT NOT NULL,
						  `user_2` BIGINT NOT NULL,
						  `deleted` BINARY(1) NOT NULL DEFAULT 0,
						  PRIMARY KEY (`auto_id`, `user_1`),
						  INDEX `user_1_idx` (`user_1` ASC),
						  INDEX `user_2_idx` (`user_2` ASC),
						  CONSTRAINT `user_1`
						    FOREIGN KEY (`user_1`)
						    REFERENCES `USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION,
						  CONSTRAINT `user_2`
						    FOREIGN KEY (`user_2`)
						    REFERENCES `USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION);'''

		universities_db = '''CREATE TABLE UNIVERSITIES (
			auto_id INT NOT NULL AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) NOT NULL,
			country VARCHAR(100) NOT NULL,
			PRIMARY KEY(auto_id, name),
			INDEX `indec` (`name` ASC)
			);
		'''

		logins_db = '''CREATE TABLE LOGINS (
		auto_id BIGINT NOT NULL AUTO_INCREMENT,
		user_id BIGINT NOT NULL,
		login_time TIMESTAMP NOT NULL,
		PRIMARY KEY(auto_id, user_id),
		INDEX user_id_idx (user_id ASC),
		CONSTRAINT user_id
			FOREIGN KEY (user_id)
			REFERENCES USERS (auto_id)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION
		);
		'''

		
		reports_db = '''CREATE TABLE `REPORTS` (
						  `auto_id` BIGINT NOT NULL AUTO_INCREMENT,
						  `user_id` BIGINT NOT NULL,
						  `report_time` TIMESTAMP NOT NULL,
						  `reported_by` BIGINT NOT NULL,
						  `report_description` TEXT NULL,
						  PRIMARY KEY (`auto_id`, `user_id`),
						  INDEX `auto_id_idx` (`user_id` ASC),
						  INDEX `reported_by_idx` (`reported_by` ASC),
						  CONSTRAINT `user_id_c`
						    FOREIGN KEY (`user_id`)
						    REFERENCES `USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION,
						  CONSTRAINT `reported_by`
						    FOREIGN KEY (`reported_by`)
						    REFERENCES `USERS` (`auto_id`)
						    ON DELETE NO ACTION
						    ON UPDATE NO ACTION);
		'''

		print("Dropping tables...")

		cursor.execute("DROP TABLE IF EXISTS REPORTS;")
		cursor.execute("DROP TABLE IF EXISTS LOGINS;")
		cursor.execute("DROP TABLE IF EXISTS MATCHES;")
		cursor.execute("DROP TABLE IF EXISTS USERS;")
		cursor.execute("DROP TABLE IF EXISTS UNIVERSITIES;")
		cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")


		print("Creating tables...")
		cursor.execute(queue_db)
		cursor.execute(universities_db)
		cursor.execute(user_db)
		cursor.execute(matches_db)
		cursor.execute(logins_db)
		cursor.execute(reports_db)

		connectionInstance.commit()
		print("Done! Closing DB connection")
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()
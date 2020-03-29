import pymysql
from sqlalchemy import create_engine
import pandas as pd

remote_username="b9c35a93bc495c"
remote_password="23d56ae1"
remote_host="us-cdbr-iron-east-01.cleardb.net"
remote_db="heroku_93d73550cb16248"

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables
	# connectionInstance = pymysql.connect(host=remote_host, user=remote_username, password=remote_password ,cursorclass=pymysql.cursors.DictCursor, database=remote_db)
	connectionInstance = pymysql.connect(host="127.0.0.1", user="root", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")

	try:
		cursor = connectionInstance.cursor()

		queue_db = '''CREATE TABLE CURRENT_PAIRS (
		auto_id BIGINT NOT NULL AUTO_INCREMENT,
		user_1 BIGINT NOT NULL,
		email_1 VARCHAR(100) NOT NULL,
		user_2 BIGINT,
		email_2 VARCHAR(100),
		socket_id_1 VARCHAR(100) NOT NULL,
		socket_id_2 VARCHAR(100),
		mode_1 VARCHAR(1) NOT NULL, 
		mode_2 VARCHAR(2),
		PRIMARY KEY(auto_id),
		CONSTRAINT `user_id_1`
		  FOREIGN KEY (user_1) REFERENCES `USERS` (auto_id),
		CONSTRAINT `user_id_2`
		  FOREIGN KEY (user_2) REFERENCES `USERS` (auto_id),
		CONSTRAINT `user_email_1`
		  FOREIGN KEY (email_1) REFERENCES `USERS` (email),
		CONSTRAINT `user_email_2`
		  FOREIGN KEY (email_2) REFERENCES `USERS` (email)
		);'''

		user_db = '''CREATE TABLE USERS (
		  auto_id BIGINT NOT NULL AUTO_INCREMENT,
		  name VARCHAR(100) NOT NULL,
		  email VARCHAR(100) NOT NULL,
		  password_hash VARCHAR(100) NOT NULL,
		  university VARCHAR(100) NOT NULL,
		  photo_url VARCHAR(300) NOT NULL,
		  instagram_id VARCHAR(100),
		  snapchat_id VARCHAR(100),
		  signed_up TIMESTAMP NOT NULL,
		  last_login TIMESTAMP,
		  is_banned BIT(1) NOT NULL DEFAULT 0,
		  PRIMARY KEY(auto_id, name, email),
		  INDEX `email` (`email` ASC),
		  CONSTRAINT `name`
			  FOREIGN KEY (`university`)
			  REFERENCES `UNIVERSITIES` (`name`)
			  ON DELETE NO ACTION
			  ON UPDATE NO ACTION
		);'''

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
		cursor.execute("DROP TABLE IF EXISTS CURRENT_PAIRS;")
		cursor.execute("DROP TABLE IF EXISTS USERS;")
		cursor.execute("DROP TABLE IF EXISTS UNIVERSITIES;")


		print("Creating tables...")
		cursor.execute(universities_db)
		print("Reading and writing college data...")
		df = pd.read_csv("./collegedata.csv")
		sql = "INSERT INTO `universities` (`name`, `email`, `country`) VALUES (%s, %s, %s)"
		for index, row in df.iterrows():
			cursor.execute(sql, (row["College"], row["email"], row["Country"]))
		print("College data insert done!")

		cursor.execute(user_db)
		cursor.execute(queue_db)
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
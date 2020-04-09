import pymysql
from sqlalchemy import create_engine
import pandas as pd
import time
import hashlib

remote_username="b9c35a93bc495c"
remote_password="23d56ae1"
remote_host="us-cdbr-iron-east-01.cleardb.net"
remote_db="heroku_93d73550cb16248"

staging_username="b3a8e92d0611c8"
staging_password="fc762664"
staging_host="us-cdbr-iron-east-01.cleardb.net"
staging_db="heroku_b4518e339c8b145"

if __name__ == '__main__':

	# Ensure that the DB window_db exists
	# Create our target tables

	# PRODUCTION
	connectionInstance = pymysql.connect(host=remote_host, user=remote_username, password=remote_password ,cursorclass=pymysql.cursors.DictCursor, database=remote_db)

	# STAGING
	# connectionInstance = pymysql.connect(host=staging_host, user=staging_username, password=staging_password ,cursorclass=pymysql.cursors.DictCursor, database=staging_db)

	# LOCAL
	# connectionInstance = pymysql.connect(host="127.0.0.1", user="dbuser", password="dbuserdbuser", charset="utf8mb4",cursorclass=pymysql.cursors.DictCursor, database="window_db")

	try:
		cursor = connectionInstance.cursor()

		name = input("Enter university name\n")
		email = input("Enter university email suffix\n")
		country_code = input("Enter university country code\n")

		insert_statement = '''INSERT INTO UNIVERSITIES
		(name, email, country)
		VALUES
		("{}", "{}", "{}")'''.format(name, email, country_code)

		output = input("Execute: "+insert_statement+" ?\n")
		if output=='y':
			cursor.execute(insert_statement)
		connectionInstance.commit()
		print("Done! Closing DB connection")
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()
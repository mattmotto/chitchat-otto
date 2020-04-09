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
		option = input("r to read csv, anything else to take one input\n")
		name = []
		email = []
		univ = []
		if option == 'r':
			print("Feature not functional yet")
		else:
			name = input("Enter user's name\n")
			email = input("Enter user's email\n")
			univ = input("Enter user's university\n")
			name = [name]
			email = [email]
			univ = [univ]
		
		for i in range(0, len(name)):
			password = str(time.time())
			hashed_password = hashlib.md5(password.encode('utf-8')).hexdigest()
			photo_url = "https://davidwilsondmd.com/wp-content/uploads/2015/11/user-300x300.png"

			insert_statement = '''INSERT INTO USERS
			(name, email, password_hash, university, photo_url, signed_up)
			VALUES
			("{}", "{}", "{}", "{}", "{}", CURRENT_TIMESTAMP)'''.format(name[i], email[i], hashed_password, univ[i], photo_url)

			resp = input("Execute: "+insert_statement+ " ?\n")
			if resp == 'y':
				cursor.execute(insert_statement)
			connectionInstance.commit()
			print("Done! Closing DB connection")
			print("Email: "+email[i])
			print("Password: "+password[i])
	except Exception as e:
		print("Oops. Error")
		print(str(e))
	finally:
		connectionInstance.close()
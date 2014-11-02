import MySQLdb
db = MySQLdb.connect(host="localhost", 
                     user="root", 
                      passwd="tantrik", 
                      db="users")
cur = db.cursor()
cur.execute("SET @row = 0")
cur.execute("select * from user")

rows1 =  cur.fetchall()
print rows1

cur.execute("SELECT * from profile")

rows = cur.fetchall()
i = 0
print rows
j = 0
while j < len(rows):
	#if( i == 100):
	#	break
	if rows1[i][0] == 'aaaa' or rows1[i][0] == 'asfdsfasf' or rows1[i][0] == 'delete_this':
		i = i + 1
		j = j
	else:
		print rows1[i][0], rows[j][1]
		cur.execute("insert into profile1 values(%s, %s, %s, %s, %s, %s,%s,%s,%s,%s)",(rows1[i][0],rows[j][1],rows[j][2],rows[j][3],rows[j][4],rows[j][5],rows[j][6],rows[j][7],rows[j][8],rows[j][9]))
		db.commit()
		i = i + 1	
		j = j + 1

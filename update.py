import MySQLdb
db = MySQLdb.connect(host="localhost", 
                     user="root", 
                      passwd="tantrik115", 
                      db="users")
cur = db.cursor()

cur.execute("SELECT * FROM CONTEST_15 GROUP BY username order by solved DESC, time")

rows = cur.fetchall()

for row in rows:
	cur.execute("SELECT ans from CONTEST_15 where username = '{0}'".format(row[0]))
	ans = cur.fetchall()
	ans = ans[0][0].split(',')
	#if ans[5] == 'C':
	#	cur.execute("UPDATE CONTEST_15 set solved = '{0}' where username = '{1}'".format(row[4] + 4, row[0]))
	#elif ans[5] == 'B':
	#	cur.execute("UPDATE CONTEST_15 set solved = '{0}' where username = '{1}'".format(row[4] - 4, row[0]))
	#db.commit()
	if ans[18] == 'C':
		cur.execute("UPDATE CONTEST_15 set solved = '{0}' where username = '{1}'".format(row[4] + 4, row[0]))
	elif ans[18] == 'B':
		cur.execute("UPDATE CONTEST_15 set solved = '{0}' where username = '{1}'".format(row[4] - 4, row[0]))
	db.commit()
	print row[4], row[0]


#i = 0
#cur.execute("SELECT answer from QUESTION_9")
#rows = cur.fetchall()
#s = ''
#for r in rows:#
#	s += r[0]
#print s
#for row in rows:
	
	
#	cur.execute("""SELECT * from profile1 where nick = '{0}'""".format(row[0]))
#	temp = cur.fetchall()
#	print ((temp[0][3] + 1) ,row[0])
#	cur.execute("update profile1 set contest = '{0}' where nick = '{1}'" .format((temp[0][3] + 1) ,row[0]))
#	db.commit()
#	print ((temp[0][7] + (row[4] + row[3]) / 4) ,row[0])
#	cur.execute("update profile1 set problem = '{0}' where nick ='{1}'" .format((temp[0][7] + (row[4] + row[3]) / 4) ,row[0]))
#	db.commit()
	#cur.execute("""update profile1 set rating = %s where nick = %s""", ((temp[0][5]) ,row[0]))
	#db.commit()
	
	

	#cur.execute("""update  participant set ratchange = %s where nick = %s and contest_id = 2""", ((temp[0][5] - 1500),row[0]))
	#db.commit()
	#i = i + 1
#n = 310
#cur.execute("SELECT  avg(rating), avg(solved) from profile1, CONTEST_14  where profile1.nick = CONTEST_14.username ORDER by profile1.rating DESC")
#temp = cur.fetchall()
#i = 1
#for r in rows:
	#print temp
	#print ((int(n/i + r[4] - temp[0][1] - 10),r[0]))
#	cur.execute("SELECT * from profile1 where nick = '{0}'". format(r[0]))
#	t1 = cur.fetchall()
	#print ((int(t1[0][2] + n/i + r[4] - temp[0][1] - 10)))
	#print int(n/i + r[4] - temp[0][1] - 10)
#	#print r[0]
#	if (n/i + r[4] + temp[0][1] - 10 < 0):
#		rating = (t1[0][2] + n/i + r[4] - temp[0][1] - 10) + 1
#		ratchange = int(n/i + r[4] - temp[0][1] - 10)
#	else:
#		rating = (t1[0][2] + n/i + r[4] - temp[0][1] - 10)
#		ratchange = n/i + r[4] - temp[0][1] - 10
	#print int(rating), int(rating) - t1[0][2], t1[0][2]
#	rating = int(rating)
#	ratchange = int(rating) - t1[0][2]
#	print rating, ratchange, t1[0][2], r[0]
#	if r[0] == 'sk!!':
#		rating = rating - 39;
#	cur.execute("""update participant set ratchange = '{0}' where nick = '{1}' and contest_id =14""".format(ratchange,r[0]))
	#cur.execute("""update  participant set ratchange = '{0}' where nick = '{1}' and contest_id = 10'{2}'""".format(int(t1[0][2] + n/i + r[4] - temp[0][1] - 10),r[0]))
#	db.commit()
#	cur.execute("""update profile1 set rating = '{0}' where nick = '{1}'""".format(rating,r[0]))
#	db.commit()
#	if r[0] == 'logan1309':
#		break

#	i = i +  1

#i = 1
#for r in rows:	
#	cur.execute("SELECT high, rating, contest from profile1 where nick = '{0}'" .format(r[0]))
#	cur.execute("SELECT solved, attempted from participant where nick = '{0}' and contest_id = 9" .format(r[0]))

#	rating = cur.fetchall()
#	solved = (rating[0][0] + rating[0][1]) / 4
#	cur.execute("SELECT problem from profile1 where nick = '{0}'".format(r[0]))
#	prob = cur.fetchall()
#	print prob[0][0] - 2 * solved
#	cur.execute("UPDATE profile1 set problem = '{0}' where nick = '{1}'".format(prob[0][0] - 2 * solved, r[0]))
#	db.commit()
#	print rating[0][0], rating[0][1], rating[0][2]
#	if rating[0][1] > rating[0][0] or rating[0][2] == 1:
#		cur.execute("UPDATE profile1 set high = '{0}' where nick = '{1}'".format( rating[0][1], r[0]))
#		print (rating[0][1], r[0])
#		db.commit()
	
	#cur.execute("""update profile1 set rating = %s where nick = %s""", ((rating[0][0] + n/i + r[4] - temp[0][1]),r[0]))

	
#	i += 1

#cur.execute("select nick , ratchange, name from participant order by nick");
#temp = cur.fetchall()
#print temp

#for row in temp:
	#print row[2]
#	if str(row[2]) != 'Aptitutor Round 1' and str(row[2]) != 'Aptitutor Round 2':
#		print row[2]
#		cur.execute("select rating from profile1 where nick = '{0}'".format(row[0]))
#		rat = cur.fetchall()
#		print row[0]
#		rat = rat[0][0]
#		print rat
#		print row[1]
#		new_rat = rat + row[1]
#		print new_rat
#		cur.execute("update profile1 set rating = '{0}' where nick = '{1}'".format(new_rat,row[0]) )
#		db.commit()


#for r in rows:
#	cur.execute("SELECT * from participant where nick = '{0}'".format(r[0]))
#	temp = cur.fetchall()
#	total = 0
#	solve = 0
#	for t in temp:
#		total += t[4]
#		if t[1] == 8 or t[1] == 9 or t[1] == 10:
#			solve += (t[3] + t[4]) / 4
#		else:
#			solve += t[3]

#	if total != 0:
#		accuracy =  float(float(solve) / float(total)) * 100
#	else:
#		accuracy =  0
#	cur.execute("update profile1 set accuracy = '{0}' where nick = '{1}'".format(accuracy, r[0]));
#	print (accuracy, r[0])
#	db.commit()
#
#for r in rows:
#	cur.execute("SELECT * from participant where nick = '{0}' and contest_id = 7".format(r[0]))
#	temp = cur.fetchall()
#	if temp[0][6] < 0:
#		cur.execute("SELECT * from profile1 where nick = '{0}'".format(r[0]))
#		a = cur.fetchall()
#		print a[0][2]
#		cur.execute("update profile1 set rating = '{0}' where nick = '{1}'".format(a[0][2] + 1, r[0]));
#		print (a[0][2] + 1, r[0])
#		db.commit()

#cur.execute("SELECT * FROM CONTEST_10 GROUP BY username order by solved DESC, time")
#rows = cur.fetchall()
#for r in rows:
#	ans = r[1]
#	ans = ans.split(',')
	#print ans
	#print ans[24]
#	if ans[8] == 'C':
#		print ans[8], r[0]
#		cur.execute("UPDATE CONTEST_10 set solved = '{0}' where username = '{1}'".format((r[4] - 4), r[0]))
#		print (r[4] - 4, r[0])
#		db.commit()
#	if ans[8] == 'A':
#		print ans[8]
#		cur.execute("UPDATE CONTEST_10 set solved = '{0}' where username = '{1}'".format((r[4] + 4), r[0]))
#		print (r[4] + 4 , r[0])
#		db.commit()
#print rows



var express = require('express'),
app = express(),
fs = require('fs'),
path = require('path'),
querystring = require('querystring'),
mysql = require('mysql');
var passwordHash = require('password-hash');
var sanitizer = require('sanitizer');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tantrik115',
  database : 'users'
});

connection.connect();



  	var Q = 'SELECT * from CONTEST_14 GROUP BY username order by solved DESC, time ;';
  	connection.query(Q, function (err , rows){
  		for(var i = 0; i < rows.length; i++){
  			var post = {nick : rows[i]["username"], contest_id : "14", name : "Aptitutor Round 7", solved : rows[i]["solved"], attempted : rows[i]["attempted"], rank : i + 1, ratchange : 0};
  			connection.query('INSERT INTO participant SET ?',post, function(err,rows){
  				if(err)
  					console.log(err);
  			});

  			
  			
  		}
  	});
	/*var query = connection.query('SELECT * from CONTEST_2 ORDER BY solved DESC, time', function (err, rows){
		var temp = rows;
		console.log(temp);
		for(var i = 0; i < temp.length; i++){
			var solve = temp[i]["solved"];
			connection.query('SELECT * from profile where nick = ?', temp[i]["username"], function (err, rows){
				var Q1 = 'update profile set contest =' + (rows[0]["contest"] + 1) + ' where nick =\'' +  rows[0]["nick"] + '\'';
				console.log(Q1);
				console.log(temp);
				var rating = rows[0]["rating"];
				connection.query(Q1, function (err, rows){
					if(err){
						console.log(err);
					    return;
					}
				});
				var rat = 0;

				Q1 = 'update profile set rating =' + (rows[0]["rating"] + 7 - i) + ' where nick =\'' +  rows[0]["nick"] + '\'';
				console.log(Q1);
				connection.query(Q1, function (err, rows){
					if(err){
						console.log(err);
					    return;
					}
				});
				Q1 = 'update profile set problem =' + solve +  ' where nick =\'' +  rows[0]["nick"] + '\'';
				console.log(Q1);
				connection.query(Q1, function (err, rows){
					if(err){
						console.log(err);
					    return;
					}
				});
				if((rating + 7 - i) > 1500){
					Q1 = 'update profile set high =' + (rating + 7 - i)+ ' where nick =\'' +  rows[0]["nick"] + '\'';
					console.log(Q1);
					connection.query(Q1, function (err, rows){
						if(err){
							console.log(err);
					    	return;
						}
					});
				}

			});
			console.log(query.sql);
				
		
	});*/
	
 
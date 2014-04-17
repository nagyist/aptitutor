var http = require('http'), 
	url = require('url'), 
	fs = require('fs'),
	path = require('path'),
	util=require('util'),
	querystring=require('querystring');


http.createServer(function (req, res) {
	var filePath = '.' + req.url;
	if(req.method == 'POST' && filePath == './loginform'){
		var chunk = '';
		
        req.on('data', function (data) {
            chunk += data;
        });
        req.on('end', function () {
        	res.writeHead(200, {'Set-Cookie': 'mycookie=test','Content-Type': 'text/plain'});
            var string = querystring.parse(chunk);
            var nick = string['nick'];
            var pass = string['pass'];
            console.log(nick + "   " + pass);  
            if(nick == pass)
            	c = 1;
            else
            	c = 0;
            res.writeHead(301,{'Location': 'http://192.168.126.29:1336'}); 

            //res.writeHead(200, {'Set-Cookie': 'mycookie=test','Content-Type': 'text/plain'});

			res.end();
        });
	}
	//console.log(c);
	console.log(filePath);
	if(filePath == './')
		filePath = './index.html';
  	var extname = path.extname(filePath);
  	//console.log(extname);
  	if(extname == '')
  		filePath += '.html';
  	var contentType = 'text/html'
  	switch(extname) {
  		case '.js':
  			contentType = 'text/javascript';
  			break;
  		case '.css':
  			contentType = 'text/css';
  			break;
  	}
  	fs.exists(filePath, function(exists){
  		if(exists){
  			fs.readFile(filePath, function(error, content) {
  				if(error){
  					res.writeHead(200, {'Content-Type':'text/html'});
  					res.write('Sorry Wrong Address!');
  					res.end();
  				}
  				else{
  					res.writeHead(200, {'Content-Type':contentType, 'Content-Length':content.length});
  					res.write(content);
  					res.end();
  				}
  			});
  		}
  		else{
  			res.writeHead(200, {'Content-Type':'text/html'});
  			res.write('Sorry Wrong Address!');
  			res.end();
  		}
  	});
  	
}).listen(1336, '192.168.126.29');
console.log('Server running at http://198.168.126.29:1336/');

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app),
	fs = require('fs'),
	path = require('path'),
	util=require('util'),
	querystring=require('querystring');

app.listen(1336,'192.168.126.29');

function handler(req, res) {
	var filePath = '.' + req.url;
  getClientAddress = function (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
  };
  var ip = getClientAddress(req);
  console.log(ip);
  console.log(req.headers.cookie.remember);
  
	if(req.method == 'POST' && filePath == './loginform'){
		var chunk = '';
		    
        req.on('data', function (data) {
            chunk += data;
        });
        req.on('end', function () {
        	//res.writeHead(200, {'Set-Cookie': 'mycookie=test','Content-Type': 'text/plain'});
            var string = querystring.parse(chunk);
            var nick = string['nick'];
            var pass = string['pass'];
            console.log(nick + "   " + pass);  
            //console()
            res.writeHead(301,{'Location': 'http://192.168.126.29:1336/'}); 
            res.end();
          });
            //res.writeHead(200, {'Set-Cookie': 'mycookie=test','Content-Type': 'text/plain'});

			
        
	}
  if(filePath == './index'){
    //console.log("sss");
    
    fs.readFile('./index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      console.log(data);
      res.end(data);
    });
    //console.log("sss");
    
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
  	
}
console.log('Server running at http://198.168.126.29:1336/');

io.sockets.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
    });
  });
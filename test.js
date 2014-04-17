var app = require('express').createServer()
	express = require('express')
  , io = require('socket.io').listen(app),
  fs = require('fs');

app.listen(8001);

app.get('/', function(req, res) {  
    fs.readFile('./index1.html', function (err, data) {
        //console.log(req.session.stat);
        if(err){
            res.writeHead(500);
            return res.end('Error loading File');
        }
        
        else {
        	res.writeHead(200, {'Content-Type' : 'text/html'});
        	res.write(data);
                res.end();
                            
            
        }
    });  
});
app.use(express.static(__dirname));
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
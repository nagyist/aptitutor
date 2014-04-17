var express = require('express'),
 app = express(),
 fs = require('fs');

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.get('/', function(req, res) {  
    fs.readFile('./index.html', function (err, data) {
        if(err){
            res.writeHead(500);
            return res.end('Error loading File');
        }
        else {
            if(req.session.stat) {
                res.writeHead(200);
                console.log(req.sesstion.stat);
            }
            else {

                res.writeHead(200);
                res.write(data);
                res.end();
            }
        }
    });  
});
app.get('/loginform', function (req, res){
    if(req.method == 'POST'){
        var chunk = '';
        req.on('data', function (data) {
            chunk += data;
        });
        req.on('end', function (){
            var string = querystring.parse(chunk);
            var nick = string['nick'];
            var pass = string['pass'];
            console.log(nick + "    " + pass);
            if(nick == pass)
                req.session.stat = 17;
            else
                req.session.stat = 0;
            res.writeHead(301,{'Location': 'http://192.168.126.29:8080/'}); 


        });
    }
});



app.listen(8080, "192.168.126.29");
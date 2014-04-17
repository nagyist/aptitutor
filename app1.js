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
  password : 'tantrik',
  database : 'users'
});

connection.connect();


app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
var salt = bcrypt.genSaltSync(10);
//var md5sum = crypto.createHash('md5');

//server.listen(8002,"192.168.126.29")

app.listen(8002, "192.168.126.29");
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.session({secret: '1234567890QWERTY'}));
var isAlive = new Object();
var username = new Object();
var rating = new Object();
var rank = new Object();
var data2 = new Object();
var contests = 0;


connection.query('SELECT * from contest', function (err, rows){
    contests = rows.length;
    //console.log(contests);
});

app.get('/past', function (req, res){
    if(isAlive[req.session.stat]){
        fs.readFile('./loginarchive.html', function (err, data){
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            res.write(data);
            res.end();
        });
    }
    else{
        fs.readFile('./archive.html', function (err, data){
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            res.write(data);
            res.end();
        });
    }
});
app.get(/contest\/id\/(.+)$/, function (req, res){
    console.log(contests);
    var contest_id = 0;
    for(var i = 12; i < req.url.length; i++){
        contest_id = contest_id * 10 + req.url[i] - '0';
    }
    contest_id = sanitizer.sanitize(contest_id);
    console.log(req.url);
    if(contest_id > contests || isNaN(contest_id)){
        res.write("Sorry No such contest found :(");
            res.end();
    }
    if(isAlive[req.session.stat]){
        fs.readFile('./sample.html', function (err, data){
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            var Q = 'SELECT * from QUESTION_' + contest_id + ';';
            var Q1 = 'SELECT * from contest where id = ' + contest_id + ';';
            connection.query(Q1, function (err, rows){

                sTime = new Date(rows[0]["Etime"]).getTime();
                cTime = new Date();
                var name = rows[0]["name"];
                var ms = (sTime - cTime).toString();
                connection.query(Q, function (err, rows){
                    question = JSON.stringify(rows);
                    question = JSON.parse(question);
                    res.render('contest.ejs', {Nick : username[req.session.stat], contest_name : name, time : ms, question : question});
                });
                
            });
            
        });
    }
    
});
app.get('/getTime', function (req, res){
    connection.query('SELECT * from upcoming', function (err, rows){
        if(rows.length == 1){
            var date = new Date();
           
        }
        else
            res.end(-800000);
    });
});
function addUserBar(cookie){
    var data = '';
    data += '<a href="/users/' + username[cookie] + '"style="text-decoration:none"><font color="white" size="6px">' + username[cookie] + '&nbsp&nbsp&nbsp</font></a>';
    data += '</div>';
    data += '<button type="submit" class="btn btn-lg btn-danger">Sign out</button>';
    data += '</div></div></div>'
    return data;
}



function temp(data, res){
    res.write(data);  
    res.end();
}

function addUpcoming(res, req){
    var data = '';
    var url = '';
    console.log(req.url);
    for(var i = 0; i < 6; i++)
        url += req.url[i];
    if(req.url == '/register')
        data += '<div class="panel panel-primary" style="position:absolute;left:820px;top:100px;width:300px">';
    else if(url  ==  '/users' || url == '/ranki')
        data += '<div class="panel panel-primary" style="position:fixed;left:1010px;top:90px;width:300px">';
    else 
        data += '<div class="panel panel-primary" style="position:fixed;left:920px;top:382px;width:300px">';
    data += '<div class="panel-heading" align="center">';
    data += '<h3 class="panel-title">Upcoming Rounds</h3>';
    data += '</div>'
    data += '<div class="panel-body" align="center">';
    connection.query('SELECT * from upcoming', function (err, rows){
        var date = new Date();
        
        var dateFuture = (new Date(rows[0]["time"])).getTime();
        data += '<a href="/contest/id/' +  rows[0]["id"] + '"<h4><u>' + rows[0]["name"] + '<br>'  + '</u></a>';
        data += '</div></div>';

        res.write(data);   
        if(url == '/users' || url == '/ranki')
            res.end(); 
    
    });
    
    
}
function addRanking(res, req){
    
    
    var data = '';
    var query = connection.query('SELECT nick, rating from profile order by rating DESC limit 10;', function (err,rows){
        var length = 10;    
    //console.log(data);
    if(rows.length < 10)
        length = rows.length;
        //console.log(length);
        //console.log(rows[0]["nick"]);
        if(req.url == '/register')
            '<div style="position:absolute;top:230px;left:910px"><b><h3>Top Rated</h3></b></div>';
        else
            data += '<div style="position:fixed;top:330px;left:600px"><b><h3>Top Rated</h3></b></div>';
        if(req.url == '/register')
            data += '<div style="position:absolute;left:838px;top:280px">';
        else
            data += '<div style="position:fixed;left:530px;top:380px">';
        data += '<table style="width:270px">';
        data += '<tr>';
        data += '<th>#</th>';

        data += '<th>Nick</th>';   
        data += '<th>Rating</th></tr>'
        data += '<tr>';
        for (var i = 0; i < length; i++){
            if(i & 1){
                data += '<tr>'
                data += '<td style="background:#F0F0F0;">' + i + '</td>';
                data += '<td style="background:#F0F0F0;"><a href="/users/' + rows[i]["nick"] + '"><font color="red">' + rows[i]["nick"] + '</font></a></td>';    
                data += '<td style="background:#F0F0F0;">' + rows[i]["rating"] + '</td>';
                data += '</tr>';
            }
            else{
                data += '<tr>';
                data += '<td>' + i + '</td>';
                data += '<td><a href="/users/' + rows[i]["nick"] + '"><font color="red">' + rows[i]["nick"] + '</font></a></td>';
                data += '<td>' + rows[i]["rating"] + '</td>';
                data += '</tr>';
            }
        }
        data += '</table>'
        data += '</div></div></body></html>';
        temp(data, res);
    }); 
    
    console.log(data + "AAAA"); 
    //console.log(data + "AAAA");               
        
    
}
app.get('/register', function (req, res){
    req.session.lastPage = req.url;
    console.log(req.url);
    console.log(isAlive[req.session.stat]);
    if(isAlive[req.session.stat]){
        res.redirect('http://192.168.126.29:8002/');
        //res.writeHead(301,{'Location': 'http://192.168.126.29:8002'});
        res.end();
    }
    else{
        fs.readFile('./register.html', function (err, data){
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            else{
                res.write(data);
                addUpcoming(res, req);
                addRanking(res, req);
                //res.end();
            }
        });
    }
});
app.get(/getUser\/(.+)$/, function (req, res){
    console.log(req.url);
    var user = '';
    for(var i = 9; i < req.url.length; i++)
        user += req.url[i];
    var clean = sanitizer.sanitize(user);
    //console.log(user);
    var query = connection.query('SELECT * from profile where nick = ?',clean, function (err, rows){
        console.log(rows.length);
        if(err){
            res.write("No User");
            res.end();
            console.log("error");                    
        }

        else if(rows.length == 1){    
            res.writeHead(200, {'Content-Type' : 'text/html'});        
            res.write(rows[0]["name"] + "///" + rows[0]["rating"] + "///" + rows[0]["contest"] + "///" + rows[0]["city"] + "///" + rows[0]["high"] + "///" + rows[0]["accuracy"]);
            res.end();
        }
        else{

        }
        
    });
    

    //res.end();
});
app.post('/logout', function (req, res){
    console.log("YES!!");
    if(isAlive[req.session.stat]){
        isAlive[req.session.stat] = 0;
        res.redirect('http://192.168.126.29:8002'+req.session.lastPage);
        //res.end();
    }
    
    //res.writeHead(301,{'Location': 'http://192.168.126.29:8002/'}); 
    //res.end();
});
app.get('/', function (req, res) { 
    req.session.lastPage = req.url;
    //console.log("NO!!");
    //console.log(req.url);
    //console.log(isAlive[req.session.stat]);
    if(req.session.stat && isAlive[req.session.stat]) {
        console.log(rank[req.session.stat]);        
        fs.readFile('./loggedin.html', function (err, data) {
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            else{
                    
                connection.query('SELECT nick, rating from profile ORDER BY RATING DESC limit 10', function (err, rows){
                    var ranking = JSON.stringify(rows);
                    ranking = JSON.parse(ranking); 
                    connection.query('SELECT * from upcoming', function (err, rows){
                        var up = JSON.stringify(rows);
                        up = JSON.parse(up);
                         sTime = new Date(rows[0]["time"]).getTime();
                        cTime = new Date();
                        var ms = (sTime - cTime).toString();
                        console.log(sTime - cTime);
                        
                        res.render('loggedin.ejs', {Nick : username[req.session.stat], ranking : ranking, upcoming : up, time : ms});
                    })                      
                    
                });

                   
            }
                                        
        });
    }
    else {
        fs.readFile('./index.html', function (err, data) {
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            else{
                
                connection.query('SELECT nick, rating from profile ORDER BY RATING DESC limit 10', function (err, rows){
                    var ranking = JSON.stringify(rows);
                    ranking = JSON.parse(ranking); 
                    connection.query('SELECT * from upcoming', function (err, rows){
                        var up = JSON.stringify(rows);
                        up = JSON.parse(up);
                         sTime = new Date(rows[0]["time"]).getTime();
                        cTime = new Date();
                        var ms = (sTime - cTime).toString();
                        console.log(sTime - cTime);
                        
                        res.render('index.ejs', {ranking : ranking, upcoming : up, time : ms});
                    })                      
                    
                });

            }
                                        
        });
    }
});

app.get('/getNick', function (req, res){
    if(req.session.stat && isAlive[req.session.stat]) {
        //console.log(rank[req.session.stat]);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(username[req.session.stat]);
        res.end();                               
    }
});
app.post('/sampleSubmit', function (req, res){
    var chunk = '';
    req.on('data', function(data){
        chunk += data;
    })
    console.log(chunk);
    req.on('end', function (){
        var string = querystring.parse(chunk);
        var ans = new Object();
        for(var i = 0; i < 25; i++)
            ans[i] = string["Q" + i];

    });
    res.end();
});

app.post('/loginform', function (req, res){
    //console.log(req.method);
    if(req.method == 'POST'){
        //console.log("vbfdf");
        var chunk = '';
        req.on('data', function (data) {
            chunk += data;
        });
        console.log(chunk);
        req.on('end', function (){
            var string = querystring.parse(chunk);
            var nick = string['nick'];
            var pass = string['pass'];
            //console.log(nick + "    " + pass);
            function randomString(length, chars) {
                var result = '';
                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
            }            
            var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            //console.log(rString);
            //console.log(nick + "   " + pass);
            var clean = sanitizer.sanitize(nick);
            var cleanPass = sanitizer.sanitize(pass);
            console.log(cleanPass);
            cleanPass = crypto.createHash('md5').update(cleanPass).digest('hex');
                
            //console.log('SELECT * from user where username = ?',clean);
            
            var query = connection.query('SELECT * from user where username = ?',clean, function (err, rows){
               
                //console.log(rows.length);
                if(err){
                    console.log("error");                    
                }

                else if(rows.length == 1 && rows[0]['password'] == cleanPass){
                    console.log(rows[0]);
                    req.session.stat = rString;
                    isAlive[rString] = 1;
                    username[rString] = nick;
                    rating[rString] = 1200;
                    rank[rString] = 1;                    
                        
                }
                else
                    req.session.stat = 0;  
                if(req.session.lastPage == '/register')
                   req.session.lastPage = '/';
                res.redirect('http://192.168.126.29:8002'+req.session.lastPage);
                
            });
            //console.log(query.sql);
            
            //console.log('http://192.168.126.29:8002'+req.session.lastPage);
            
            
            //res.writeHead(301,{'Location': }); 
            //res.end();

        });
    }
});

app.get('/sample', function (req, res){
    req.session.lastPage = req.url;
    if(req.session.stat && isAlive[req.session.stat]) {
        //console.log(rank[req.session.stat]);        
        fs.readFile('./sample.html', function (err, data) {
            if(err){
                res.writeHead(500);
                return res.end('Error loading File');
            }
            else{
                res.writeHead(200, {'Content-Type' : 'text/html'});
                data += addUserBar(req.session.stat);
                res.write(data);
            }
            res.end();                             
        });
    }
    else {
        res.end();
    }
    
});
function nick_pass(x){
    var l = x.length,flag = 1;
    for(var i = 0; i < l; i++){
        if(x[i] >= 'a' && x[i] <= 'z' || x[i] >= 'A' && x[i] <= 'Z' || x[i] >= '0' && x[i] <= '9' || x[i] == '!' || x[i] == '@' || x[i] == '#' || x[i] == '^' || x[i] == '_')
            continue;
        else
            flag = 0;
    }
    return flag;
}
function name_city(x){
    var l = x.length,flag = 1;
    if(l == 0)
        flag = 0;
    for(var i = 0; i < l; i++){
        if(x[i] >= 'a' && x[i] <= 'z' || x[i] >= 'A' && x[i] <= 'Z' || x[i] == ' ')
            continue;
        else
            flag = 0;
    }
    return flag;
}
// Registration FORM Submit! 

app.post('/regform', function (req, res){
    var chunk = '';
    req.on('data', function (data){
        chunk += data;
    });
    
    req.on('end', function (){
        var string = querystring.parse(chunk);
        var name = sanitizer.sanitize(string["name"]);
        var nick = sanitizer.sanitize(string["nick"]);
        var city = sanitizer.sanitize(string["city"]);
        var pass = sanitizer.sanitize(string["pass"]);
        var email = sanitizer.sanitize(string["email"]);
        name = validator.trim(name);
        var flag = name_city(name);    
        var ok = 1;

        if(!flag){
            ok = 0;            
        }
        flag = nick_pass(nick);
        if(!flag)
            ok = 0;

        if(nick.length < 3  || nick.length > 50 || nick[0] >= '0' && nick[0] <= '9'){
            flag = 0;
        }
        flag = name_city(city);
        if(!flag){
            ok = 0;            
        }
        flag = validator.isEmail(email);
        if(!flag)
            ok = 0;
        flag = nick_pass(pass);
        if(pass.length < 6){
            flag = 0;
            ok = 0;
        }
        if(ok){
            var query = connection.query('SELECT * from user where username = ?', nick, function (err, rows){
                console.log(rows.length);            
                if(rows.length >= 1)
                    return;
                else{
                    console.log('CREATE TABLE CONTEST_'+nick+'(id int(3), solved int(3), rank int(5), ratchange int(5));');
                    var Q = 'CREATE TABLE CONTEST_'+nick+'(name varchar(50), solved int(3), attempted int(3), rank int(5), ratchange int(5));';
                    connection.query(Q, function(err,rows){
                        if(err){
                            console.log(sk11);

                        }
                        
                    });
                    console.log(pass + "BLAH");
                    pass = crypto.createHash('md5').update(pass).digest('hex');
                
                    var post = {username : nick, password : pass};
                    connection.query('INSERT INTO user SET ?', post, function (err, rows){
                        if(err)
                            console.log("error");
                    });
                        post = {nick: nick, name : name, rating : 1500, contest : 0, city : city, high : 1500, accuracy : 0, problem : 0};
                        connection.query('INSERT INTO profile SET ?', post, function (err,rows){                        
                            res.end();

                        
                        });
                }
                

            

            });
            
        }
            
        
        


    });
});

app.get(/users\/(.+)$/, function (req, res){

    
    console.log(req.url);
    req.session.lastPage = req.url;
    var user = '';
    for(var i = 7; i < req.url.length; i++)
        user += req.url[i];
    var clean = sanitizer.sanitize(user);
    //console.log(user);
    
    
    var query = connection.query('SELECT * from profile a, profile b where a.nick = ? and (a.rating < b.rating or b.nick =\'' + clean +'\');',clean, function (err, rows){
        if(rows.length == 0){
            res.write("Sorry No Such User :(");
            res.end(); 
        }
        else{
            if(isAlive[req.session.stat]){
                fs.readFile('./loginprof.html', function (err, data) {
                    if(err){
                        res.writeHead(500);
                        return res.end('Error loading File');
                    }
                    else{
                        res.writeHead(200, {'Content-Type' : 'text/html'});
                        data += addUserBar(req.session.stat);
                        console.log(user.toLowerCase() + "    " + username[req.session.stat].toLowerCase());
                        /*if(user.toLowerCase() == username[req.session.stat].toLowerCase()){
                            data += '<div style="position:absolute;left:135px;top:400px">';
                            data += '<form method = "POST" action = "http://192.168.126.29:8002/changePic">';
                            data += '<input type = "file">';
                            data += '<input type = "Submit" value = "Change Photo" button type="button" class="btn btn-sm btn-primary" ></button></div>';
    
                        }*/
                        data += '<div class="panel panel-default" style="position:absolute;top:90px;left:80px;width:900px;height:300px">';
                        data += '<div class="panel-heading">';
                        if(user.toLowerCase() == username[req.session.stat].toLowerCase())
                            data += '<h3 class="panel-title"><b><h3><font color="#8B0000"> My Profile&nbsp&nbsp&nbsp(Rank:&nbsp&nbsp' + rows.length + ')</font></b></h3></h3></div>';
                        else
                            data += '<h3 class="panel-title"><b><h3><font color="#8B0000">' + rows[0]["name"] + '\'s Profile&nbsp&nbsp&nbsp(Rank:&nbsp&nbsp' + rows.length +')</font></b></h3></h3></div>';
                        data += '<div class="panel-body">';
                        data += '<div style="position:absolute;left:10px;top:85px">';
                        data += '<img src="../../profile/tomar.jpg" width="200" height="200" border="3"></div>';
                        data += '<div style="position:absolute;left:250px;top:95px">';
                        data += '<h3>Nick: <font color="#B22222">' + rows[0]["nick"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:95px">';
                        data += '<h3>City: <font color="#B22222">' + rows[0]["city"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:250px;top:145px">';
                        data += '<h3>Rating(Highest): <font color="#B22222">'+rows[0]["rating"] + '(' + rows[0]["high"] + ')</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:145px">';
                        data += '<h3>Contests: <font color="#B22222">' + rows[0]["contest"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:250px;top:195px">';
                        data += '<h3>Problems Solved: <font color="#B22222">' + rows[0]["problem"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:195px">';
                        data += '<h3>Accuracy: <font color="#B22222">' + rows[0]["accuracy"] + '%</font></h3></div></div></div></body></html>';
                        res.write(data);
                        addUpcoming(res,req);
                        
                    }
                });
            }
            else{
                fs.readFile('./logoutprofile.html', function (err, data){
                    res.writeHead(200, {'Content-Type' : 'text/html'});                
                        data += '<div class="panel panel-default" style="position:absolute;top:90px;left:80px;width:900px;height:300px">';
                        data += '<div class="panel-heading">';                    
                        data += '<h3 class="panel-title"><b><h3><font color="#8B0000">' + rows[0]["name"] + '\'s Profile&nbsp&nbsp&nbsp(Rank:&nbsp&nbsp' + rows.length +')</font></b></h3></h3></div>';
                        data += '<div class="panel-body">';
                        data += '<div style="position:absolute;left:10px;top:85px">';
                        data += '<img src="../../profile/tomar.jpg" width="200" height="200" border="3"></div>';
                        data += '<div style="position:absolute;left:250px;top:95px">';
                        data += '<h3>Nick: <font color="#B22222">' + rows[0]["nick"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:95px">';
                        data += '<h3>City: <font color="#B22222">' + rows[0]["city"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:250px;top:145px">';
                        data += '<h3>Rating(Highest): <font color="#B22222">'+rows[0]["rating"] + '(' + rows[0]["high"] + ')</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:145px">';
                        data += '<h3>Contests: <font color="#B22222">' + rows[0]["contest"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:250px;top:195px">';
                        data += '<h3>Problems Solved: <font color="#B22222">' + rows[0]["problem"] + '</font></h3></div>';
                        data += '<div style="position:absolute;left:600px;top:195px">';
                        data += '<h3>Accuracy: <font color="#B22222">' + rows[0]["accuracy"] + '%</font></h3></div></div></div></body></html>';
                    addUpcoming(res,req);
                    res.write(data);
                    
                });
                
            }
        }
        
                                    
    });
    
});

app.get(/checkNick\/(.+)$/, function (req, res){
    console.log(req.headers.referer);
    
    if(req.headers.referer != 'http://192.168.126.29:8002/register'){
        res.end('sk11 rocks!');
        return;
    }
    var nick = '';
    for(var i = 11; i < req.url.length - 1; i++)
        nick += req.url[i];
   
    console.log(nick);
    nick = sanitizer.sanitize(nick);
    var query = connection.query('SELECT * from user where username = ?', nick, function (err, rows){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        console.log(rows.length);
        if(rows.length >= 1)
            res.end("NOTOK");
        else
            res.end();

    });
});

app.get('/admintest', function (req, res){
    if(req.session.stat && isAlive[req.session.stat]) {
        if(username[req.session.stat] == "Admin"){
            fs.readFile('./admintest.html', function (err, data){
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data);
                res.end();
            });
        }
        else{
            res.write("Sorry Wrong Address :(");
            res.end();
        }

    }
    else{
        res.write("Sorry Wrong Address :(");
        res.end();
    }
});

app.post('/addContest', function (req, res){
    var chunk = '';
    req.on('data', function (data){
        chunk += data;
    });
    console.log(chunk);
    req.on('end', function(){
        var string = querystring.parse(chunk);
        console.log(string);
        var Q="CREATE TABLE CONTEST_" + string["Contest No."] + "(username int(10), ans varchar(100), time varchar(50), attempted int(10), solved int(10));";
        connection.query(Q,function (err,rows){
            if(err){
                
            }
        });
        var Q="CREATE TABLE QUESTION_" + string["Contest No."] + "(ques varchar(500), op1 varchar(100), op2 varchar(100), op3 varchar(100), op4 varchar(100));";
        connection.query(Q,function (err,rows){
            if(err){

            }
        });
        var post = {id : string["Contest No."], name : string["name"], answers : string["answers"], Stime : string["stime"], Etime : string["etime"]};
        connection.query('INSERT INTO contest SET ?', post, function (err, rows){
            if(err){
                console.log(err);
                return;
            }
        });
        post = {id : string["Contest No."], name : string["name"], time : string["stime"]};
        connection.query('INSERT INTO upcoming SET ?', post, function (err, rows){
            if(err){
                console.log(err);
                return;
            }
        });
        for(var i = 1; i <= 25; i++){
            var id1 = i + "1";
            var id2 = i + "2";
            var id3 = i + "3";
            var id4 = i + "4";
            if(i < 3){
                id1 += id1;
                id2 += id2;
                id3 += id3;
                id4 += id4;
            }
            if(string["Q" + i].length > 0){
                
                var Q = "INSERT INTO QUESTION_" + string["Contest No."] + " values('" + string["Q" + i] + "','" + string["Q" + id1] + "','" + string["Q" + id2] + "','" + string["Q" + id3] + "','" + string["Q" + id4] + "');"
                connection.query(Q,function (err,rows){
                    if(err){
                        console.log(err);
                    //res.writeHead(500);
                    //return res.end();
                    }
                });
            }
        }
        res.end();
    });
    
});
app.get(/ranking\/page\/(.+)$/, function (req, res){
    console.log(req.url);

    var page = 0;
    for(var i = 14; i < req.url.length; i++)
        page = page * 10 + req.url[i] - '0';
    page = sanitizer.sanitize(page);
    console.log(page);
    if(page < 1 || page > 10){
        res.write("Sorry No such ranking Found :(");
            res.end();
    }
    if(isNaN(page)){
        res.write("Sorry No such ranking Found :(");
        res.end();
    }
    if(isAlive[req.session.stat]){
        req.session.lastPage = req.url;
        fs.readFile('./loginranking.html', function (err, data){
            data += addUserBar(req.session.stat);
            connection.query('SELECT nick, rating, contest, problem from profile order by rating DESC;', function (err, rows){
                var size = rows.length;
                if(page > size/20 + 1){
                    res.write("Sorry No such ranking Found :(");
                    res.end();
                    return;
                }

                data += '<div style="position:absolute;left:480px;top:90px">';
                data += '<h1><u>Rankings</h1>';
                data += '</div>\n';
                
                data += '<div style="position:absolute;left:110px;top:200px">';
                data += '<table class="table table-condensed">';
                for(var i = 0; i < 4; i++)
                    data += '<col width="200">';
                
                data += '<col width="10">';
                data += '<tr>'
                data += '<th>Rank</th>';
                data += '<th>Nick</th>';
                data += '<th>Rating</th>';
                data += '<th>Contests</th>';
                data += '<th>Problems Solved</th>'
                data += '</tr> ';
                var limit = 20;
                if(size - 20*(page-1)  < 20)
                    limit = size - 20*(page - 1);
                console.log(limit);
                for(var i = 20*(page-1) + 1; i <= limit + 20*(page - 1); i++){
                    if(i&1){
                        data += '<tr>';
                        data += '<td style="background:#F0F0F0;">' + i + '</td>';
                        data += '<td style="background:#F0F0F0;"><a href="/users/' + rows[i - 1]["nick"] + '"style="text-decoration:none"><font color="red">' + rows[i-1]["nick"] + '</font></a></td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["rating"] +'</td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["contest"] + '</td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["problem"] + '</td></tr>';
                    }
                    else{
                        data += '<tr>';
                        data += '<td>' + i + '</td>';
                        data += '<td><a href="/users/' + rows[i - 1]["nick"] + '"style="text-decoration:none"><font color="red">' + rows[i - 1]["nick"] + '</font></a></td>';
                        data += '<td>' + rows[i - 1]["rating"] + '</td>';
                        data += '<td>' + rows[i - 1]["contest"] + '</td>';
                        data += '<td>' + rows[i - 1]["problem"] + '</td></tr>';
                    }
                }
                var height = 38*limit;
                if(height < 200)
                    height = 200;
                
                data += '<div style="position:absolute;top:' +height +'px;left:300px">'
                data += '<ul class ="pagination">';
                for(var i = 1; i <= size/20 + 1; i++){
                    if(i == page)
                        data += '<li class="disabled"><a href="/ranking/page/'  + i + '">' + i + '</a></li>';
                    else
                        data += '<li><a href="/ranking/page/' + i + '">' + i + '</a></li>';
                }
                data += '</ul></div>\n</body>,</html>';
                res.write(data);
                addUpcoming(res,req);
                
            });
            
        });
    }
    else{
        req.session.lastPage = req.url;
        fs.readFile('./logoutranking.html', function (err, data){
            
            connection.query('SELECT nick, rating, contest, problem from profile order by rating DESC;', function (err, rows){
                var size = rows.length;
                if(page > size/20 + 1){
                    res.write("Sorry No such ranking Found :(");
                    res.end();
                    return;
                }

                data += '<div style="position:absolute;left:480px;top:90px">';
                data += '<h1><u>Rankings</h1>';
                data += '</div>\n';
                
                data += '<div style="position:absolute;left:110px;top:200px">';
                data += '<table class="table table-condensed">';
                for(var i = 0; i < 4; i++)
                    data += '<col width="200">';
                
                data += '<col width="10">';
                data += '<tr>'
                data += '<th>Rank</th>';
                data += '<th>Nick</th>';
                data += '<th>Rating</th>';
                data += '<th>Contests</th>';
                data += '<th>Problems Solved</th>'
                data += '</tr> ';
                var limit = 20;
                if(size - 20*(page-1)  < 20)
                    limit = size - 20*(page - 1);
                console.log(limit);
                for(var i = 20*(page-1) + 1; i <= limit + 20*(page - 1); i++){
                    if(i&1){
                        data += '<tr>';
                        data += '<td style="background:#F0F0F0;">' + i + '</td>';
                        data += '<td style="background:#F0F0F0;"><a href="/users/' + rows[i - 1]["nick"] + '"style="text-decoration:none"><font color="red">' + rows[i-1]["nick"] + '</font></a></td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["rating"] +'</td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["contest"] + '</td>';
                        data += '<td style="background:#F0F0F0;">' + rows[i - 1]["problem"] + '</td></tr>';
                    }
                    else{
                        data += '<tr>';
                        data += '<td>' + i + '</td>';
                        data += '<td><a href="/users/' + rows[i - 1]["nick"] + '"style="text-decoration:none"><font color="red">' + rows[i - 1]["nick"] + '</font></a></td>';
                        data += '<td>' + rows[i - 1]["rating"] + '</td>';
                        data += '<td>' + rows[i - 1]["contest"] + '</td>';
                        data += '<td>' + rows[i - 1]["problem"] + '</td></tr>';
                    }
                }
                var height = 38*limit;
                if(height < 150)
                    height = 150;
                
                data += '<div style="position:absolute;top:' +height +'px;left:300px">'
                data += '<ul class ="pagination">';
                for(var i = 1; i <= size/20 + 1; i++){
                    if(i == page)
                        data += '<li class="disabled"><a href="/ranking/page/'  + i + '">' + i + '</a></li>';
                    else
                        data += '<li><a href="/ranking/page/' + i + '">' + i + '</a></li>';
                }
                data += '</ul></div>\n</body>,</html>';
                res.write(data);
                addUpcoming(res,req);
                
            });
            
        });
    }
});

app.post('/submitContest', function (req, res){
    var chunk = '';
    req.on('data' , function(data){
        chunk += data;
    });
    console.log(chunk);
    req.on('end' , function (){
        res.end();
    });
});
app.post('/changePic', function (req, res){
    console.log("BHLLLKHLKHKL");
    res.end();
})
app.get(/^(.+)$/, function (req, res) {
    //console.log("NO!!");
    var filePath = './public' + req.url;
    console.log(req.url);
    if(filePath == './')
        filePath = './public/index.html';
    var extname = path.extname(filePath);
    //console.log(extname);
    if(extname == ''){
        req.session.lastPage = req.url;
        filePath += '.html';
    }
    var contentType = 'text/html'
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    //console.log(contentType);
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
});


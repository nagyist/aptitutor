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
var captcha = require('captcha');

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




app.listen(8004);
//app.listen(8002);
app.configure(function(){    
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
    app.use(captcha({ url: '/captcha.jpg', color:'#0064cd', background: 'rgb(20,300,300)' })); // captcha params
});


    

    
    

var isAlive = new Object();
var username = new Object();
var rating = new Object();
var rank = new Object();
var data2 = new Object();
var wrong = new Object();
var contests = 0;
var reg = new Object();
var nick1 = new Object();
var name1 = new Object();
var email1 = new Object();
var city1 = new Object();





connection.query('SELECT * from contest', function (err, rows){
    app.locals.contests = rows.length;    
});
console.log(contests);
app.get('/past', function (req, res){   

    req.session.lastPage = req.url; 
    connection.query('SELECT * from contest', function (err,rows){
        var contest = rows;
        connection.query('SELECT nick, rating from profile where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
            var ranking = rows;
            connection.query('SELECT * from upcoming', function (err, rows){
                var ms = -111000001010;
                var up = [{id : "12221212", name: "fdsffsffsds"}];
                if(rows.length == 1){
                    up = rows;
                    sTime = new Date(rows[0]["time"]).getTime();
                    cTime = new Date();
                    ms = (sTime - cTime).toString();
                    console.log(sTime - cTime);
                }
                var incorrect = 0;
                if(wrong[req.session.stat]){    
                    incorrect = 1;       
                    wrong[req.session.stat] = 0;
                }
                if(isAlive[req.session.stat])
                    res.render('archive.ejs', {Nick : username[req.session.stat],ranking : ranking, upcoming : up, time : ms,contest : contest});
                else
                    res.render('archiveoff.ejs', {ranking : ranking, upcoming : up, time : ms,contest : contest, login : incorrect});
            });                      
                
        }); 

    });
    
});
app.get(/contest\/ranking\/(.+)$/, function (req, res){
    req.session.lastPage = req.url;
    var id = req.params[0];
    console.log(id);
    if(id > app.locals.contest || isNaN(id)){
        res.end();
        return;
    }
    var Q = 'SELECT * from  CONTEST_' + id + ' order by solved DESC, time';
    var query = connection.query(Q, function (err, rows){
        if(err){
            console.log(err);
            return;
        }
        /*var time = {};
        for(var i = 0; i < rows.length; i++){
            var temp = amount;
            days = 0;hours = 0;mins = 0;secs = 0;out = "";
            currd = 0; currhr = 0; currmin = 0; currsec = 0; currt = "";
            amount = Math.floor(amount/1000);
            days=Math.floor(amount/86400);
            amount %= 86400;
          
            hours = Math.floor(amount/3600);
            amount %= 3600;
          
            mins = Math.floor(amount/60);
            amount %= 60;
          
            secs=Math.floor(amount);
          
            if(days != 0){out += days +" day"+((days!=1)?"s":"")+": ";}
            if(days != 0 || hours != 0){out += hours +" hr"+((hours!=1)?"s":"")+": ";}
            if(days != 0 || hours != 0 || mins != 0){out += mins +" min"+((mins!=1)?"":"")+": ";}
            out += secs +" sec";
            time.concat(out);
        }*/
            if(isAlive[req.session.stat])
                res.render('contestranking.ejs', {ranking : rows, Nick : username[req.session.stat]});
            else
                res.render('contestoff.ejs', {ranking : rows})
        });
    console.log(query.sql);

});
app.get(/contest\/id\/(.+)$/, function (req, res){
    console.log(contests);
    var contest_id = 0;
    for(var i = 12; i < req.url.length; i++){
        contest_id = contest_id * 10 + req.url[i] - '0';
    }
    contest_id = sanitizer.sanitize(contest_id);
    console.log(contest_id);
    console.log(req.url);
    if(contest_id > app.locals.contest || isNaN(contest_id)){
        res.write("Sorry No such contest found :(");
            res.end();
    }
    if(isAlive[req.session.stat]){
        var Q = 'SELECT * from QUESTION_' + contest_id + ';';
        var Q1 = 'SELECT * from contest where id = ' + contest_id + ';';

        connection.query(Q1, function (err, rows){
            eTime = new Date(rows[0]["Etime"]).getTime();
            sTime = new Date(rows[0]["Stime"]).getTime();
            cTime = new Date();
            if(username[req.session.stat] != 'Admin'){
                if(sTime - cTime > 0){
                    connection.query('SELECT * from upcoming', function(err,rows){
                    res.render('rules.ejs',{Nick : username[req.session.stat],time : sTime - cTime, upcoming : rows});
                });
                    return;
                }
            }
            
            var name = rows[0]["name"];
            var ms = (eTime - cTime).toString();
            connection.query(Q, function (err, rows){
                question = JSON.stringify(rows);
                question = JSON.parse(question);
                var Q2 = 'SELECT * from CONTEST_' + contest_id + ' where username = \'' + username[req.session.stat] + '\';'; 
                console.log(Q2);
                connection.query(Q2, function (err, rows){
                    if(err){
                        console.log(err);
                        res.end();
                        return;
                    }
                    if(rows.length > 0 && cTime < eTime){
                        res.render('submit.ejs', {Nick : username[req.session.stat], attempt : rows[0]["attempted"], score : rows[0]["solved"]});
                    }
                    else
                        res.render('contest.ejs', {Nick : username[req.session.stat], contest_name : name, time : ms, question : question, complete : rows.length});
                });
                
            });
                
        });           
        
    }
    else{        
        res.render('notlogin.ejs');
        //res.writeHead(301,{'Location': 'http://192.168.126.29:8002'});        
    }
    
});


app.get('/register', function (req, res){
    req.session.lastPage = req.url;
    console.log(req.url);
    console.log(isAlive[req.session.stat]);
    if(isAlive[req.session.stat]){
        res.redirect('/');
        res.end();
    }
    else{
        connection.query('SELECT nick, rating from profile where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
            var ranking = rows;
            connection.query('SELECT * from upcoming', function (err, rows){
                var ms = -111000001010;
                var up = [{id : "12221212", name: "fdsffsffsds"}];
                if(rows.length == 1){
                    up = rows;
                    sTime = new Date(rows[0]["time"]).getTime();
                    cTime = new Date();
                    ms = (sTime - cTime).toString();
                    console.log(sTime - cTime);
                }
                
                console.log(reg[req.session.stat]);
                if(reg[req.session.stat] == 1){
                    console.log(nick1[req.session.stat]);
                    res.render('tempreg.ejs', {ranking : ranking, upcoming : up, time : ms, name : 0, nick : 0, email : 0, miss : 0, pass : 0, city : 0, oldNick : 1, NAME : name1[req.session.stat], CITY : city1[req.session.stat], EMAIL : email1[req.session.stat], NICK : nick1[req.session.stat]});                   
                }
                else
                    res.render('tempreg.ejs', {ranking : ranking, upcoming : up, time : ms, name : 1, nick : 1, email : 1, miss : 1, pass : 1, city : 1, oldNick : 1, NAME : "", CITY : "", EMAIL : "", NICK : ""});
                reg[req.session.stat] = 0;
            });                      
                    
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
        res.redirect(req.session.lastPage);
        //res.end();
    }
    
    //res.writeHead(301,{'Location': 'http://192.168.126.29:8002/'}); 
    //res.end();
});
app.get('/', function (req, res) { 
    req.session.lastPage = req.url;
    console.log(req.ip);
    console.log(req.url);
    connection.query('SELECT nick, rating from profile where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
            var ranking = JSON.stringify(rows);
            ranking = JSON.parse(ranking); 
            connection.query('SELECT * from upcoming', function (err, rows){
                var ms = -111000001010;
                var up = [{id : "12221212", name: "fdsffsffsds"}];
                if(rows.length == 1){
                    up = JSON.stringify(rows);
                    up = JSON.parse(up);
                    sTime = new Date(rows[0]["time"]).getTime();
                    cTime = new Date();
                    ms = (sTime - cTime).toString();
                    console.log(sTime - cTime);
                }
                var incorrect = 0;
                if(wrong[req.session.stat]){    
                    incorrect = 1;       
                    wrong[req.session.stat] = 0;
                }
                if(isAlive[req.session.stat]){
                    console.log(req.ip + "    " + username[req.session.stat]);
                    res.render('loggedin.ejs', {Nick : username[req.session.stat], ranking : ranking, upcoming : up, time : ms, login : incorrect});
                }
                else                    
                    res.render('testindex.ejs', {ranking : ranking, upcoming : up, time : ms, login : incorrect});
            });                   
        });
     
        
    
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
app.post('/loginform1', function (req, res){
    //console.log(req.method);
    if(req.method == 'POST'){
        console.log(req.ip);
        //console.log("vbfdf");
        //res.end();
        var chunk = '';
        req.on('data', function (data) {
            chunk += data;
            console.log(chunk);
        });        
        req.on('end', function (){
            console.log(chunk);
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
                    //console.log(rows[0]);
                    var Q = 'update profile set ip = \'' +  req.ip +  '\' where nick = \'' + nick + '\';';
                    console.log(Q);
                    connection.query(Q,function (err, rows){
                        if(err)
                            return;
                    });
                    req.session.stat = rString;
                    isAlive[rString] = 1;
                    username[rString] = nick;
                    rating[rString] = 1500;
                    rank[rString] = 1;                    
                        
                }
                else{
                    wrong[rString] = 1;
                    req.session.stat = rString;  
                }
                if(req.session.lastPage == '/register')
                   req.session.lastPage = '/';
                res.redirect(req.session.lastPage);
                
            });            

        });
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
         console.log(chunk);
         
        var string = querystring.parse(chunk);
        var name = sanitizer.sanitize(string["name"]);
        var nick = sanitizer.sanitize(string["nick"]);
        var city = sanitizer.sanitize(string["city"]);
        var pass = sanitizer.sanitize(string["pass"]);
        var email = sanitizer.sanitize(string["email"]);
        var digits = sanitizer.sanitize(string["digits"]);
         var ok = 1;
        if(isNaN(digits))
            ok = 0;
        console.log(digits + req.session.captcha);
        if(digits != req.session.captcha){
            ok = 0;
            
        }
        name = validator.trim(name);
        var flag = name_city(name);    
       

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
        console.log()
        if(ok){
            connection.query('SELECT * from profile where ip = ?', req.ip, function (err, rows){
                console.log(rows.length);
                if(rows.length > 3){
                    res.end();
                    return;
                }

            var query = connection.query('SELECT * from user where username = ?', nick, function (err, rows){
                console.log(rows.length);            
                if(rows.length >= 1)
                    return;
                else{
                    
                    console.log(pass + "BLAH");
                    pass = crypto.createHash('md5').update(pass).digest('hex');
                
                    var post = {username : nick, password : pass};
                    connection.query('INSERT INTO user SET ?', post, function (err, rows){
                        if(err)
                            console.log("error");
                    });
                        post = {nick: nick, name : name, rating : 1500, contest : 0, city : city, high : 1500, accuracy : 0, problem : 0, ip : req.ip};
                        connection.query('INSERT INTO profile SET ?', post, function (err,rows){   
                            function randomString(length, chars) {
                                var result = '';
                                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                                    return result;
                            }            
                            var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                            req.session.stat = rString;
                            isAlive[rString] = 1;
                            username[rString] = nick;
                            rating[rString] = 1500;
                            rank[rString] = 1;                                                  
                            res.end();                      
                        });
                }
                
            });
            

            });
            
        }
        else{
            function randomString(length, chars) {
                var result = '';
                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
            }            
            var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            reg[rString] = 1;
            console.log("YSSSSs");
            req.session.stat = rString;
            name1[rString] = name;
            city1[rString] = city;
            email1[rString] = email;

            nick1[rString] = nick;
            console.log(nick + "   " + nick1[rString]);
            res.redirect('/register');
        }    
        
        


    });
});

app.get(/users\/(.+)$/, function (req, res){   
    console.log(req.url);
    req.session.lastPage = req.url;
    var clean = sanitizer.sanitize(req.params[0]);    
    var query = connection.query('SELECT * from profile a, profile b where a.nick = ? and ((b.contest > 0 and a.contest = 0) or ((a.contest > 0 and b.contest > 0 and a.rating < b.rating or b.nick =\'' + clean +'\')));',clean, function (err, rows){
        if(rows.length == 0){
            res.write("Sorry No Such User :(");
            res.end(); 
        }       
        var rank = rows.length;
        
        connection.query('SELECT * from profile where nick = ?',clean, function (err, rows){
            var profile = rows;
        
        connection.query('SELECT * from upcoming', function (err,rows){
            var ms = -111000001010;
            var up = [{id : "12221212", name: "fdsffsffsds"}];
            if(rows.length == 1){
                sTime = new Date(rows[0]["time"]).getTime();
                cTime = new Date();
                ms = (sTime - cTime).toString();
                up = rows;
            }
            connection.query('SELECT * from participant where nick = ?', clean, function (err, rows){
                if(err){
                    console.log()
                    res.end();
                    return;
                }
                //console.log(rows);
                //console.log(profile);
                var incorrect = 0;
                if(wrong[req.session.stat]){    
                    incorrect = 1;       
                    wrong[req.session.stat] = 0;
                }
                if(isAlive[req.session.stat])
                    res.render('userin.ejs', {Nick : username[req.session.stat],profile : profile,rank : rank,upcoming : up, time : ms, contest : rows});  
                else
                    res.render('useroff.ejs', {profile : profile,rank : rank, upcoming : up, time : ms, contest : rows, login : incorrect});  
            });
        });
        });
                                             
    });    
    console.log(query.sql);
});

app.get(/checkNick\/(.+)$/, function (req, res){
    console.log(req.headers.referer);
    
    if(req.headers.referer != '/register'){
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
        //console.log(rows.length);
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
        var Q="CREATE TABLE CONTEST_" + string["Contest No."] + "(username varchar(50), ans varchar(100), time varchar(50), attempted int(10), solved int(10));";
        connection.query(Q,function (err,rows){
            if(err){
                
            }
        });
        var Q="CREATE TABLE QUESTION_" + string["Contest No."] + "(ques varchar(5000), op1 varchar(100), op2 varchar(100), op3 varchar(100), op4 varchar(100));";
        connection.query(Q,function (err,rows){
            if(err){

            }
        });
        var post = {id : string["Contest No."], name : string["name"], answers : string["answers"], Stime : string["stime"], Etime : string["etime"]};
        connection.query('INSERT INTO contest SET ?',post,function (err, rows){
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
        app.locals.contest++;
        res.end();
    });
    
});
app.get(/ranking\/page\/(.+)$/, function (req, res){
    req.session.lastPage = req.url;
    var page = req.params[0];
    page = sanitizer.sanitize(page);
    //connection.query('SELECT ')
    if(page < 1){
        res.write("Sorry No such ranking Found :(");
            res.end();
    }
    if(isNaN(page)){
        res.write("Sorry No such ranking Found :(");
        res.end();
    }
    connection.query('SELECT * from upcoming', function(err, rows){
        var ms = -111000001010;
        var up = [{id : "12221212", name: "fdsffsffsds"}];
        if(rows.length == 1){
            sTime = new Date(rows[0]["time"]).getTime();
            cTime = new Date();
            ms = (sTime - cTime).toString();
            up = rows;
        }
        connection.query('SELECT * from profile where contest > 0 ORDER BY rating DESC;', function (err, rows){        
            var row = rows;            
            connection.query('SELECT * from profile where contest = 0', function (err, rows){
                rows = row.concat(rows);
                //console.log(rows.length);
                if(page > rows.length / 20 + 1){
                    res.write("Sorry No such ranking Found :(");
                    res.end();
                    return;
                }
                var R = rows.length - 20*(page-1);
                if(R > 20)
                    R = 20;
                 var incorrect = 0;
                if(wrong[req.session.stat]){    
                    incorrect = 1;       
                    wrong[req.session.stat] = 0;
                }
                if(isAlive[req.session.stat]){
                    res.render('login_ranking.ejs',{Nick : username[req.session.stat], start : 20*(page - 1) + 1, size : R, ranking : rows, time : ms, upcoming : up, LEN : rows.length});
                }
                else
                    res.render('ranking.ejs',{Nick : username[req.session.stat], start : 20*(page - 1) + 1, size : R, ranking : rows, time : ms, upcoming : up, LEN : rows.length, login : incorrect});
            });
        });
    });
});

app.post('/submitContest', function (req, res){
    if(!isAlive[req.session.stat])
        return;
    connection.query('SELECT * from CONTEST_3 where username = ?', username[req.session.stat], function(err, rows){
        if(err){
            res.end();
            return;
        }
        if(rows.length > 0){
            res.end("Not Allowed to Submit");
            return;
        }
    });
    var chunk = '';
    console.log(req.headers.referer);
    req.on('data' , function(data){
        chunk += data;
    });
    var answers = new Array();
    for(var i = 0; i < 25; i++)
        answers[i] = 'o';
    console.log(chunk);
    var ms = 0;
        req.on('end' , function (){
        var string = querystring.parse(chunk);
        
        connection.query('SELECT * from contest',function(err, rows){
            var id = rows.length;
            var name = rows[id-1]["name"];
            sTime = new Date(rows[id-1]["Stime"]).getTime();
            eTime = new Date(rows[id-1]["Etime"]).getTime();
            cTime = new Date();
            ms = (cTime - sTime);
            ms1 = (eTime - cTime);
            console.log(ms + "   " + ms1);
            if(username[req.session.stat] != 'Admin'){
                if(ms < 0 || ms1 < -30000){
                    res.end();
                    console.log("YOOOYOYOY");
                    return;
                }
            }

            var answer = rows[id-1]["answers"].toString();
            var correct = 0;
            var attempt = 0;
            for(var S in string){
                answers[parseInt(S)-1] = string[S];
                if(answers[parseInt(S)-1] == answer[parseInt(S)-1])
                    correct++;
                attempt++;
            }
            var ans = '';
            for(var i = 0; i < 25; i++)
                ans += answers[i];
            var Q = 'INSERT INTO CONTEST_'+ id +' VALUES(\'' + username[req.session.stat] + '\',\'' + ans  + '\',\'' + ms + '\',' + attempt + ',' + correct +');';
            console.log(Q);
            connection.query(Q, function(err,rows){
                if(err){
                    console.log(err);
                    return;
                }
                res.render('submit.ejs',{Nick : username[req.session.stat], attempt : attempt, score : correct});
            });
            console.log(attempt);
            console.log(correct);

        });
        
        
        
    });
});

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


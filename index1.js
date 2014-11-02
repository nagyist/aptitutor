var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('fs'),
path = require('path'),
querystring = require('querystring'),
mysql = require('mysql');
var passwordHash = require('password-hash');
var sanitizer = require('sanitizer');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var captcha = require('captcha');
var cookie = require('cookie');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var toobusy = require('toobusy');
var events = require('events');
var url = require('url');
var os = require('os');
var eventEmitter = new events.EventEmitter();
//var utils = require('utils');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tantrik115',
  database : 'users'
});

connection.connect();


app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
var salt = bcrypt.genSaltSync(10);
//var md5sum = crypto.createHash('md5');
var whitelist = ['shashwat3812', 'sk!!', 'sinaka96', 'tantrik16', 'Admin', 'utkarsh'];


var ip = '';
process.nextTick(function (){
    var ifaces = os.networkInterfaces();    
    var ip = ifaces['enp3s0'][0].address; 
    server.listen(8888, ip);
    console.log("Your Url is: " + ip + ":8888");
});



//app.listen(8002);
app.configure(function(){    
    /*app.use(function (req, res, next){
        if (toobusy()){
            console.log("BUSY!!");
            res.send(503, "I'm busy right now, sorry.");
            res.end();
        }
        else next();
    });*/
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser('1234567890QWERTYoolalathisisastupidkey'));
    app.use(express.session({secret: '1234567890QWERTYoolalathisisastupidkey'}));
    app.use(captcha({ url: '/captcha.jpg', color:'#0064cd', background: 'rgb(20,300,300)' })); // captcha params
});



var isAlive = new Object();
var username = new Object();
var rating = new Object();
var rank = new Object();
var data2 = new Object();
var wrong = new Object();
var username1 = new Object();
var contests = 0, aans = '', practice = 0;
var participants = 0;

function numberofContest(){
    connection.query('SELECT * from contest', function (err, rows){
        app.locals.contests = rows.length;    
        contests = rows.length;
        console.log(contests);
    });
    connection.query('SELECT * from practice',function(err, rows){
        practice = rows.length;
        console.log(practice);
    });
}
eventEmitter.on('contestAdded', function (data){
    contests++;
    app.locals.contests++;
    aans = '';
    console.log(contests);
});
eventEmitter.on('practice', function (data){
    practice++;
});
process.nextTick(numberofContest);

app.all('*', function(req,res,next){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + "   " + req.url);   
    next();
});

var nsp = io.of('/admin');
io.of('/admin').use(function (socket, next) {
    //console.log(socket.request.cookie['connect.sid']);
    var sid = cookieParser.signedCookie(socket.request.cookie['connect.sid'],'1234567890QWERTYoolalathisisastupidkey');
    if(username1[sid] == 'Admin')
        next();
});
nsp.on('connection', function (socket){
    console.log("connected");
    socket.on('init', function (data){
        var postUpcoming = {
            'id' : contests + 1,
            'name' : data[0],
            'time' : data[1]
        };
        var postContest = {
            'id' : contests + 1,
            'name' : data[0],
            'answers' : '',
            'Stime' : data[1],
            'Etime' : data[2],
            'type'  : data[3]
        };
        console.log(postUpcoming);
        console.log(postContest);
        //console.log(socket.handshake.headers);
        //url = url.parse(socket.handshake.headers.referer);
        //url = url.pathname
        //console.log(url);
        
        connection.query('INSERT INTO contest SET ?', postContest, function (err){
            if(err){
                return;
            }
        });
        connection.query('INSERT INTO upcoming SET ?', postUpcoming, function (err){
            if(err)
                return;
        });
        var C = (contests + 1).toString();
        var Q="CREATE TABLE CONTEST_" + C + "(username varchar(50), ans varchar(100), time varchar(50), attempted int(10), solved int(10));";
        connection.query(Q,function (err,rows){
            if(err){
                
            }
        });
        var Q="CREATE TABLE QUESTION_" + C + "(id int(5),ques varchar(5000), op1 varchar(100), op2 varchar(100), op3 varchar(100), op4 varchar(100), answer varchar(10));";
        connection.query(Q,function (err,rows){
            if(err){

            }
        });

        socket.emit('id', contests + 1);
        eventEmitter.emit('contestAdded', 1);
         //connection.query('')
           
    });
    socket.on('question', function (data){
        console.log(data);

        var flag = true;
        for(var i = 0; i < data.length; i++){
            //data[i] = sanitizer.sanitize(data[i]);
            console.log(data[i]);
            if(data[i].length == 0 || data[0].length < 5 || data[i].indexOf('$') != -1 || data[i].indexOf('&#36;') != '-1' || data[5].length != 1){
                flag = false;
                break;
            }

        }
        if(flag){           
            var Q1 = data[0], op1 = data[1], op2 = data[2], op3 = data[3], op4 = data[4], answer = data[5];            
            console.log(Q1);
            connection.query('SELECT * from QUESTION_' + data[6], function (err, rows){
                console.log(Q1);
                var post = {
                    id : rows.length,
                    ques : Q1,
                    op1 : op1,
                    op2 : op2,
                    op3 : op3,
                    op4 : op4,
                    answer : answer
                };
                console.log(post);
                var ans = '';
                for(var i = 0; i < rows.length; i++)
                    ans += rows[i]["answer"];
                ans += answer;
                connection.query('INSERT INTO QUESTION_' + data[6] + ' SET ?',post,function (err){
                    if(err){
                        console.log(err);
                        socket.emit('entered', 'Database Snapped :(');
                        return;
                    }
                    else{
                        socket.emit('entered', 'Question has been added!');
                    }
                });

            
                var Q = 'UPDATE contest set answers = \'' + ans + '\' where id =' + data[6];
                connection.query(Q, function (err){
                    if(err){
                        console.log(err);
                    }
                });
            });
        }
        else{
            socket.emit('entered', 'Invalid Question!');
        }
    });
    socket.on('delete', function (data){
        console.log(data);
        data = Number(data);
        var flag = true;
        if(data > contests)
            flag = false;
        id = data;
        if(flag){
            var Q = 'DROP TABLE QUESTION_' + id;
            var Q1 = 'DROP TABLE CONTEST_' + id;
            connection.query(Q, function (err){
                if(err)
                    console.log(err);
            });
            connection.query(Q1, function (err){
                if(err){
                    console.log(err);
                    flag = false;
                }
            });
            connection.query('DELETE FROM contest where id = ?', [id], function (err){
                if(err){
                    console.log(err);
                    flag = false;
                }

            });
            connection.query('DELETE FROM upcoming where id = ?', [id], function (err){
                if(err){
                    console.log(err);
                    flag = false;
                }
            });
            contests--;

        }
        else{
            socket.emit('valid','Enter a Valid Id!');
        }
        
    });
    socket.on('deleteUser', function (data){
        console.log(data);
        connection.query('DELETE FROM profile1 where nick = ?', [data], function (err){
            if(err){
                console.log(err);
                socket.emit('error', 'Error Deleting!');
                return;
            }
        });
        connection.query('DELETE FROM user where username = ?', [data], function (err){
            if(err){
                console.log(err);
                socket.emit('error', 'Error Deleting!');
                return;
            }
        });
    });
    socket.on('initImage', function(data){
            console.log('init');
            var postUpcoming = {
            'id' : contests + 1,
            'name' : data[0],
            'time' : data[1]
            };
            var postContest = {
                'id' : contests + 1,
                'name' : data[0],
                'answers' : '',
                'Stime' : data[1],
                'Etime' : data[2],
                'type'  : data[3]
            };
            console.log(postUpcoming);
            console.log(postContest);
            //console.log(socket.handshake.headers);
            //url = url.parse(socket.handshake.headers.referer);
            //url = url.pathname
            //console.log(url);
        
            connection.query('INSERT INTO contest SET ?', postContest, function (err){
                if(err){
                    return;
                }
            });
            connection.query('INSERT INTO upcoming SET ?', postUpcoming, function (err){
                if(err)
                    return;
                }); 
            var C = (contests + 1).toString();
            var Q="CREATE TABLE CONTEST_" + C + "(username varchar(50), ans varchar(1000), time varchar(50), attempted int(10), solved int(10));";
            connection.query(Q,function (err,rows){
                if(err){
                    
                }
            });
            var Q="CREATE TABLE QUESTION_" + C + "(ques varchar(1000), url varchar(100),answer varchar(50));";
            connection.query(Q,function (err,rows){
                if(err){

                }
            });

            socket.emit('id', contests + 1);
            eventEmitter.emit('contestAdded', 1);
        });
    socket.on('imageQues', function (data){
        var flag = true;
        var ques = data[0], url = data[1], answer = data[2];
        answer = sanitizer.sanitize(data[2]);
        ques = sanitizer.sanitize(data[0]);
        for(var i = 0; i < 3; i++)
            if(data[0].length == 0)
                flag = false;
        var post = {
            ques : ques,
            url : url,
            answer : answer
        };
        connection.query('INSERT INTO QUESTION_' + contests.toString() + ' SET ?',post,function (err){
            if(err){
                console.log(err);
                socket.emit('entered', 'Database Snapped :(');
                return;
            }
            else{
                socket.emit('entered', 'Question has been added!');
            }
        });
    });
    socket.on('updateTime', function (data){
        console.log(data);
        var flag = true;
        if(isNaN(data[0]))
            flag = false;
        if(isNaN(Date.parse(data[1])))
            flag = false;
        if(isNaN(Date.parse(data[2])))
            flag = false;
        console.log(flag);
        if(flag){
            var post = [data[1].toString(), data[2].toString(), Number(data[0])];
            var post1 = [data[1].toString(), Number(data[0])];
            var Q = 'UPDATE contest set Stime = \'' + post[0] + '\', Etime = \'' + post[1] + '\' where id = ' + post[2] ; 
            var Q1 = 'update upcoming set time = \'' + post[0] + '\' where id = ' + post[2];
            connection.query(Q,function (err){
                if(err)
                    socket.emit('updateTime', 'Failed!');
                else{
                    connection.query(Q1, function (err){
                        if(err){
                            console.log(err);
                            socket.emit('updateTime', 'Failed!');
                        }
                        else
                            socket.emit('updateTime', 'Done!');
                    });
                }
            });
            console.log(Q);
        }
    });
    socket.on('delUpcoming', function (data){
        data = Number(data);
        var flag = true;
        if(data > contests)
            flag = false;
        id = data;
        if(flag){
            connection.query('DELETE from upcoming where id = ?', [id], function (err, rows){
                if(err){
                    console.log(err);
                    return;
                }
                socket.emit('deleted', 'deleted!');

            });
        }
    });
    socket.on('getId', function(data){
        console.log(data);
        connection.query('SELECT * from practice_title', function (err, rows){
            if(err){
                socket.emit('id1','Some error Occurred!');
                console.log(err);
                return;
            }
            else{
                socket.emit('id1', rows.length  + 1);
            }
        });
    });
    socket.on('practiceQues', function (data){
        var ques = data[0], title = data[1], answer = data[2], id = data[3];
        var postQuestion = {
            'id' : id,
            'ques' : ques,
            'answer' : answer,
            'title': title
        };
        var postTitle = {
            'id' : id,
            'title' : title
        };
        connection.query('INSERT INTO practice SET ?', postQuestion, function (err){
            if(err){
                socket.emit('entered1', 'Some Error Occurred :(');
                return;
            }
            else{
                socket.emit('entered1', 'Question has been added!');
                eventEmitter.emit('practice', 1);
            }
        });
        connection.query('INSERT INTO practice_title SET ?', postTitle, function (err){
            if(err){
                console.log(err);
                return;
            }
        });
    });
    socket.on('getQuestion', function (data){
        var str = data.toString().split('&');
        var Cid = str[0], Qid = str[1];
        var Q = 'select * from QUESTION_' + str[0] + ' where id = ' + str[1];
        connection.query(Q, function (err, rows){
            if(err){
                console.log(err);
                return;
            }
            var data = [];
            data = data.concat(rows[0]["ques"]);
            data = data.concat(rows[0]["op1"]);
            data = data.concat(rows[0]["op2"]);
            data = data.concat(rows[0]["op3"]);
            data = data.concat(rows[0]["op4"]);
            data = data.concat(rows[0]["answer"]);
            console.log(data);
            socket.emit('Q', data);
        })
    });
    socket.on('notification', function (data){
        eventEmitter.emit('notifier', data);
    });
    socket.on('update', function (data){      
        eventEmitter.emit('questionUpdate', data);  
        var Q = 'UPDATE QUESTION_' + data[0] + ' set ques = \'' + data[2] + '\' , op1 = \'' + data[3] + '\' , op2 = \'' + data[4] +  '\' , op3 = \'' + data[5] + '\' , op4 = \'' + data[6] + '\' , answer = \'' + data[7] + '\' where id = ' + data[1];
        console.log(Q);
        connection.query(Q, function (err){
            if(err){
                console.log(err);
                return;                
            }    
            else{
                connection.query('SELECT * from QUESTION_' + data[0], function (err, rows){
                    var ans = '';
                    for(var i = 0; i < rows.length; i++)
                        ans += rows[i]["answer"];
                    var Q = 'UPDATE contest set answers = \'' + ans + '\' where id =' + data[0];
                    connection.query(Q, function (err){
                        if(err){
                            console.log(err);
                        }
                    });
                });
            }
        });
        
    });

});
eventEmitter.on('notifier', function (data){
        io.sockets.emit('notification', data);        
});
eventEmitter.on('questionUpdate', function (data){
    console.log('!!!!!!!!!!!!!!!!');
    io.sockets.emit('questionUpdate', data);
});
io.set('authorization', function (handshakeData, accept){
    
    if(handshakeData.headers.cookie){
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        console.log(handshakeData.cookie['connect.sid']);
        var sid = cookieParser.signedCookie(handshakeData.cookie['connect.sid'],'1234567890QWERTYoolalathisisastupidkey');
        if(username1[sid])
            return accept(null, true);
        else
            return false;

    }

});
io.on('connection', function (socket){

    console.log('connected!');
    sid = cookie.parse(socket.handshake.headers.cookie);
    sid = cookieParser.signedCookie(sid['connect.sid'],'1234567890QWERTYoolalathisisastupidkey');
    
    socket.on('save', function (data){
        sid = cookie.parse(socket.handshake.headers.cookie);
        sid = cookieParser.signedCookie(sid['connect.sid'],'1234567890QWERTYoolalathisisastupidkey');
        var flag = true;
        var answer = '', num_answered = 0;
        for(var i = 0; i < data.length; i++){
            if(data[i]["option"]){
                if(data[i]["option"] != 'o' && (data[i]["option"] == 'A' || data[i]["option"] == 'B' || data[i]["option"] == 'C' || data[i]["option"] == 'D'))
                    num_answered++;
                answer += data[i]["option"];
            }
        }        
        console.log(answer);
        if(!validator.isAlpha(answer)){
            socket.emit('insert', 'failed');
            console.log("BLAH!!");
            flag = false;
            return;
        }
        var date = new Date();
        if(flag){
            u = url.parse(socket.handshake.headers.referer);
            u = u.pathname.split('/')[3];
            id = Number(u);
            if(id > contests)
                return;
            var post = {nick : username1[sid], answer : answer, time : date, id : id};
            connection.query('DELETE FROM CONTEST_TEMP where nick = ?', username1[sid], function (err){
                if(err){
                    socket.emit('insert', 'failed');
                    return;
                }
                connection.query('INSERT INTO CONTEST_TEMP SET ?', post, function (err){
                    if(err)
                        socket.emit('insert', 'fail');
                    else{
                        socket.emit('insert', num_answered);
                    }
                });

            });
        }

    });
    socket.on('fallback', function (){
        u = url.parse(socket.handshake.headers.referer);
        sid = cookie.parse(socket.handshake.headers.cookie);
        sid = cookieParser.signedCookie(sid['connect.sid'],'1234567890QWERTYoolalathisisastupidkey');
        u = u.pathname.split('/')[3];
        id = Number(u);
        if(id > contests)
            return;
        var Q = 'SELECT * from CONTEST_TEMP where nick =\'' + username1[sid] + '\' and id =\'' + id + '\'';
        connection.query(Q, function (err, rows){
            if(err){
                socket.emit('old', 'failed');
                return;
            }
            if(rows.length == 0){
                socket.emit('old', '!Exist');
                return;
            }
            socket.emit('old', rows[0]["answer"]);
        });
    });
    
    
    socket.on('saveImage', function (data){
        var flag = true;
        var date = new Date();
        u = url.parse(socket.handshake.headers.referer);
        u = u.pathname.split('/')[3];
        id = Number(u);
        data = JSON.stringify(data);
        if(data.length > 5000)
            flag = false;
        if(flag){
            var post = {nick : username1[sid], answer : data, time : date, id : id};
            connection.query('DELETE FROM CONTEST_TEMP where nick = ? and id = ?', [username1[sid], id], function (err){
                if(err){
                    socket.emit('insert', 'failed');
                    return;
                }
                connection.query('INSERT INTO CONTEST_TEMP SET ?', post, function (err){
                    if(err)
                        socket.emit('insert', 'fail');
                    else{
                    //socket.emit('insert', num_answered);
                    }
                });

            });
        }
    });
    socket.on('fallbackImage', function (){
        u = url.parse(socket.handshake.headers.referer);
        u = u.pathname.split('/')[3];
        id = Number(u);
        if(id > contests)
            return;
        var Q = 'SELECT * from CONTEST_TEMP where nick =\'' + username1[sid] + '\' and id =\'' + id + '\'';
        connection.query(Q, function (err, rows){
            if(err){
                socket.emit('fallback1', 'Error!');
            }
            if(rows.length == 0){
                socket.emit('fallback1', '!Exist');
            }
            else{
                socket.emit('fallback1', JSON.parse(rows[0]["answer"]));
            }
        });
    });

});
app.get('/Virtual', function (req, res){
    req.session.lastPage = req.url; 
    if(isAlive[req.session.stat]){
        connection.query('SELECT * from contest ORDER BY ID DESC', function (err,rows){
            var contest = rows;
            connection.query('SELECT nick, rating from profile1 where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
                var ranking = rows;
                connection.query('SELECT * from upcoming', function (err, rows){
                    var ms = -111000001010;
                    var up = [{id : "12221212", name: "fdsffsffsds"}];
                    if(rows.length == 1){
                        up = rows;
                        sTime = new Date(rows[0]["time"]).getTime();
                        cTime = new Date();
                        ms = (sTime - cTime).toString();
                        //console.log(sTime - cTime);
                    }
                    connection.query('SELECT * from vitual where username = ?', username[req.session.stat], function (err, rows){
                        if(err)
                            res.end();
                        

                    });
                    var incorrect = 0;
                    if(wrong[req.session.stat]){    
                        incorrect = 1;       
                        wrong[req.session.stat] = 0;
                    }                
                    res.render('virtual.ejs', {Nick : username[req.session.stat],ranking : ranking, upcoming : up, time : ms,contest : contest});
                
                });                      
                
            }); 

        }); 
    }
    else{
        res.render('notlogin.ejs');
    }
});
app.get(/Virtual\/Registration\/(.+)$/, function (req, res){

});
app.get(/Virtual\/id\/(.+)$/, function (req, res){
    res.end();
});

app.get('/Practice', function(req, res){
    req.session.lastPage = req.url;
    if(isAlive[req.session.stat]){
        connection.query('SELECT * from practice_title', function (err, rows){
            if(err){
                console.log(err);
                res.end();                
                return;
            }
            var titles = rows;
            connection.query('SELECT * from practice_parti where username = ?',[username1[req.sessionID]], function (err ,rows){
                if(err){
                    console.log(err);
                    res.end();
                    return;
                }
                if(rows.length == 0)
                    done = '';
                else
                    done = rows[0]["answer"];
                res.render("practice.ejs",{Nick : username[req.session.stat], titles : titles, done : done});
            });
        });
    }
    else
        res.render('notlogin.ejs')

});
app.get('/Practice/id/:id', function (req, res){
    req.session.lastPage = req.url;
    var id = req.params.id;
    if(!isAlive[req.session.stat]){
        res.render('notlogin.ejs');
        return;
    }
    if(isNaN(id)){
        res.end('No Such Question exists :(');
        return;
    }

    connection.query('SELECT * from practice where id = ?', [id], function (err, rows){
        if(err){
            console.log(err);
            res.end();            
            return;
        }
        if(rows.length == 0){
            res.end("No such question exists :(");
            return;
        }
        var answer = rows[0]["answer"];
        var question = rows[0]["ques"];
        var title = rows[0]["title"];
        connection.query('SELECT * from practice_parti where username = ?', username[req.session.stat], function (err, rows){
            if(err){
                console.log(err);
                res.end();            
                return;
            }
            var done;
            if(rows.length == 0)
                done = '';
            else
                done = rows[0]["answer"];
            if(done == '')
                answer = '';
            res.render('pracQuestion.ejs', {Nick : username[req.session.stat], done : done, answer : answer, question : question, title : title, message : '', id : id, correct : 0});
        });
    });
});
app.post('/Practice/id/:id', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end();
        return;
    }
    var id = req.params.id;
    if(isNaN(id)){
        res.end('No Such Question Exists :(');
    }
    var chunk = '';
    req.on('data', function (data){
        chunk += data;
    });
    req.on('end', function (data){
        var string = querystring.parse(chunk);
        connection.query('SELECT * from practice where id = ?', [id], function (err, rows){
            if(err){
                console.log(err);
                res.end("Database Snapped :(");
                return;
            }
            var ans = string["ans"];
            if(isNaN(ans)){
                res.end('Answer Must Be an Number!');      
                return;          
            }
            var answer = rows[0]["answer"];
            var question = rows[0]["ques"];
            var title = rows[0]["title"];
            if(ans == rows[0]["answer"]){  
                console.log(answer);
                console.log(rows[0]["answer"]);              
                connection.query('SELECT * from practice_parti where username = ?',[username[req.session.stat]], function (err ,rows){
                    if(err){
                        console.log(err);
                        return;
                    }
                    var ans = "";
                    if(rows.length == 0){
                        for(var i = 0; i < practice; i++){
                            if(i == id - 1)
                                ans += "1";
                            else
                                ans += "0";

                        }
                        ans = ans.toString();
                        ans[id-1] = "1";
                        var post = {
                            'username' : username[req.session.stat],
                            'answer' : ans
                        };
                        connection.query('INSERT INTO practice_parti SET ?', post, function (err){
                            if(err){
                                console.log(err);
                                return;
                            }
                        });
                    }
                    else{
                        ans = rows[0]["answer"].toString();
                        var A1 = '';
                        for(var i = 0; i < practice; i++){
                            if(i == id - 1)
                                A1 += "1";
                            else
                                A1 += ans[i];
                        }
                        console.log(A1);
                        var Q   = 'UPDATE practice_parti set answer = \'' + A1 + "\' where username = \'" + username[req.session.stat] + '\'';
                        connection.query(Q, function (err){
                            if(err){
                                console.log(err);
                                return;
                            }
                        });
                    }
                    


                });
                res.render('pracQuestion.ejs', {Nick : username[req.session.stat], done : '', answer : answer, question : question, title : title, message : 'You got it Right!', id : id, correct : 1});
            }
            else{
                res.render('pracQuestion.ejs', {Nick : username[req.session.stat], done : '', answer : answer, question : question, title : title, message : 'You got it Wrong :( Try Again !', id : id, correct : 0});
            }
        });
    });
});
app.post('/submitEmail', function (req, res){
    var chunk = '';
    req.on('data', function (data){
        chunk += data;
    });
    req.on('end', function(){
        var string = querystring.parse(chunk);
        email = string["email"];
        email = sanitizer.sanitize(email);
        if(validator.isEmail(email)){
            var Q = 'update profile1 set email = \'' + email + '\' where nick = \'' + username[req.session.stat] + '\''; 
            connection.query(Q,function(err,rows){
                if(err){
                    console.log(err);
                    res.end();
                    return;
                }
                res.redirect('http://' + ip + ':8888');
            });
        }
    });
});


app.get('/Contests', function (req, res){   

    req.session.lastPage = req.url; 
    connection.query('SELECT * from contest ORDER BY ID DESC', function (err,rows){
        var contest = rows;
        connection.query('SELECT nick, rating from profile1 where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
            var ranking = rows;
            connection.query('SELECT * from upcoming', function (err, rows){
                var ms = -111000001010;
                var up = [{id : "12221212", name: "fdsffsffsds"}];
                if(rows.length >= 1){
                    up = rows;
                    sTime = new Date(rows[0]["time"]).getTime();
                    cTime = new Date();
                    ms = (sTime - cTime).toString();
                    //console.log(sTime - cTime);
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
    if(id > contests || isNaN(id)){
        res.end('Sorry No Such Ranking Exists :(');
        return;
    }
    var Q = 'SELECT * from  CONTEST_' + id + ' GROUP BY username order by solved DESC, time';
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
            if(isAlive[req.session.stat]){
                var rank = rows.length;
                for(var i = 0; i < rows.length; i++){
                    if(rows[i]["username"] == username[req.session.stat]){
                        console.log(i);
                        rank = i + 1;                        
                        break;
                    }
                }
                res.render('contestranking.ejs', {ranking : rows, Nick : username[req.session.stat], rank : rank});
            }
            else
                res.render('contestoff.ejs', {ranking : rows})
        });
    //console.log(query.sql);

});
app.get(/contest\/id\/(.+)$/, function (req, res){
    //console.log(contests);
    var contest_id = req.params[0];
    
    console.log(contest_id);
    //console.log(req.url);
    console.log(contests);
    if(contest_id > contests || isNaN(contest_id)){
        res.write("Sorry No such contest found :(");
            res.end();
            return;
    }
    if(isAlive[req.session.stat]){
        var Q = 'SELECT * from QUESTION_' + contest_id + ';';
        var Q1 = 'SELECT * from contest where id = ' + contest_id + ';';

        connection.query(Q1, function (err, rows){
            eTime = new Date(rows[0]["Etime"]).getTime();
            sTime = new Date(rows[0]["Stime"]).getTime();
            cTime = new Date();
            answer = rows[0]["answers"]
            name = rows[0]["name"];
            type = rows[0]["type"]
            var flag = false;
            for(var i = 0; i < 6; i++)
                if(username[req.session.stat] == whitelist[i])
                    flag = true;
            if(!flag){
                if(sTime - cTime > 0){
                    connection.query('SELECT * from upcoming where id = ?', [contest_id], function(err,rows){
                    res.render('rules.ejs',{Nick : username[req.session.stat],time : sTime - cTime, upcoming : rows, name : name});
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
                //console.log(Q2);

                connection.query(Q2, function (err, rows){
                    var your = '';
                    for(var i = 0; i < answer.length; i++)
                        your += 'o'

                    attempted = 0, solved = 0;
                    if(err){
                        console.log(err);
                        res.end();
                        return;
                    }
                    if(rows.length > 0){
                        your = rows[0]["ans"];
                        attempted = rows[0]["attempted"];
                        solved = rows[0]["solved"];
                    }
                    if(your.toString().indexOf(',') != -1)
                        your = your.split(',');
                    console.log(your);
                    //console.log(answer[0]);
                    if(type == 'text')
                        live = 'contest.ejs';
                    else
                        live = 'contestImage.ejs';
                    if(rows.length > 0 && cTime < eTime){
                        res.render('submit.ejs', {Nick : username[req.session.stat], attempt : rows[0]["attempted"], score : rows[0]["solved"], id: contest_id});
                    }
                    else if(cTime > eTime && type == 'text')
                        res.render('answer.ejs', {Nick : username[req.session.stat], attempted : attempted, score : solved ,contest_name : name,complete : rows.length, time : ms, answer : answer, your : your});
                    else{
                        participants++;
                        console.log("Participants: " + participants);
                        res.render(live, {Nick : username[req.session.stat], contest_name : name, time : ms, question : question, complete : rows.length});
                    }
                    
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
    //console.log(req.url);
    //console.log(isAlive[req.session.stat]);
    if(isAlive[req.session.stat]){
        res.redirect('/');
        res.end();
    }
    else{
        connection.query('SELECT nick, rating from profile1 where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
            var ranking = rows;
            connection.query('SELECT * from upcoming', function (err, rows){
                var ms = -111000001010;
                var up = [{id : "12221212", name: "fdsffsffsds"}];
                if(rows.length >= 1){
                    up = rows;
                    sTime = new Date(rows[0]["time"]).getTime();
                    cTime = new Date();
                    ms = (sTime - cTime).toString();
                    //console.log(sTime - cTime);
                }
                       

                res.render('register.ejs', {ranking : ranking, upcoming : up, time : ms});
            });                      
                    
        });      
        
    }
});
app.get(/getUser\/(.+)$/, function (req, res){
    //console.log(req.url);
    var user = '';
    for(var i = 9; i < req.url.length; i++)
        user += req.url[i];
    var clean = sanitizer.sanitize(user);
    //console.log(user);
    var query = connection.query('SELECT * from profile1 where nick = ?',clean, function (err, rows){
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
        delete req.session.stat;
        delete username1[req.sessionID];
        res.redirect(req.session.lastPage);
        //res.end();
    }
    
    //res.writeHead(301,{'Location': 'http://192.168.126.29:8002/'}); 
    //res.end();
});
app.get('/', function (req, res) { 
    req.session.lastPage = req.url;
    //console.log(req.ip);
    //console.log(req.url);
    connection.query('SELECT nick, rating from profile1 where contest > 0 ORDER BY RATING DESC limit 10', function (err, rows){
        var ranking = JSON.stringify(rows);
        ranking = JSON.parse(ranking); 
        connection.query('SELECT * from upcoming', function (err, rows){
            var ms = -111000001010;
            var up = [{id : "12221212", name: "fdsffsffsds"}];
            if(rows.length >= 1){
                up = JSON.stringify(rows);
                up = JSON.parse(up);
                sTime = new Date(rows[0]["time"]).getTime();
                cTime = new Date();
                ms = (sTime - cTime).toString();
                //console.log(sTime - cTime);
            }
            var incorrect = 0;
            if(wrong[req.session.stat]){    
                incorrect = 1;       
                wrong[req.session.stat] = 0;
            }
            if(isAlive[req.session.stat]){                   
                res.render('loggedin.ejs', {Nick : username[req.session.stat], ranking : ranking, upcoming : up, time : ms, login : incorrect});
            }
            else{              
                res.render('index.ejs', {ranking : ranking, upcoming : up, time : ms, login : incorrect});
            }
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
        //console.log(req.ip);
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
                    var Q = 'update profile1 set ip = \'' +  req.ip +  '\' where nick = \'' + nick + '\';';
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
                    username1[req.sessionID] = nick;                   
                        
                }
                else{
                    wrong[rString] = 1;
                    req.session.stat = rString;  
                }
                if(req.session.lastPage == '/register')
                   req.session.lastPage = '/';
                if(req.session.lastPage)
                    res.redirect(req.session.lastPage);
                else
                    res.redirect('/');
                
            });            

        });
    }
});

function nick_pass(x){
    var l = x.length,flag = 1;
    for(var i = 0; i < l; i++){
        if(x[i] >= 'a' && x[i] <= 'z' || x[i] >= 'A' && x[i] <= 'Z' || x[i] >= '0' && x[i] <= '9' || x[i] == '!' || x[i] == '@' || x[i] == '^' || x[i] == '_')
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


app.post('register', function (req, res){

});
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
        if(isNaN(digits))
            ok = 0;
        console.log(digits + req.session.captcha);
        /*if(digits != req.session.captcha){
            res.redirect("192.168.126.29:8002/register");
            return;
        }*/
        name = validator.trim(name);
        var flag = name_city(name);    
        var ok = 1;

        if(!flag){
            ok = 0;            
        }
        

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
            connection.query('SELECT * from profile1 where ip = ?', req.ip, function (err, rows){
                //console.log(rows.length);
                if(rows.length > 100){
                    res.end();
                    return;
                }

            var query = connection.query('SELECT * from user where username = ?', nick, function (err, rows){
                //console.log(rows.length);            
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
                        post = {nick: nick, name : name, rating : 1500, contest : 0, city : city, high : 1500, accuracy : 0, problem : 0, ip : req.ip,email : email};
                        connection.query('INSERT INTO profile1 SET ?', post, function (err,rows){   
                            function randomString(length, chars) {
                                var result = '';
                                for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
                                    return result;
                            }            
                            var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                            req.session.stat = rString;
                            isAlive[rString] = 1;
                            username[rString] = nick;
                            username1[req.sessionID] = nick;
                            rating[rString] = 1500;
                            rank[rString] = 1;                                                  
                            res.end();                      
                        });
                }
                
            });
            

            });
            
        }
        else{
            res.end();
        }


        
        


    });
});

app.get(/users\/(.+)$/, function (req, res){   
    //console.log(req.url);
    req.session.lastPage = req.url;
    var clean = sanitizer.sanitize(req.params[0]);    
    var query = connection.query('SELECT * from profile1 a, profile1 b where a.nick = ? and ((b.contest > 0 and a.contest = 0) or ((a.contest > 0 and b.contest > 0 and a.rating < b.rating or b.nick =\'' + clean +'\')));',clean, function (err, rows){
        if(rows.length == 0){
            res.write("Sorry No Such User :(");
            res.end(); 
        }       
        var rank = rows.length;
        
        connection.query('SELECT * from profile1 where nick = ?',clean, function (err, rows){
            var profile = rows;
        
        connection.query('SELECT * from upcoming', function (err,rows){
            var ms = -111000001010;
            var up = [{id : "12221212", name: "fdsffsffsds"}];
            if(rows.length >= 1){
                sTime = new Date(rows[0]["time"]).getTime();
                cTime = new Date();
                ms = (sTime - cTime).toString();
                up = rows;
            }
            connection.query('SELECT * from participant where nick = ?', clean, function (err, rows){
                if(err){
                    //console.log()
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
    //console.log(query.sql);
});

app.get(/checkNick\/(.+)$/, function (req, res){
    console.log(req.headers.referer);
    
    if(req.headers.referer != 'http://192.168.102.108:8888/register'){
        console.log("WWWWWWW");
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
            res.end("OK");

    });
});

app.get('/admintest', function (req, res){
    if(req.session.stat && isAlive[req.session.stat]) {
        if(username[req.session.stat] == "Admin"){
            res.render('admintest.ejs', {Nick : username[req.session.stat]})
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
    if(username[req.session.stat] != 'Admin'){
        res.send('Sorry Wrong Address :(');
        return;
    }

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
        if(rows.length >= 1){
            sTime = new Date(rows[0]["time"]).getTime();
            cTime = new Date();
            ms = (sTime - cTime).toString();
            up = rows;
        }
        connection.query('SELECT * from profile1 where contest > 0 ORDER BY rating DESC;', function (err, rows){        
            var row = rows;            
            connection.query('SELECT * from profile1 where contest = 0', function (err, rows){
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
    u = url.parse(req.headers.referer);
    u = u.pathname.split('/')[3];
    id = Number(u);
    if(isNaN(id)){
        res.end();
        return;
    }
    if(id > contests){
        res.end();
        return;
    }
    if(!isAlive[req.session.stat])
        return;
    var Q3 = 'SELECT * from CONTEST_' + id + ' where username = \'' + username[req.session.stat] + '\''; 
    console.log(Q3);
    connection.query(Q3, function (err, rows){
        if(err){
            console.log(err);
            res.end();
            return;
        }
        if(rows.length > 0){
            res.end("Not Allowed to Submit");
            return;
        }
        var chunk = '';
        console.log(req.headers.referer);
        req.on('data' , function(data){
            chunk += data;
            });
            var answers = new Array();
            console.log(chunk);
            var ms = 0;
                req.on('end' , function (){
                var string = querystring.parse(chunk);
        
            connection.query('SELECT * from contest where id = ?',id,function(err, rows){
                console.log(id);
                var name = rows[0]["name"];
                sTime = new Date(rows[0]["Stime"]).getTime();
                eTime = new Date(rows[0]["Etime"]).getTime();
                cTime = new Date();
                ms = (cTime - sTime);
                ms1 = (eTime - cTime);
                console.log(ms + "   " + ms1);
                var flag = false;
                for(var i = 0; i < 6; i++)
                    if(username[req.session.stat] == whitelist[i])
                        flag = true;
                if(!flag){
                    if(ms < 0 || ms1 < -180000){
                        res.end();
                        console.log("YOOOYOYOY");
                        return;
                    }
                }
                if(rows[0]["type"] == "text"){
                    var answers = new Array();
                    var answer = rows[0]["answers"].toString();
                    var correct = 0;
                    var attempt = 0;
                    console.log(string);
                    console.log(answer);
                
                    for(var i = 0; i < answer.length; i++)
                        answers[i] =  'o';
                    for(var S in string){
                        if(isNaN(parseInt(S)) || parseInt(S) - 1 >= answer.length){
                            res.end();
                            return;
                        }
                        if(string[S] != 'A' && string[S] != 'B' && string[S] != 'C' && string[S] != 'D'){
                            res.end();
                            return;
                        }
                        answers[parseInt(S)-1] = string[S];
                        console.log(answers[parseInt(S)-1] + string[S]);
                        if(answers[parseInt(S)-1] == answer[parseInt(S)-1])
                            correct++;
                        attempt++;
                    }
                    correct = correct * 3 - (attempt - correct);
                    answers = answers.toString();
                    res.render('submit.ejs',{Nick : username[req.session.stat], attempt : attempt, score : correct, id : id});
                    var ans = '';
                    var Q = 'INSERT INTO CONTEST_'+ id +' VALUES(\'' + username[req.session.stat] + '\',\'' + answers  + '\',\'' + ms + '\',' + attempt + ',' + correct +');';
                    console.log(Q);
                    connection.query(Q, function(err,rows){
                        if(err){
                            console.log(err);
                            return;
                        }
                    
                    });
                    console.log(attempt);
                    console.log(correct);
                }
                else{
                    console.log(string);
                    var correct = 0;
                    var attempt = 0;
                    var Q = 'SELECT * FROM QUESTION_' + id;
                    var answers = new Array(), i = 0;
                    connection.query(Q, function (err, rows){
                        for(S in string){
                            temp = string[S].toString();
                            temp = temp.replace('\'' , '&#39;');
                            temp = temp.replace(',', '&#44;');
                            temp = sanitizer.sanitize(temp);
                            if(temp.length >= 30)
                                res.end();
                            if(temp == rows[parseInt(S) - 1]["answer"])
                                correct++;
                            if(temp.length == 0)
                                answers[i++] = 'oo';
                            else
                                answers[i++] = temp;
                            if(temp.length > 0)
                                attempt++;
                        }

                        answers = answers.toString();
                        answers = answers.replace(/,/g, '$###');
                        var Q1 = 'INSERT INTO CONTEST_'+ id +' VALUES(\'' + username[req.session.stat] + '\',\'' + answers  + '\',\'' + ms + '\',' + attempt + ',' + correct +');';
                        console.log(Q1);
                        connection.query(Q1 , function (err){
                            if(err){
                                console.log(err);
                                res.end();
                                return;
                            }
                            res.render('submit.ejs',{Nick : username[req.session.stat], attempt : attempt, score : correct, id : id});

                        });
                    });

                }

            });
        
        
        
        });
    });
    
});
app.get('/editorial7', function (req, res){
    console.log('downloaded');
    var P = path.resolve('/home/tantrik/editorial7.pdf');
    res.download(P);
});

app.get('/addNotification', function (req, res){
    if(isAlive[req.session.stat]){
        if(username[req.session.stat] != 'Admin')
            res.end('Sorry Wrong Address :(');
        res.render('notification.ejs', {Nick : username[req.session.stat]});

    }
    else{
        res.end('Sorry Wrong Address :(');
    }
});

app.get('/adminPanel', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('adminPanel.ejs', {Nick : username1[req.sessionID]});

});
app.get('/endContest', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }

    res.render('endContest.ejs', {Nick : username1[req.sessionID]});
});
app.get('/updateTime', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('updateTime.ejs', {Nick : username1[req.sessionID]});
});
app.get('/deleteContest', function (req,res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('delete.ejs', {Nick : username1[req.sessionID]});
});
app.get('/addImageTest', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('adminimage.ejs', {Nick : username1[req.sessionID]});
});
app.get('/deleteUser', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('deleteUser.ejs', {Nick : username1[req.sessionID]});
});
app.get('/addPractice', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('addpractice.ejs', {Nick : username1[req.sessionID]});
});
app.get('/updateQuestion', function (req, res){
    if(!isAlive[req.session.stat]){
        res.end('Sorry Wrong Address :(');
        return;
    }
    if(username1[req.sessionID] != 'Admin'){
        res.end('Sorry Wrong Address :(');
        return;
    }
    res.render('updateQuestion.ejs', {Nick : username1[req.sessionID]});
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


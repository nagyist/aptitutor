var socket = require('socket.io-client')('http://aptitutor.herokuapp.com');
socket.on('highstreak', function (data){
	console.log(data);
});
socket.on('streak', function (data){
	console.log(data);
});
socket.on('answer', function (data){
	console.log(data);
});
socket.on('number', function (data){
	console.log(data);
});
socket.emit('number', 'A');
//socket.emit('answer', 'A');
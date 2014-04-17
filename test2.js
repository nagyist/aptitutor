var express = require('express');
var app = express();

app.get('/awesome', function(req, res) {
  res.send("You're Awesome.");
});

app.get('/radical', function(req, res) {
  res.send('What a radical visit!');
});

app.get('/tubular', function(req, res) {
  res.send('Are you a surfer?');
});

//If you host the application on Modulus the PORT environment variable will be defined,
//otherwise I’m simply using 8080.
app.listen(process.env.PORT || 8080);
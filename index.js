var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// key line! - serve all static files from "css" directory under "/css" path
app.use(express.static('client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/client/lib/underscore/underscore.js', function(req, res) {
  res.sendFile(__dirname + '/client/lib/underscore/underscore.js');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  io.emit('connec', 'a new user');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
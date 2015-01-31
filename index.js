var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

function User(username, thumbnail){
	this.username = username;
	this.thumbnail = thumbnail;
}

function userExists(name){
  for(var i = 0; i < users.length; i++){
    if(users[i].name == name){
        return i;
    }
  }
  return -1;
}

function generateUser(){
	new_user = new User("Bob", "http://static.tumblr.com/ff8079335ffe2122813751fa64d3a87f/mjzseut/yxOmw9tr5/tumblr_static_lehnereyes.jpg");
	return new_user;
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connection', function(socket){
	io.emit('user setup');

	socket.on('addKikUser', function(user){
		users.push(new User(user.username, user.thumbnail));
	});

	socket.on('addUser', function(){
		newUser = generateUser();
		users.push(newUser);
		io.emit('set non kik user', newUser);
	});

	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tileGenerator = require('./tileGenerator');
var util = require('util')
var tiles;
var answers;

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

function tileSolveRequest(reqObj, socket){
	var reqUser = reqObj.user;
	var reqTiles = reqObj.tiles;
	for(var i = 0; i < answers.length; i++){
		if( answers[i][0].id === reqTiles[0] &&
			answers[i][1].id === reqTiles[1] &&
			answers[i][2].id === reqTiles[2]){
			console.log(reqTiles)
			resObj = {  user: reqUser,
						tiles: reqTiles};
			io.emit('tileSolved', reqObj);
			answers.splice(i, 1);
			console.log(answers)
			break;
		}
	}
}

function setupPhase() {
	tiles = tileGenerator.generate9Tiles();
	answers = tileGenerator.solveTiles(tiles);
	console.log(answers)
	io.emit('gamePhase', tiles);
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connection', function(socket){
	socket.emit('userSetup');

	socket.on('addKikUser', function(user){
		users.push(new User(user.username, user.thumbnail));
	});

	socket.on('addUser', function(){
		newUser = generateUser();
		users.push(newUser);
		socket.emit('setNonKikUser', newUser);
	});

	socket.emit('gamePhase', tiles);

	console.log('a user connected');
	socket.on('tileSolveRequest', function (reqObj){
		console.log(util.format('tileSolveRequest incoming %j', reqObj))
		tileSolveRequest(reqObj, socket);
		if (answers.length === 0){
			io.emit('setupPhase');
			setTimeout(setupPhase, 5000);
		}
	});
});

setupPhase();

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

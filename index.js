var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tileGenerator = require('./tileGenerator');
var util = require('util')
var tiles;
var answers;
var bobNum = 1;

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
	new_user = new User("Bob " + bobNum, "http://static.tumblr.com/ff8079335ffe2122813751fa64d3a87f/mjzseut/yxOmw9tr5/tumblr_static_lehnereyes.jpg");
	bobNum += 1;
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
			tileSolved = true
			answers.splice(i, 1);
			console.log(answers)
			break;
		}
	}
}

function setupPhase() {
	tiles = tileGenerator.generate9Tiles();
	answers = tileGenerator.solveTiles(tiles);
	io.emit('gamePhase', tiles);
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connection', function(socket){
	socket.emit('userSetup');
	// TODO: only enter gamephase when actually in game phase
	socket.emit('gamePhase', tiles);

	socket.on('addKikUser', function(user){
		users.push(new User(user.username, user.thumbnail));
	});

	socket.on('addUser', function(){
		newUser = generateUser();
		users.push(newUser);
		socket.emit('setNonKikUser', newUser);
	});

	console.log('a user connected');
	socket.on('tileSolveRequest', function (reqObj){
		console.log(util.format('tileSOlveRequest incoming %j', reqObj))
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

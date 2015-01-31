var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tileGenerator = require('./tileGenerator');
var util = require('util')
var phase;
var tiles;
var answers = [];
var bobNum = 1;

var users = [];

function User(username, thumbnail){
	this.username = username;
	this.thumbnail = thumbnail;
}

function userExists(name){
  for(var i = 0; i < users.length; i++){
    if(users[i].username == name){
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
	var correctReq = false;
	for(var i = 0; i < answers.length; i++){
		if( answers[i][0].id === reqTiles[0] &&
			answers[i][1].id === reqTiles[1] &&
			answers[i][2].id === reqTiles[2]){
			console.log('Answer found by user: ' + JSON.stringify(reqUser))
			correctReq = true;
			resObj = {  user: reqUser,
						tiles: answers[i]};
			io.emit('tileSolved', resObj);
			answers.splice(i, 1);
			console.log('answers left: ' + answers.length)
			break;
		}
	}
	if(!correctReq){
		socket.emit('errorRequest');
	}
}

function noMoreMovesRequest(user, socket){
	if(answers.length === 0){
		console.log('No more moves found by user: ' + user);
		io.emit('setupPhase');
		setTimeout(setupPhase, 5000);
	} else {
		console.log('There are still more moves: ' + user);
		socket.emit('errorNoMoreMovesRequest');
	}
}

function setupPhase() {
	tiles = tileGenerator.generate9Tiles();
	answers = tileGenerator.solveTiles(tiles);
	console.log(answers)
	phase = 'gamePhase';
	io.emit(phase, tiles);
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connection', function (socket){
	socket.emit('userSetup');
	// TODO: only enter gamephase when actually in game phase
	socket.emit(phase, tiles);

	socket.on('addKikUser', function (user){
		var currentUser = userExists(user.username);
		if(currentUser !== -1){
			socket.emit('existingUser', currentUser);
		} else {
			users.push(new User(user.username, user.thumbnail));
		}
	});

	socket.on('addUser', function(){
		newUser = generateUser();
		users.push(newUser);
		socket.emit('setNonKikUser', newUser);
	});

	console.log('a user connected');
	socket.on('tileSolveRequest', function (reqObj){
		console.log(util.format('tileSolveRequest incoming %j', reqObj))
		tileSolveRequest(reqObj, socket);
		if (answers.length === 0){
			phase = 'setupPhase';
			io.emit(phase);
			setTimeout(setupPhase, 5000);
		}
	});

	socket.on('noMoreMovesRequest', function(user){
		console.log(util.format('noMoreMovesRequest incoming %j', user));
		noMoreMovesRequest(user, socket);
	});
});

setupPhase();

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

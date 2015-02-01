var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tileGenerator = require('./tileGenerator');
var util = require('util')
var phase;
var score = {};
var tiles;
var answers = [];
var moveLog = [];
var bobNum = 1;

var users = [];

function User(username, thumbnail){
	this.username = username;
	this.thumbnail = thumbnail;
}

function userExists(name){
	for(var i = 0; i < users.length; i++){
		if(users[i].username == name){
			return users[i];
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
			correctReq = true;
			if(score[reqUser.username]){
				score[reqUser.username].points += 1;
			} else {
				score[reqUser.username] = {
					user: reqUser,
					points: 1
				};
			}
			resObj = {  user: reqUser,
						tiles: answers[i]};
			io.emit('tileSolved', resObj);
			socket.emit('successRequest');
			answers.splice(i, 1);
			moveLog.push(resObj);
			console.log('answers left: ' + answers.length)
			console.log(util.format('answers: %j', answers));
			return;
		}
	}
	if(!correctReq){
		for(var i =0; i < moveLog.length; i++){
			if( moveLog[i].tiles[0].id === reqTiles[0] &&
			moveLog[i].tiles[1].id === reqTiles[1] &&
			moveLog[i].tiles[2].id === reqTiles[2]){
				socket.emit('errorRequest', moveLog[i].user.thumbnail);
				return;
			}
		}
		socket.emit('errorRequest');
	}
}

function noMoreMovesRequest(user, socket){
	if(answers.length === 0){
		console.log('No more moves found by user: ' + user.username);
		if(score[user.username]){
			score[user.username].points += 2;
		} else {
			score[user.username] = {
				user: user,
				points: 2
			};
		}
		phase = 'setupPhase';
		io.emit(phase, score);
		setupPhase();
	} else {
		socket.emit('errorNoMoreMovesRequest');
		if(score[user.username]){
			if(score[user.username].points > 0){
				score[user.username].points -= 1;
			}
		} else {
			score[user.username] = {
				user: user,
				points: 0
			};
		}
	}
}

function setupPhase() {
	tiles = tileGenerator.generate9Tiles();
	answers = tileGenerator.solveTiles(tiles);
	console.log(answers)
	moveLog = [];
	setTimeout(function(){
		score = {};
		phase = 'gamePhase';
		io.emit(phase, tiles);
	}, 15000);
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

io.on('connection', function (socket){

	if(phase === 'gamePhase'){
		socket.emit(phase, tiles);
		for(var i = 0; i < moveLog.length; i++){
			socket.emit('tileSolved', moveLog[i]);
		}
	} else if(phase === 'setupPhase') {
		socket.emit(phase, score);
	}

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

	socket.on('tileSolveRequest', function (reqObj){
		tileSolveRequest(reqObj, socket);
	});

	socket.on('noMoreMovesRequest', function(user){
		noMoreMovesRequest(user, socket);
	});
});

setupPhase();

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

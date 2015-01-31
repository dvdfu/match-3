var socket = io();
var userObj;
var guess = [];
var OPACITY = '0.35'
var time;
var WRONG_ANSWER_PENALTY = 30;
var MORE_MOVES_PENALTY = 50;


socket.on('gamePhase', function (tiles) {
	renderTiles(tiles);
	$('.list-group').empty()
	$('.list-group').append('<li class="list-group-item active">Move Log</li>')
})

socket.on('setNonKikUser', function (user){
	userObj = user;
});

socket.on('userSetup', function(){
	if(kik.enabled){
		kik.getUser(function (user){
			if (!user){
				socket.emit('addUser');
				console.log("no kik permission");
			} else {
				userObj = {
					username: user.username,
					thumbnail: user.thumbnail
				};
				socket.emit('addKikUser', user);
				console.log("kik permission");
			}
		});
	} else {
		socket.emit('addUser');
		console.log("kik not enabled");
	}
})

socket.on('existingUser', function(user){
	userObj = user;
});

socket.on('errorRequest', function (){
	console.log("WRONG ANSWER")
	penalty(WRONG_ANSWER_PENALTY);
});

socket.on('errorNoMoreMovesRequest',function(){
	console.log("THERE ARE STILL MOVES");
	penalty(MORE_MOVES_PENALTY);
});

function renderTiles(tiles) {
	$('#row0').empty();
	$('#row1').empty();
	$('#row2').empty();

	for (var i = 0; i < tiles.length; i++) {
		var shape;
		tile = tiles[i];

		if (tile.shape === 'square') {
			shape = '<rect class="shape color-' + tile.shapeColor + '" x="0" y="0" width="100" height="100"/>';
		} else if (tile.shape === 'triangle') {
			shape = '<polygon class="shape color-' + tile.shapeColor + '" points="50,0 0,100 100,100"/>';
		} else if (tile.shape === 'circle') {
			shape = '<circle class="shape color-' + tile.shapeColor + '" cx="50" cy="50" r="50"/>';
		}

		var html = '<div class="col-xs-4">' +
			'<div class="tile color-' + tile.backgroundColor + '" id="'+tile.id +'">' +
			'<svg class="shape-svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
			shape +
			'</svg>' + '</div>' + '</div>'

		$('#row' + Math.floor(i / 3)).append(html);
	}

	$('.tile').on('click', tileClickHandler);
	$('#no-more').on('click', noMoreClickHandler);
}

function tileClickHandler(){
	var $el = document.getElementById($(this)[0].id)
	var id = parseInt($el.id)

	if($el.style && $el.style.opacity === OPACITY){
		$el.style.opacity=1
		var index = guess.indexOf(id)
		guess.splice(index, index+1)
	} else if(guess.length < 3){
		guess.push(id)
		$el.style.opacity=OPACITY
		if(guess.length === 3){
			socket.emit('tileSolveRequest', {
				user: userObj,
				tiles: guess.sort(function (a,b){return a-b})
			})
			for (var i = guess.length - 1; i >= 0; i--) {
				document.getElementById(guess[i]).style.opacity = 1
			};
			guess = []
		}
	}
}

function noMoreClickHandler(){
	socket.emit('noMoreMovesRequest', userObj);
}

function penalty(penaltyTime){
	time = penaltyTime;
	$('.tile').unbind("click");
	$('#no-more').unbind("click");
	setInterval(function () {
		if (time == 0) {
			$('.tile').bind("click", tileClickHandler);
			$('#no-more').bind("click", noMoreClickHandler);
			console.log("client time is 0");
		} else {
			time--;
			$("#timer").text("Penalty Time: " + (time / 10).toFixed(1) + "s");
		}
	}, 100);
}

var socket = io();
var userObj;
var guess = [];
var OPACITY = '0.35'

$(document).ready(function() {
	$('#instructions').on('click', function() {
		$('#instructions').animate({
			opacity: 0
		}, 400, 'swing',
		function() {
			$('#instructions').hide();
		});
	});
});


socket.on('gamePhase', function (tiles) {
	renderTiles(tiles);
	$('.list-group').empty()
	$('.list-group').append('<li class="list-group-item active">Move Log</li>')
	// slide(true);
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
				socket.emit('addKikUser', userObj);
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
	showX()
});

socket.on('successRequest', function (){
	showCheckMark()
})

socket.on('errorNoMoreMovesRequest',function(){
	console.log("THERE ARE STILL MOVES");
	showMinusOne();
});

socket.on('setupPhase', function (score){
	$('.tile').unbind('click');
	$('#no-more').unbind('click');
	// slide(false);
	console.log('score');
	console.log(score);
});

function slide(on) {
	if (on) {
		$('#tile-container').animate({
			top: '+=300'
		}, 500);

		$('.moveLog').animate({
			left: '-=400'
		}, 500);
	} else {
		$('#tile-container').animate({
			top: '-=300'
		}, 500);

		$('.moveLog').animate({
			left: '+=400'
		}, 500);
	}
}

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
	$('.tile').unbind('click')
	$('#no-more').unbind('click')
	$('.tile').on('click', tileClickHandler);
	$('#no-more').on('click', noMoreClickHandler);
}

function tileClickHandler(){
	var $el = this
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
			$('.tile').unbind('click')
			guess = []
		}
	}
}

function noMoreClickHandler(){
	socket.emit('noMoreMovesRequest', userObj);
	$('#no-more').unbind('click')
}

function showCheckMark(){
	$('.fa-times').hide();
	$('#minusone').hide();
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('.fa-check').show();
		$('#showResult').show()

		setTimeout(function (){
			$('#showResult').hide()
			$('#showBoard').show()
			$('#showBoard').animate({
				opacity: 1
			}, 250, function (){
				$('.tile').unbind('click')
				$('.tile').bind('click', tileClickHandler)
			})
		}, 500)
	})
}

function showX(){
	$('.fa-check').hide();
	$('#minusone').hide();
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('.fa-times').show();
		$('#showResult').show()

		setTimeout(function (){
			$('#showResult').hide()
			$('#showBoard').show()
			$('#showBoard').animate({
				opacity: 1
			}, 250, function (){
				$('.tile').unbind('click')
				$('.tile').bind('click', tileClickHandler)
				$('#no-more').unbind('click')
				$('#no-more').bind('click', noMoreClickHandler)
			})
		}, 500)

	})
}

function showMinusOne(){
	$('.fa-check').hide();
	$('.fa-times').hide();
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('#minusone').show();
		$('#showResult').show()

		setTimeout(function (){
			$('#showResult').hide()
			$('#showBoard').show()
			$('#showBoard').animate({
				opacity: 1
			}, 250, function (){
				$('.tile').unbind('click')
				$('.tile').bind('click', tileClickHandler)
				$('#no-more').unbind('click')
				$('#no-more').bind('click', noMoreClickHandler)
			})
		}, 500)

	})
}

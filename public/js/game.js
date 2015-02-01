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
	guess = [];
	renderTiles(tiles);
	$('.list-group').empty()
	$('.list-group').append('<li class="list-group-item active">Match History</li>')
	$('#score').hide();
	$('#score').css('opacity', 0);
})

socket.on('setNonKikUser', function (user){
	userObj = user;
});


if(kik.enabled){
	kik.getUser(function (user){
		if (!user){
			socket.emit('addUser');
		} else {
			userObj = {
				username: user.username,
				thumbnail: user.thumbnail
			};
			socket.emit('addKikUser', userObj);
		}
	});
} else {
	socket.emit('addUser');
}

socket.on('existingUser', function(user){
	userObj = user;
});

socket.on('errorRequest', function (thumbnail){
	if (thumbnail) {
		showFace(thumbnail);
	} else {
		showX();
	}
});

socket.on('successRequest', function (){
	showCheckMark()
})

socket.on('errorNoMoreMovesRequest',function(){
	showX()
});

socket.on('setupPhase', function (score) {
	$('.tile').unbind('click');
	$('#no-more').unbind('click');
	var topUser;
	for(var key in score){
		topUser = score[key];
		break;
	}
	for(var key in score){
		if(score[key].points > topUser.points){
			topUser = score[key];
		}
	}
	$('#user-image').attr('src', topUser.user.thumbnail);
	$('#username').text(topUser.user.username);
	$('#winner-text').text('Winner!');
	$('#score').show();
	$('#score').animate({
		opacity: 1
	}, 400, 'swing');

	$('#scoreboard').empty();
	// score.sort(function(a, b) {
	// 	return b.points - a.points;
	// });
	for (var key in score) {
		if (score[key].user.username !== topUser.user.username) {
			$('#scoreboard').append(
				'<li class="list-group-item">'+
					'<div class="row">'+
						'<div class="col-xs-4">'+
							'<img src="'+score[key].user.thumbnail+'"/>'+
						'</div>'+
						'<div class="col-xs-4">'+
							'<span class="badge">'+score[key].user.username+'</span>'+
						'</div>'+
						'<div class="col-xs-4">'+
							'<span class="badge">'+score[key].points+'</span>'+
						'</div>'+
					'</div>'+
				'</li>');
		}
	}
	// slide(false);
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
	$('.fa-times').hide()
	$('#show-face').hide();
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('.fa-check').show()
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

function showFace(thumbnail){
	if (!thumbnail) return

	$('.fa-check').hide()
	$('.fa-times').hide()
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('#actual-image').attr("src", thumbnail);
		$('#show-face').show();
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


function showX(){
	$('.fa-check').hide()
	$('#show-face').hide();
	$('#showBoard').animate({
		opacity: 0
	}, 250, function (){
		$('#showBoard').hide()
		$('.fa-times').show()
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

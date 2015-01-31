var socket = io();
var username;
var userObj;
var thumbnail;
var guess = [];

socket.on('gamePhase', function (tiles) {
	renderTiles(tiles);
})

socket.on('setNonKikUser', function (user){
	username = user.username;
	thumbnail = user.thumbnail;
	userObj = user;
});

socket.on('userSetup', function(){
	if(kik.enabled){
		kik.getUser(function (user){
			if (!user){
				socket.emit('addUser');
				console.log("no kik permission");
			} else {
				username = user.username;
				thumbnail = user.thumbnail;
				socket.emit('addKikUser', user);
				console.log("kik permission");
			}
		});
	} else {
		socket.emit('addUser');
		console.log("kik not enabled");
	}
});

function renderTiles(tiles) {
	var container = document.getElementById('tile-container');
	var shape;

	$('#row0').empty();
	$('#row1').empty();
	$('#row2').empty();

	for (var i = 0; i < tiles.length; i++) {
		tile = tiles[i];

		if (tile.shape === 'square') {
			shape = '<rect class="shape color-' + tile.shapeColor + '" x="0" y="0" width="100" height="100"/>';
		} else if (tile.shape === 'triangle') {
			shape = '<polygon class="shape color-' + tile.shapeColor + '" points="50,0 0,100 100,100"/>';
		} else if (tile.shape === 'circle') {
			shape = '<circle class="shape color-' + tile.shapeColor + '" cx="50" cy="50" r="50"/>';
		}

		$('#row' + Math.floor(i / 3)).append(
			'<div class="col-xs-4">' +
			'<div class="tile color-' + tile.backgroundColor + '" id="'+tile.id +'">' +
			'<svg class="shape-svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
			shape +
			'</svg>' + '</div>' + '</div>');
	}

	$('.tile').on('click', function (){
		var $el = document.getElementById($(this)[0].id)
		var id = parseInt($el.id)

		if($el.style && $el.style.opacity === '0.7'){
			$el.style.opacity=1
			var index = guess.indexOf(id)
			guess.splice(index, index+1)
		} else if(guess.length < 3){
			guess.push(id)
			$el.style.opacity=0.7
			if(guess.length === 3){
				socket.emit('tileSolveRequest', {
					user: userObj,
					tiles: guess
				})
				for (var i = guess.length - 1; i >= 0; i--) {
					document.getElementById(guess[i]).style.opacity = 1
				};
				guess = []
			}
		}
	});
}


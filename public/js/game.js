var socket = io();
var username;
var thumbnail;

$('form').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});

socket.on('set non kik user', function(user){
	username = user.username;
	thumbnail = user.thumbnail;
});

socket.on('user setup', function(){
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
	var shape, bgColor;
	for (var i = 0; i < tiles.length; i++) {
		tile = tiles[i];

		if (tile.backgroundColor === 'black') {
			bgColor = 'red-light';
		} else if (tile.backgroundColor === 'grey') {
			bgColor = 'blue-light';
		} else if (tile.backgroundColor === 'white') {
			bgColor = 'yellow-light';
		}

		if (tile.shape === 'square') {
            shape = '<rect class="shape color-' + tile.shapeColor + '" x="0" y="0" width="100" height="100"/>';
		} else if (tile.shape === 'triangle') {
            shape = '<polygon class="shape color-' + tile.shapeColor + '" points="50,0 0,100 100,100"/>';
		} else if (tile.shape === 'circle') {
			shape = '<circle class="shape color-' + tile.shapeColor + '" cx="50" cy="50" r="50"/>';
		}

		$('#row' + Math.floor(i / 3)).append(
			'<div class="col-xs-4">' +
	        	'<div class="tile color-' + bgColor + '">' +
	            	'<svg class="shape-svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
	            		shape +
	            	'</svg>' +
	            '</div>' +
	        '</div>');
	}
}
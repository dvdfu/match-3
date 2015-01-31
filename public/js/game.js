var socket = io();

var username;
var thumbnail;
var guess = [];

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

$('.tile').on('click', function (){
	var id = 4//parseInt($(this).id)
	var $el = $(this)[0]//document.getElementById(id)
	if($el.style && $el.style.opacity === '0.7'){
		$el.style.opacity=1
		var index = guess.indexOf(id)
		guess.splice(index, index+1)
	} else if(guess.length < 3){
		guess.push(id)
		$el.style.opacity=0.7
		if(guess.length === 3){
			socket.emit('tileSolveRequest', {
				user: username,
				tiles: guess
			})
			for (var i = guess.length - 1; i >= 0; i--) {
				document.getElementById(guess[i]).style.opacity = 1
			};
			guess = []
		}
	}
});

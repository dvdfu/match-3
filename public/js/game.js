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
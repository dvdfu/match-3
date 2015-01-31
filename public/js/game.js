var socket = io();

var username;
var userObj;
var thumbnail;
var guess = [];

socket.on('setNonKikUser', function(user){
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

$('.tile').on('click', function (){
	var id = parseInt($(this).id)
	var $el = document.getElementById(id)
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


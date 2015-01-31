(function (){
  socket.on('tileSolved', function (move){
    $('.list-group')
      .append(
        '<li class="list-group-item">'+
        JSON.stringify(move.tiles)+
        '<span class="badge">'+
        move.user+
        '</span>'+
        '</li>'
      )
  });
})()

(function (){
  socket.on('tile solved', function (move){
    var tiles = [
    { id: 9 },
    { id: 13 },
    { id: 20} ]
    $('.list-group')
      .append(
        '<li class="list-group-item">'+
        JSON.stringify(tiles)+
        '<span class="badge">'+
        move.user+
        '</span>'+
        '</li>'
      )
  });
})()

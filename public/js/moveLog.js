(function (){
  socket.on('tileSolved', function (move){
    $('.list-group')
      .append(
        '<li class="list-group-item">'+
        (move.user ? '<img src="'+ move.user.thumbnail +'"/>' : '') +
        generateShape(move.tiles)+
        '<span class="badge">'+
        (move.user && move.user.username) || '' +
        '</span>'+
        '</li>'
      )
  });

  function generateShape(tiles){
    var shape;
    var html = '';
    for (var i = 0; i < 3; i++) {
      tile = tiles[i];

      if (tile.shape === 'square') {
        shape = '<rect class="shape color-' + tile.shapeColor + '" x="0" y="0" width="100" height="100"/>';
      } else if (tile.shape === 'triangle') {
        shape = '<polygon class="shape color-' + tile.shapeColor + '" points="50,0 0,100 100,100"/>';
      } else if (tile.shape === 'circle') {
        shape = '<circle class="shape color-' + tile.shapeColor + '" cx="50" cy="50" r="50"/>';
      }

      html += ('<div class="tileWrapper">' +
      '<div class="tile color-' + tile.backgroundColor + '" id="'+tile.id +'">' +
      '<svg class="shape-svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
      shape +
      '</svg>' + '</div>' + '</div>')

    }
    return html
  }
})()

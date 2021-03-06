// you can just require this by doing:
//
// var generator = require('./tileGenerator')
//
// then use my 2 methods by doing:
//
// generator.generate9Tiles() or generator.solveTiles(*give array*)

module.exports = (function (){
  return {
    generate9Tiles: generate9Tiles,
    solveTiles: solveTiles
  }
})()

function create27Tiles(){
  return [
    {id: 1, shape: 'square', backgroundColor: 'red-light', shapeColor: 'blue'},
    {id: 2, shape: 'square', backgroundColor: 'red-light', shapeColor: 'red'},
    {id: 3, shape: 'square', backgroundColor: 'red-light', shapeColor: 'yellow'},
    {id: 4, shape: 'square', backgroundColor: 'blue-light', shapeColor: 'blue'},
    {id: 5, shape: 'square', backgroundColor: 'blue-light', shapeColor: 'red'},
    {id: 6, shape: 'square', backgroundColor: 'blue-light', shapeColor: 'yellow'},
    {id: 7, shape: 'square', backgroundColor: 'yellow-light', shapeColor: 'blue'},
    {id: 8, shape: 'square', backgroundColor: 'yellow-light', shapeColor: 'red'},
    {id: 9, shape: 'square', backgroundColor: 'yellow-light', shapeColor: 'yellow'},

    {id: 10, shape: 'circle', backgroundColor: 'red-light', shapeColor: 'blue'},
    {id: 11, shape: 'circle', backgroundColor: 'red-light', shapeColor: 'red'},
    {id: 12, shape: 'circle', backgroundColor: 'red-light', shapeColor: 'yellow'},
    {id: 13, shape: 'circle', backgroundColor: 'blue-light', shapeColor: 'blue'},
    {id: 14, shape: 'circle', backgroundColor: 'blue-light', shapeColor: 'red'},
    {id: 15, shape: 'circle', backgroundColor: 'blue-light', shapeColor: 'yellow'},
    {id: 16, shape: 'circle', backgroundColor: 'yellow-light', shapeColor: 'blue'},
    {id: 17, shape: 'circle', backgroundColor: 'yellow-light', shapeColor: 'red'},
    {id: 18, shape: 'circle', backgroundColor: 'yellow-light', shapeColor: 'yellow'},

    {id: 19, shape: 'triangle', backgroundColor: 'red-light', shapeColor: 'blue'},
    {id: 20, shape: 'triangle', backgroundColor: 'red-light', shapeColor: 'red'},
    {id: 21, shape: 'triangle', backgroundColor: 'red-light', shapeColor: 'yellow'},
    {id: 22, shape: 'triangle', backgroundColor: 'blue-light', shapeColor: 'blue'},
    {id: 23, shape: 'triangle', backgroundColor: 'blue-light', shapeColor: 'red'},
    {id: 24, shape: 'triangle', backgroundColor: 'blue-light', shapeColor: 'yellow'},
    {id: 25, shape: 'triangle', backgroundColor: 'yellow-light', shapeColor: 'blue'},
    {id: 26, shape: 'triangle', backgroundColor: 'yellow-light', shapeColor: 'red'},
    {id: 27, shape: 'triangle', backgroundColor: 'yellow-light', shapeColor: 'yellow'}
  ]
}

function generate9Tiles(){
  var randomTiles = []
  var tiles = create27Tiles()
  shuffle(tiles)
  for (var i = 9 - 1; i >= 0; i--) {
    randomTiles.push(tiles.pop())
  }
  return randomTiles;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function solveTiles(tiles){
  var answers = []
  for (var i = 0; i < 7; i++){
    for(var j = i+1; j < 8; j++){
      for(var k = j+1; k < 9; k++){
        if(
          (( tiles[i].shape === tiles[j].shape &&
              tiles[i].shape === tiles[k].shape ) ||
            ( tiles[i].shape !== tiles[j].shape &&
              tiles[i].shape !== tiles[k].shape &&
              tiles[j].shape !== tiles[k].shape )) &&
          (( tiles[i].backgroundColor === tiles[j].backgroundColor &&
              tiles[i].backgroundColor === tiles[k].backgroundColor ) ||
            ( tiles[i].backgroundColor !== tiles[j].backgroundColor &&
              tiles[i].backgroundColor !== tiles[k].backgroundColor &&
              tiles[j].backgroundColor !== tiles[k].backgroundColor )) &&
          (( tiles[i].shapeColor === tiles[j].shapeColor &&
              tiles[i].shapeColor === tiles[k].shapeColor ) ||
            ( tiles[i].shapeColor !== tiles[j].shapeColor &&
              tiles[i].shapeColor !== tiles[k].shapeColor &&
              tiles[j].shapeColor !== tiles[k].shapeColor ))
          ){
          answers.push([tiles[i], tiles[j], tiles[k]]);
        }
      }
    }
  }
  for (var i = answers.length - 1; i >= 0; i--) {
    answers[i].sort(function (a,b){
      return a.id-b.id;
    })
  };
  return answers
}

// TESTS
//
// var selectedTiles = generate9Tiles()
// console.log(selectedTiles)
// var answerTiles = solveTiles(selectedTiles)
// console.log(answerTiles)

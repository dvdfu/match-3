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
    {shape: 'square', backgroundColor: 'black', shapeColor: 'blue'},
    {shape: 'square', backgroundColor: 'black', shapeColor: 'red'},
    {shape: 'square', backgroundColor: 'black', shapeColor: 'yellow'},
    {shape: 'square', backgroundColor: 'grey', shapeColor: 'blue'},
    {shape: 'square', backgroundColor: 'grey', shapeColor: 'red'},
    {shape: 'square', backgroundColor: 'grey', shapeColor: 'yellow'},
    {shape: 'square', backgroundColor: 'white', shapeColor: 'blue'},
    {shape: 'square', backgroundColor: 'white', shapeColor: 'red'},
    {shape: 'square', backgroundColor: 'white', shapeColor: 'yellow'},

    {shape: 'circle', backgroundColor: 'black', shapeColor: 'blue'},
    {shape: 'circle', backgroundColor: 'black', shapeColor: 'red'},
    {shape: 'circle', backgroundColor: 'black', shapeColor: 'yellow'},
    {shape: 'circle', backgroundColor: 'grey', shapeColor: 'blue'},
    {shape: 'circle', backgroundColor: 'grey', shapeColor: 'red'},
    {shape: 'circle', backgroundColor: 'grey', shapeColor: 'yellow'},
    {shape: 'circle', backgroundColor: 'white', shapeColor: 'blue'},
    {shape: 'circle', backgroundColor: 'white', shapeColor: 'red'},
    {shape: 'circle', backgroundColor: 'white', shapeColor: 'yellow'},

    {shape: 'triangle', backgroundColor: 'black', shapeColor: 'blue'},
    {shape: 'triangle', backgroundColor: 'black', shapeColor: 'red'},
    {shape: 'triangle', backgroundColor: 'black', shapeColor: 'yellow'},
    {shape: 'triangle', backgroundColor: 'grey', shapeColor: 'blue'},
    {shape: 'triangle', backgroundColor: 'grey', shapeColor: 'red'},
    {shape: 'triangle', backgroundColor: 'grey', shapeColor: 'yellow'},
    {shape: 'triangle', backgroundColor: 'white', shapeColor: 'blue'},
    {shape: 'triangle', backgroundColor: 'white', shapeColor: 'red'},
    {shape: 'triangle', backgroundColor: 'white', shapeColor: 'yellow'}
  ]
}

function generate9Tiles(){
  var randomTiles = []
  var tiles = create27Tiles()
  for (var i = 9 - 1; i >= 0; i--) {
    shuffle(tiles)
    randomTiles.push(tiles.pop())
  }
  return randomTiles
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
      for(var k = i+2; k < 9; k++){
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
          answers.push([tiles[i], tiles[j], tiles[k]])
        }
      }
    }
  }
  return answers
}

// TESTS
// 
// var selectedTiles = generate9Tiles()
// console.log(selectedTiles)
// var answerTiles = solveTiles(selectedTiles)
// console.log(answerTiles)
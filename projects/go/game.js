var Go = Go || {};

Go.game = (function () {
  var Game = function() {
    this.turn = 1;
    this.table = Go.util.matrix(Go.config.columns, Go.config.rows);
  };

  Game.prototype.render = function (canvas) {
    var g = Go.draw.graphics(canvas);
    Go.draw.borders(g);

    for (var i = 0; i < Go.config.columns; i++) {
      for (var j = 0; j < Go.config.rows; j++) {
        Go.draw.cell(g, this.table[i][j], i, j);
      }
    }
  };

  Game.prototype.handler = function (canvas, e) {
    var x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop;
    var i = Math.floor(x / Go.config.grid_size), j = Math.floor(y / Go.config.grid_size);
    if (this.table[i][j]) {
      console.log('Invalid move!');
      return;
    }
    this.table[i][j] = this.turn;
    this.turn *= -1;
    this.render(canvas);
  };

  return Game;
})();

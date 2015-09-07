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
    this.play(i, j);
    this.render(canvas);
  };

  Game.prototype.play = function (i, j) {
    this.table[i][j] = this.turn;
    this.removeDeceased();
    this.turn *= -1;
  };

  Game.prototype.countLiberties = function (i, j) {
    var table = this.table;
    var free = function (i, j) {
      if (i < 0 || i >= Go.config.columns) {
        return 0;
      }
      if (j < 0 || j >= Go.config.rows) {
        return 0;
      }
      return table[i][j] ? 0 : 1;
    };
    return free(i, j + 1) + free(i, j - 1) + free(i + 1, j) + free(i - 1, j);
  };

  Game.prototype.removeDeceased = function () {
    var i, j;
    var groups = [];
    for (var i = 0; i < Go.config.columns; i++) {
      for (var j = 0; j < Go.config.rows; j++) {
        if (this.table[i][j]) {
          var liberties = this.countLiberties(i, j);
          var firstGroup = undefined;
          for (var g = 0; g < groups.length; g++) {
            var group = groups[g];
            if (group.color != this.table[i][j]) {
              continue;
            }
            if (group.isAdjacent(i, j)) {
              group.addCell(i, j, liberties);
              if (firstGroup) {
                firstGroup.addGroup(group);
                groups = groups.splice(g, 1);
                g--;
              } else {
                firstGroup = group;
              }
            }
          }
          if (!firstGroup) {
            groups.push(new Group(i, j, this.table[i][j], liberties));
          }
        }
      }
    }
    for (var gi in groups) {
      var g = groups[gi];
      if (g.liberties == 0) {
        for (var ci in g.cells) {
          var c = g.cells[ci];
          this.table[c[0]][c[1]] = undefined;
        }
      }
    }
  };

  var Group = function (i, j, color, liberties) {
    this.cells = [];
    this.color = color;
    this.liberties = 0;
    this.addCell(i, j, liberties);
  }

  Group.prototype.isAdjacent = function (i, j) {
    for (var c = 0; c < this.cells.length; c++) {
      if (Math.abs(this.cells[c][0] - i) + Math.abs(this.cells[c][1] - j) == 1) {
        return true;
      }
    }
  };

  Group.prototype.addCell = function (i, j, liberties) {
    this.cells.push([i, j]);
    this.liberties += liberties;
  };

  Group.prototype.addGroup = function (g) {
    this.cells.concat(g.cells);
    this.liberties += g.liberties;
  };

  return Game;
})();

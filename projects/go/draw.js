var Go = Go || {};

Go.draw = (function () {

  var c = Go.config;

  var drawLine = function (g, color, x0, y0, x1, y1) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.strokeStyle = color;
    g.stroke();
  };

  var drawPiece = function (g, c, color, x, y) {
    g.beginPath();
    g.arc(x, y, c.piece_size, 0, 2 * Math.PI, false);
    g.fillStyle = color;
    g.fill();
  };

  var drawBorders = function (g) {
    drawLine(g, c.border_color, 0, 0, 0, c.rows * c.grid_size - 1);
    drawLine(g, c.border_color, 0, 0, c.columns * c.grid_size - 1, 0);
    drawLine(g, c.border_color, c.columns * c.grid_size, 0, c.columns * c.grid_size, c.rows * c.grid_size);
    drawLine(g, c.border_color, 0, c.rows * c.grid_size, c.columns * c.grid_size, c.rows * c.grid_size);
  };

  var drawCell = function (g, p, i, j) {
    var x = i * c.grid_size, y = j * c.grid_size;
    var center_x = x + c.grid_size/2, center_y = y + c.grid_size/2;

    drawLine(g, c.line_color, center_x, y, center_x, y + c.grid_size);
    drawLine(g, c.line_color, x, center_y, x + c.grid_size, center_y);

    if (p) {
      var color = p == 1 ? c.pieces_color_1 : c.pieces_color_2;
      drawPiece(g, c, color, center_x, center_y);
    }
  };

  var getClearContext = function (canvas) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    return context;
  };

  return {
    borders : drawBorders,
    cell : drawCell,
    graphics : getClearContext
  };
})();

var Go = Go || {};

Go.util = (function () {

  var matrix = function (columns, rows) {
    return Array.apply(null, Array(columns)).map(function () {
      return Array(rows);
    });
  };

  var to_a = function (pseudo_array) {
    return Array.prototype.slice.call(pseudo_array);
  };

  var fn = function () {
    var original_args = arguments;
    var that = this;
    return function () {
      var args = to_a(original_args).splice(1);
      var original_fn = original_args[0];
      return original_fn.apply(original_fn, args.concat(to_a(arguments)));
    };
  };

  return {
    matrix : matrix,
    fn : fn
  }
}());

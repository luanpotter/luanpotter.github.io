(function() {

    var call = Exp.call,
        literal = Exp.literal,
        identifier = Exp.identifier;

    const DERIVATIVES = {
        '+': function() {
            return literal(1);
        },
        '-': function(args, i) {
            return literal(args.length == i ? -1 : +1);
        },
        '*': function(args, i) {
            var newArgs = args.slice();
            newArgs.splice(i, 1);
            return call('*', newArgs);
        },
        '/': function(args, i) {
            return i == 0 ? call('^', [args[1], literal(-1)]) : call('/', [args[0], call('^', [args[1], literal(2)])]);
        },
        '^': function(args, i) {
            return i == 0 ? call('*', [call('^', [args[0], call('-', [args[1], literal(1)])]), args[1]]) : call('*', [call('^', [args[0], args[1]]), call('ln', args[0])]);
        },
        'sin': function(args, i) {
            return call('cos', args[i]);
        },
        'cos': function(args, i) {
            return call('-', call('sin', args[i]));
        },
        'ln': function(args, i) {
            return call('/', [literal(1), args[i]]);
        },
        'exp': function(args, i) {
            return call('exp', [args[i]]);
        }
    };

    Exp.Expression.prototype.derivative = function(dLiteral) {
        if (this.isLiteral()) {
            return literal(0);
        } else if (this.isIdentifier()) {
            return this.name === dLiteral ? literal(1) : literal(0);
        } else {
            var der = DERIVATIVES[this.fn],
                args = this.args;
            return call('+', args.map(function(arg, i) {
                return call('*', [der(args, i), arg.derivative(dLiteral)]);
            }));
        }
    };

}());

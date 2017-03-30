Decimal.config({ ERRORS: false });

Exp = (function() {
    const DEFAULT_COMPOUND_OPERATOR = '*';

    var flatten = Utils.flatten;

    var literal = function(value) {
        var exp = new Expression();
        exp.type = 'Literal';
        exp.value = new Decimal(value);
        return exp;
    };

    var identifier = function(name) {
        var exp = new Expression();
        exp.type = 'Identifier';
        exp.name = name;
        return exp;
    };

    var call = function(fn, args) {
        args = Array.isArray(args) ? args : [args];

        if (!FNS[fn]) {
            throw 'Unknown function/operator: ' + fn;
        }
        if (FNS[fn].qtds.length > 0 && !FNS[fn].qtds.includes(args.length)) {
            throw 'Wrong amount of args for ' + fn + '; found: ' + args.length;
        }

        var exp = new Expression();
        exp.type = 'Call';
        exp.fn = fn;
        exp.args = args;

        return exp;
    };

    var fn = function(func) {
        func.qtds = [];
        func.one = function() {
            this.qtds.push(1);
            return this;
        }.bind(func);
        func.two = function() {
            this.qtds.push(2);
            return this;
        }.bind(func);
        return func;
    };

    const FNS = {
        '+': fn(function(args) {
            return args.reduce(function(sum, value) {
                return sum.plus(value);
            }, new Decimal(0));
        }),
        '-': fn(function(args) {
            return args.length == 2 ? args[0].minus(args[1]) : args[0].neg();
        }).one().two(),
        '*': fn(function(args) {
            return args.reduce(function(sum, value) {
                return sum.times(value);
            }, new Decimal(1));
        }),
        '/': fn(function(args) {
            return args[0].dividedBy(args[1]);
        }).two(),
        '^': fn(function(args) {
            return args[0].pow(args[1]);
        }).two(),
        'sin': fn(function(args) {
            return Decimal.sin(args[0]);
        }).one(),
        'cos': fn(function(args) {
            return Decimal.cos(args[0]);
        }).one(),
        'ln': fn(function(args) {
            return new Decimal(Math.log(args[0].toNumber()));
        }).one(),
        'exp': fn(function(args) {
            return args[0].exp();
        }).one()
    };

    var Expression = function() {};

    Expression.prototype.isLiteral = function() {
        return this.type === 'Literal';
    };

    Expression.prototype.isIdentifier = function() {
        return this.type === 'Identifier';
    };

    Expression.prototype.isCall = function() {
        return this.type === 'Call';
    };

    Expression.prototype.deps = function() {
        if (this.isIdentifier()) {
            return [this.name];
        } else if (this.isCall()) {
            return flatten(this.args.map(function(args) {
                return args.deps();
            })).uniq();
        } else {
            return [];
        }
    };

    Expression.prototype.getValue = function(vars) {
        if (this.isLiteral()) {
            return this.value;
        } else if (this.isIdentifier()) {
            return new Decimal(vars[this.name]);
        } else {
            var parsedArgs = this.args.map(function(arg) {
                return arg.getValue(vars);
            });
            return FNS[this.fn](parsedArgs);
        }
    };

    Expression.prototype.unit = function(vars) {
        return this._unit(vars)._purgeIdentifiers();
    };

    Expression.prototype._purgeIdentifiers = function(vars) {
        if (this.isLiteral()) {
            return '';
        } else if (this.isIdentifier()) {
            return this.name;
        } else {
            if (!['+', '*'].includes(this.fn)) {
                return this.toPrettyString();
            }
            var args = this.args.map(function(arg) {
                if (arg._purgeIdentifiers) {
                    return arg._purgeIdentifiers(vars);
                }
                return arg;
            }).filter(function(arg) {
                return arg !== '';
            });
            if (args.length === 0) {
                return '';
            }
            if (args.length === 1) {
                return args[0];
            }
            return call(this.fn, args).toPrettyString();
        }
    };

    Expression.prototype._unit = function(vars) {
        if (this.isLiteral()) {
            return identifier('');
        } else if (this.isIdentifier()) {
            return identifier(vars[this.name]);
        } else {
            var parsedArgs = this.args.map(function(arg) {
                return arg._unit(vars);
            }).filter(function(arg) {
                return arg.name !== '';
            });
            if (parsedArgs.length === 0) {
                return identifier('');
            }
            return call(this.fn, parsedArgs).simplify();
        }
    };

    Expression.prototype.toString = function() {
        if (this.isLiteral()) {
            return this.value.toString();
        } else if (this.isIdentifier()) {
            return this.name;
        } else {
            return this.fn + '(' + this.args.map(function(arg) {
                return arg.toString();
            }).join(', ') + ')';
        }
    };

    Expression.prototype.toPrettyString = function() {
        if (this.isLiteral()) {
            return this.value.toString();
        } else if (this.isIdentifier()) {
            return this.name;
        } else {
            if (this.fn.length === 1) { // operator TODO lazy convention
                if (this.args.length === 1) { //unary
                    return this.fn + this.args[0].toPrettyString();
                }
                return this.args.map(function(arg) {
                    return arg.toPrettyString();
                }).join(this.fn);
            } else { // function
                return this.fn + '(' + this.args.map(function(arg) {
                    return arg.toPrettyString();
                }).join(', ') + ')';
            }
        }
    };

    var parse = function(ast) {
        if (ast.type === 'Compound') {
            return call(DEFAULT_COMPOUND_OPERATOR, ast.body.map(parse));
        } else if (ast.type === 'Identifier') {
            return identifier(ast.name);
        } else if (ast.type === 'Literal') {
            if (typeof ast.value !== 'number') {
                throw 'AST Primitives can only be numbers; found ' + ast.value;
            }
            return literal(ast.raw);
        } else if (ast.type === 'CallExpression') {
            if (ast.callee.type !== 'Identifier') {
                throw 'AST CallExpressions must have Identifier as callees; found: ' + ast.callee.type;
            }
            return call(ast.callee.name, ast.arguments.map(parse));
        } else if (ast.type === 'UnaryExpression') {
            return call(ast.operator, [ast.argument].map(parse));
        } else if (ast.type === 'BinaryExpression') {
            return call(ast.operator, [ast.left, ast.right].map(parse));
        } else {
            throw 'Unsupported AST expression type: ' + ast.type;
        }
    };

    //config jsep
    jsep.allowImplicitCompound = true;
    ['!', '~'].forEach(jsep.removeUnaryOp);
    ['||', '&&', '|', '^', '&', '<<', '>>', '>>>'].forEach(jsep.removeBinaryOp);
    ['==', '!=', '===', '!==', '<', '>', '<=', '>='].forEach(jsep.removeBinaryOp);
    jsep.addBinaryOp('^', 11);

    return {
        parse: function(str) {
            return parse(jsep(str));
        },
        literal: literal,
        identifier: identifier,
        call: call,
        Expression: Expression
    };
}());

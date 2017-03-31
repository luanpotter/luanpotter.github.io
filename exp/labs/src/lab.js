Env = (function() {

    var Numbers = (function() {
        return {
            is: function(n) {
                return /^[\+\-]?\d*\.?\d*$/.test(n);
            }
        };
    })();

    var build = Utils.build;
    var remove = Utils.remove;

    const UNITS = build({
        'm': 'Metro',
        's': 'Segundo',
        'g': 'Grama',
        'C': 'Coulomb',
        'K': 'Kelvin',

        'Hz': ['Hertz', '1/s'],
        'N': ['Newton', 'kg m / s^2'],
        'J': ['Joule', 'N m'],
        'Pa': ['Pascal', 'N / m^2'],
        'W': ['Watt', 'J / s'],

        'A': ['Ampère', 'C/s'],
        'V': ['Volt', 'W / A'],
        '\\Omega': ['Ohm', 'V / A'],
        'F': ['Farad', 'C / V'],
        'H': ['Henry', 'Wb / A'],
        'Wb': ['Webber', 'J / A'],
        'T': ['Tesla', 'Wb / m^2']
    }, ['name', 'formula']);

    const MULTIPLIERS = build({
        'H': ['+27', 'Hella'],
        'Y': ['+24', 'Yotta'],
        'Z': ['+21', 'Zetta'],
        'E': ['+18', 'Exa'],
        'P': ['+15', 'Peta'],
        'T': ['+12', 'Tera'],
        'G': ['+9', 'Giga'],
        'M': ['+6', 'Mega'],
        'k': ['+3', 'Kilo'],
        'h': ['+2', 'Hecto'],
        'da': ['+1', 'Deca'],
        '': ['0', ''],
        'd': ['-1', 'Deci'],
        'c': ['-2', 'Centi'],
        'm': ['-3', 'Mili'],
        '\\mu': ['-6', 'Micro'],
        'n': ['-9', 'Nano'],
        'p': ['-12', 'Pico'],
        'f': ['-15', 'Femto'],
        'a': ['-18', 'Atto'],
        'z': ['-21', 'Zepto'],
        'y': ['-24', 'Yocto']
    }, ['multiplier', 'name']);

    var defaultMultiplier = function(unit) {
        return unit.name === 'Grama' ? 'k' : '';
    };

    var validateName = function(name) {
        if (!name.match(/^[_a-zA-Z]+[a-zA-Z0-9_]*$/)) {
            throw 'Invalid variable name (must start with letter or underscore and then also allowing numbers): ' + name;
        }
        if (name.startsWith('delta_')) {
            throw 'Variable names cannot start with "delta_"; those are reserved for the errors: ' + name;
        }
    };

    var validateDeps = function(deps) {
        while (Object.keys(deps).length > 0) {
            var nodeps = Object.keys(deps).find(function(k) {
                return deps[k].length === 0;
            });
            if (!nodeps) {
                throw 'Circular dependency or unknown variable found: ' + JSON.stringify(deps);
            }
            delete deps[nodeps];
            Object.keys(deps).forEach(function(d) {
                remove(deps[d], nodeps);
            });
        }
    };

    var Env = function(vars, consts) {
        this.consts = consts || {};
        this.vars = build(vars, ['name', 'unit', 'formula', 'values'], [undefined, '', undefined, []])
        var deps = {};
        Object.keys(this.consts).forEach(function(constant) {
            validateName(constant);
            if (this.consts[constant].formula) {
                this.consts[constant].formula = Exp.parse(this.consts[constant].formula);
                var deps = this.consts[constant].formula.deps();
                deps.forEach(function (dep) {
                    if (!this.consts[dep]) {
                        throw 'Constant ' + constant + ' depends on unknown constant: ' + dep;
                    }
                }.bind(this));
            }
        }.bind(this));
        Object.keys(this.vars).forEach(function(variable) {
            validateName(variable);
            if (this.consts[variable]) {
                throw 'Invalid variable name, there is already a constant with that name: ' + name;
            }
            if (this.vars[variable].formula) {
                this.vars[variable].formula = Exp.parse(this.vars[variable].formula);
                deps[variable] = this.vars[variable].formula.deps();
                deps[variable] = deps[variable].filter(function (dep) {
                    return !this.consts[dep];
                }.bind(this));
            } else {
                deps[variable] = [];
            }
        }.bind(this));
        validateDeps(deps);
    };

    Env.prototype.addValues = function(variable, list) {
        this.vars[variable].values = this.vars[variable].values.concat(list);
    };

    Env.prototype.add = function(name, list, errorOrMultiplier, error) {
        var variable = this.vars[name];
        if (!variable) {
            throw 'Variable name \'' + name + '\' not found in vars list.';
        }
        if (variable.formula) {
            throw 'Variable name \'' + name + '\' has a formula associated with it, so you cannot add values.';
        }

        var multiplier = errorOrMultiplier;
        if (errorOrMultiplier && Numbers.is(errorOrMultiplier)) {
            error = errorOrMultiplier;
            multiplier = '';
        }
        multiplier = multiplier || defaultMultiplier(variable.unit);
        error = error || 0;

        list = list.map(function(el) {
            if (!Array.isArray(el)) {
                el = [el];
            }

            var value = {
                value: el[0],
                multiplier: el[1],
                error: el[2]
            };
            if (value.multiplier && Numbers.is(value.multiplier)) {
                value.error = value.multiplier;
                value.multiplier = undefined;
            }

            value.multiplier = value.multiplier || multiplier;
            value.error = value.error || error;

            return value;
        });

        this.addValues(name, list);
    };

    Env.findMultipler = function(value) {
        var expoent = value.e;
        if (expoent >= -2 && expoent <= 2) {
            // prioritize no multiplier for nicer looking tables
            return MULTIPLIERS[''];
        }
        return Object.values(MULTIPLIERS).sort(function(v1, v2) {
            return parseInt(v2.multiplier) - parseInt(v1.multiplier);
        }).find(function(v) {
            return v.multiplier <= expoent;
        });
    };

    Env.prototype.parse = function(values) {
        return values.map(function(v) {
            var multiplier = Env.findMultipler(v.error);
            var m = new Decimal(10).pow(multiplier.multiplier);

            var error = v.error.dividedBy(m).toSD(1);
            var value = v.value.dividedBy(m);

            return { value: value.toFixed(error.decimalPlaces()), error: error.toFixed(), multiplier: multiplier.key };
        }.bind(this));
    };

    Env.prototype.get = function(name) {
        var variable = this.vars[name];
        if (!variable) {
            throw 'Variable name \'' + name + '\' not found in vars list.';
        }

        return this.parse(this.fetchValues(variable));
    };

    Env.prototype.table = function(names) {
        var size;
        var table = Utils.transpose(names.map(function(name) {
            var variable = this.vars[name];
            if (!variable) {
                throw 'Variable name \'' + name + '\' not found in vars list.';
            }
            var values = this.fetchValues(variable);
            if (size && values.length !== size) {
                throw 'Incompatible variables, differente sizes!';
            } else {
                size = values.length;
            }

            return this.parse(values);
        }.bind(this)));
        return table;
    };

    Env.prototype.latexTable = function(names) {
        return Latex.latexTable(names, this);
    };

    Env.prototype.error = function(variable) {
        var formula = variable.formula;
        var exp = function(base, pow) {
            return Exp.call('^', [base, Exp.literal(pow)]);
        }
        var partials = formula.deps().map(function(dep) {
            return Exp.call('*', [exp(formula.derivative(dep), 2), exp(Exp.identifier('delta_' + dep), 2)]);
        });
        return exp(Exp.call('+', partials), .5);
    };

    Env.prototype.fetchConstant = function (constant) {
        if (!constant.formula) {
            return constant;
        }
        var deps = constant.formula.deps();
        var mapi = {};
        deps.map(function (dep) {
            var depValue = this.fetchConstant(this.consts[dep]);
            mapi[dep] = depValue.value;
            mapi['delta_' + dep] = depValue.error;
        }.bind(this));
        return {
            value: constant.formula.getValue(mapi),
            error: this.error(constant).getValue(mapi)
        };
    };

    Env.prototype.fetchValues = function(variable) {
        if (!variable.formula) {
            return variable.values.map(function(v) {
                var m = new Decimal(10).pow(MULTIPLIERS[v.multiplier].multiplier);
                return {
                    value: new Decimal(v.value).times(m),
                    error: new Decimal(v.error).times(m)
                };
            });
        }

        var map = {};
        variable.formula.deps().forEach(function(dep) {
            if (this.consts[dep]) {
                map[dep] = this.fetchConstant(this.consts[dep]);
            } else {
                map[dep] = this.fetchValues(this.vars[dep]);
            }
        }.bind(this));

        var sizes = Object.keys(map).filter(function (dep) {
            return Array.isArray(map[dep]);
        }).map(function(dep) {
            return map[dep].length;
        }).sort();

        if (sizes[0] !== sizes[sizes.length - 1]) {
            throw 'Incompatible datasets';
        }

        var i, size = sizes[0];
        var mapis = [];
        for (i = 0; i < size; i++) {
            var mapi = {};
            Object.keys(map).forEach(function(dep) {
                var depOrConst = Array.isArray(map[dep]) ? map[dep][i] : map[dep];
                mapi[dep] = depOrConst.value;
                mapi['delta_' + dep] = depOrConst.error;
            });
            mapis.push(mapi);
        }

        var error = this.error(variable).simplify();

        return mapis.map(function(mapi) {
            return {
                value: variable.formula.getValue(mapi),
                error: error.getValue(mapi)
            };
        });
    };

    Env.prototype.fetchUnit = function(variable) {
        if (true || !variable.formula) {
            return variable.unit;
        }

        var units = {};
        variable.formula.deps().forEach(function(dep) {
            var depV = this.consts[dep] || this.vars[dep];
            units[dep] = this.fetchUnit(depV);
        }.bind(this));

        return variable.formula.unit(units);
    };

    Env.prototype.deps = function(name) {
        var variable = this.vars[name];
        var ast = jsep(variable.formula);
        return Exp.deps(ast);
    };

    Env.prototype.name = function (id) {
        return (this.vars[id] || this.constants[id]).name;
    };

    Env.prototype.desc = function (id) {
        return (this.vars[id] || this.constants[id]).desc || 'no desc';
    };

    Env.prototype.fullLatexTable = function (names, caption, ref) {
        return Latex.fullLatexTable(names, caption, ref, this);
    };

    return Env;
})();

Dimensions = (function() {
    var Dimensions = {};

    const build = Utils.build;

    const UNITS = build({
        'm': ['Metro'],
        's': ['Segundo'],
        'g': ['Grama'],
        'C': ['Coulomb'],
        'K': ['Kelvin'],

        'Hz': ['Hertz', '1/s'],
        'N': ['Newton', 'g m / s^2', 'k'],
        'J': ['Joule', 'N m'],
        'Pa': ['Pascal', 'N / m^2'],
        'W': ['Watt', 'J / s'],
        'A': ['Ampère', 'C / s'],
        'V': ['Volt', 'W / A'],
        '\\Omega': ['Ohm', 'V / A'],
        'F': ['Farad', 'C / V'],
        'Wb': ['Webber', 'J / A'],
        'H': ['Henry', 'Wb / A'],
        'T': ['Tesla', 'Wb / m^2']
    }, ['name', 'formula', 'multiplier'], ['', undefined, '']);

    let parse = function (formula) {
        if (formula.isCall()) {
            if (formula.fn === '^') {
                let exp = parse(formula.args[1]);
                if (!exp.isLiteral()) {
                    throw 'Can\'t have unitless exponent, found ' + exp.toPrettyString();
                }
                formula.args[0] = parse(formula.args[0]);
                if (formula.args[0].fn === '*') {
                    let args = formula.args[0].args.map(function (arg) {
                        return Exp.call('^', [arg, exp])
                    });
                    return Exp.call('*', args).simplify();
                }
                return formula.simplify();
            }
            if (formula.fn === '*') {
                formula.args = formula.args.map(function (arg) {
                    return parse(arg);
                });
                return formula.simplify();
            }
            if (formula.fn === '/') {
                return parse(Exp.call('*', [formula.args[0], Exp.call('^', [formula.args[1], Exp.literal(-1)])]));
            }
            if (['+', '-'].includes(formula.fn)) {
                // all the same
                let unit;
                formula.args.forEach(function (arg) {
                    let newUnit = parse(arg);
                    if (newUnit.isLiteral()) {
                        newUnit = '';
                    } else {
                        sort(newUnit);
                    }
                    if (unit && newUnit.toPrettyString() !== unit.toPrettyString()) {
                        throw 'Invalid formula, can\'t sum these units : ' + unit + ' and ' + newUnit;
                    }
                    unit = newUnit;
                });
                if (unit === '') {
                    return formula.simplify(); // sum of numbers, mate
                }
                return unit;
            }
            throw 'Invalid operation in unit : ' + formula.fn;
        } else if (formula.isLiteral()) {
            return formula;
        } else if (formula.isIdentifier()) {
            let key = formula.name;
            if (UNITS[key].formula) {
                return UNITS[key].formula;
            }
            return formula;
        }
    }

    let parseAndSort = function (formula) {
        let exp = parse(Exp.parse(formula));
        sort(exp);
        return exp;
    };

    let sort = function(exp) {
        if (exp.isCall() && exp.fn === '*') {
            const name = function (e) {
                return e.isIdentifier() ? e.name : e.args[0].name;
            };
            exp.args = exp.args.sort(function (a1, a2) {
                return name(a1).localeCompare(name(a2));
            });
        }
    };

    Object.keys(UNITS).forEach(function (key) {
        if (UNITS[key].formula) {
            UNITS[key].formula = parseAndSort(UNITS[key].formula);
        }
    });

    Dimensions.simplify = function (formula) {
        let expf = parseAndSort(formula);
        if (expf.isLiteral()) {
            return '';
        }
        let exp = expf.toPrettyString();
        Object.keys(UNITS).forEach(function (key) {
            let unit = UNITS[key].formula ? UNITS[key].formula.toPrettyString() : key;
            if (unit === exp) {
                exp = key;
            }
        });
        return exp;
    };

    return Dimensions;
})();

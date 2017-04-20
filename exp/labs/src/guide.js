Guide = function () {
    const CONST_CYCLE = [
        'Select an option: ',
        ' (*) Call withValue to add a constant with a value',
        ' (*) Call withFormula to add a constant dependent on other constants',
        ' (*) Call next to proceed to the variables'
    ];
    const VAR_CYCLE = [
        'Select an option: ',
        ' (*) Call withValue to add a variable that your are going to measrure directly (you\'ll add the values later)',
        ' (*) Call withFormula to add a derived variable',
        ' (*) Call next to proceed to measurements'
    ];

    this._on = false;
    this.start = function() {
        this._on = true;
        this._b = new EnvBuilder();
        this._state = 1;
        this._acquisition = [];
        return [
            'Hello! Welcome to this guide!',
            'First lets add all the constants.',
            'Normal math constants, like PI and E are already there'
        ].concat(CONST_CYCLE);
    };
    this.on = function () {
        return this._on;
    };
    this.next = function (cmd) {
        if (this._acquisition.length > 0) {
            var nextVar = this._acquisition.shift();
            this._results[nextVar.substring(1)] = cmd;
            return this._acquisition.shift();
        }
        if (this._state === 1) {
            if (this._results) {
                this._b.constObj(this._results);
                this._results = null;
            }
            if (cmd === 'withValue') {
                this._results = {}
                this._acquisition = [
                    'What\'s the id of your constant?', ':name',
                    'What\'s the name of your constant (use LaTeX!)?', ':latexName',
                    'What\'s the description of your constant?', ':description',
                    'What\'s the unit of your constant?', ':unit',
                    'What\'s the value of your constant?', ':value',
                    'What\'s the error of your constant?', ':error',
                    CONST_CYCLE
                ];
                return this._acquisition.shift();
            } else if (cmd === 'withFormula') {
                this._results = {}
                this._acquisition = [
                    'What\'s the id of your constant?', ':name',
                    'What\'s the name of your constant (use LaTeX!)?', ':latexName',
                    'What\'s the description of your constant?', ':description',
                    'What\'s the formula of your constant?', ':formula',
                    'What\'s the unit of your constant [ WIP dimensional analysis ]?', ':unit',
                    CONST_CYCLE
                ];
                return this._acquisition.shift();
            } else if (cmd === 'next') {
                this._state = 2;
                return ['Nice! Now let\'s add some variables.'].concat(VAR_CYCLE);
            } else {
                return 'Unknown command, my friend. Type :q at any time to quit interactive mode.'
            }
        } else if (this._state === 2) {
            if (this._results) {
                this._b.variableObj(this._results);
                this._results = null;
            }
            if (cmd === 'withValue') {
                this._results = {}
                this._acquisition = [
                    'What\'s the id of your variable?', ':name',
                    'What\'s the name of your variable (use LaTeX!)?', ':latexName',
                    'What\'s the description of your variable?', ':description',
                    'What\'s the unit of your variable?', ':unit',
                    VAR_CYCLE
                ];
                return this._acquisition.shift();
            } else if (cmd === 'withFormula') {
                this._results = {}
                this._acquisition = [
                    'What\'s the id of your variable?', ':name',
                    'What\'s the name of your variable (use LaTeX!)?', ':latexName',
                    'What\'s the description of your variable?', ':description',
                    'What\'s the formula of your variable?', ':formula',
                    'What\'s the unit of your variable [ WIP dimensional analysis ]?', ':unit',
                    VAR_CYCLE
                ];
                return this._acquisition.shift();
            } else if (cmd === 'next') {
                try {
                    this._e = this._b.build();
                } catch (e) {
                    return 'Error when building env: ' + e;
                }
                this._state = 3;
                this._results = {};
                console.log(this._e);
                console.log(this._e.vars);
                console.log(this._e.vars.filter);
                this._acquisition = Utils.flatten(this._valuesToAdd = Object.values(this._e.vars).filter(function (v) {
                    return !v.formula;
                }).map(function (v) {
                    return [ 'Add the values for variable ' + v.name, v.name];
                })).concat([ 'All done!' ]);
                return ['Nice! Now let\'s proceed to measurments.'].concat(this._acquisition.shift());
            } else {
                return 'Unknown command, my friend. Type :q at any time to quit interactive mode.'
            }
        } else if (this._state === 3) {
            const parse = function (str) {
                return 'TODO!!';
            };
            Object.keys(this._result).forEach(function (key) {
                var values = parse(this._result[key]);
                this._e.add(key, values);
            });
            this._result = {};
            return 'Congratulations! Now you can create the tables.';
        }
    };
};

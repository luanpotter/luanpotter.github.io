const ModalConfig = {
    _tr([ key, cte ]) {
        const bits = cte.title.split('(');
        const formatted = bits[0] + '<br />(' + bits[1];
        return `<tr>
            <td>${formatted}</td>
            <td><input data-key="${key}" data-kind="min" type="text"></td>
            <td><input data-key="${key}" data-kind="max" type="text"></td>
            <td><input data-key="${key}" data-kind="default" type="text"></td>
            <td><input data-key="${key}" data-kind="current" type="text"></td>
        </tr>`;
    },

    $(selector) {
        return document.querySelector(selector);
    },

    toggle() {
        this.paramsReset();
        this.$('#modal-config').classList.toggle('show');
        if (this.$('#modal-config').classList.contains('show')) {
            this.$('#modal-stats').classList.remove('show');
        }
    },

    setup(game) {
        const { reset } = this._paramsSetup(game);
        this.paramsReset = reset;

        this._betaGammaSetup(game);

        this.$('#modal-config-close').addEventListener('click', () => this.toggle());
    },

    _paramsSetup(game) {
        const table = this.$('#modal-config table.params tbody');
        const html = Object.entries(game.constants).map(this._tr).join('');
        table.innerHTML = html;

        const input = (key, kind) => this.$(`#modal-config table.params [data-key=${key}][data-kind=${kind}]`);
        const v = x => x === '' ? null : parseFloat(x);
        const kinds = [ 'min', 'max', 'default', 'current' ];
        const forEachInput = fn => {
            Object.entries(game.constants).forEach(([ key, cte ]) => {
                kinds.forEach(kind => {
                    fn(input(key, kind), cte, kind);
                });
            });
        };

        const reset = () => forEachInput((input, cte, kind) => input.value = cte[kind]);

        this.$('#modal-config-params-reset').addEventListener('click', reset);
        reset();

        this.$('#modal-config-params-save').addEventListener('click', () => {
            forEachInput((input, cte, kind) => cte[kind] = v(input.value));
            game.resetMenu();
        });

        return { reset };
    },

    _betaGammaUpdate(variables) {
        Object.entries(variables).forEach(([ key, variable ]) => {
            const tr = this.$(`#modal-config table.betagamma tr[data-variable=${key}]`);
            const lock = tr.querySelector('.lock');
            const inputRW = tr.querySelector('[data-kind=rw]');
            const inputS = tr.querySelector('[data-kind=s]');
            if (variable.lock) {
                lock.classList.remove('open');
                lock.classList.add('closed');
            } else {
                lock.classList.remove('closed');
                lock.classList.add('open');
            }
            const doLock = input => {
                const isFree = input.classList.contains('free');
                input.disabled = !isFree && variable.lock;
            }
            doLock(inputRW);
            inputRW.value = variable.rw.toExponential(5);
            doLock(inputS);
            inputS.value = variable.s.toExponential(5);
        });
    },

    _betaGammaSetup(game) {
        const DEFAULT_VARIABLES = {
            beta: {
                rw: parseFloat('1.9e-10'),
                s: parseFloat('216'),
                lock: false,
            },
            gamma: {
                rw: parseFloat('1'),
                s: null,
                lock: true,
            },
            vzero: {
                rw: parseFloat('2e7'),
                s: parseFloat('51.2'),
                lock: false,
            },
            xi: {
                rw: parseFloat('5.49'),
                s: null,
                lock: true,
            },
        };

        const table = this.$('#modal-config table.betagamma');
        table.querySelectorAll('input').forEach(input => input.addEventListener('blur', () => {
            const kind = input.getAttribute('data-kind');
            const variable = input.closest('tr').getAttribute('data-variable');
            game._variables[variable][kind] = parseFloat(input.value);
            this._betaGammaUpdate(game._variables);
        }));
        table.querySelectorAll('.lock').forEach(lock => lock.addEventListener('click', () => {
            const name = lock.closest('tr').getAttribute('data-variable');
            const variable = game._variables[name];
            variable.lock = !variable.lock;
            this._betaGammaUpdate(game._variables);
        }));

        const engine = new Engine([
            'vzero = beta * gamma^-1',
            'xi = beta^3 * gamma^-2',
        ]);
        const recalc = () => this._betaGammaRecalculate(engine, game._variables);
        this.$('#modal-config-betagamma-recalc').addEventListener('click', recalc);

        const reset = () => {
            game._variables = deepClone(DEFAULT_VARIABLES);
            recalc();
        };
        this.$('#modal-config-betagamma-reset').addEventListener('click', () => confirm('Are you sure you want to reset?') && reset());
        reset();
    },

    _betaGammaRecalculate(engine, vars) {
        const makeVar = name => ({ name, value: vars[name].s/vars[name].rw });
        const makeVars = list => Object.fromEntries(list.map(v => [v, makeVar(v)]));
        const install = (result, v) => vars[v].s = vars[v].rw * result[v].value;
        const installAll = (result, vars) => vars.forEach(v => install(result, v));

        const locked = Object.keys(vars).filter(n => vars[n].lock);
        const free = Object.keys(vars).filter(n => !vars[n].lock);
        if (locked.length !== 2 || free.length !== 2) {
            console.info({ locked, free });
            alert('Error! Exactly two must be locked at all times!');
            return;
        }

        const result = engine.calc(makeVars(free));
        installAll(result, locked);
        this._betaGammaUpdate(vars);
    },
};
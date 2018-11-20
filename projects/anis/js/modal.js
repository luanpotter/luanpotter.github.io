const Modal = {
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
        this.$('#modal').classList.toggle('show');
    },

    setup(game) {
        const table = this.$('#modal table tbody');
        const html = Object.entries(game.constants).map(this._tr).join('');
        table.innerHTML = html;

        Object.entries(game.constants).forEach(([ key, cte ]) => {
            this.$(`#modal [data-key=${key}][data-kind=min]`).value = cte.min;
            this.$(`#modal [data-key=${key}][data-kind=max]`).value = cte.max;
            this.$(`#modal [data-key=${key}][data-kind=default]`).value = cte.default;
            this.$(`#modal [data-key=${key}][data-kind=current]`).value = cte.current;
        });

        this.$('#modal-cancel').addEventListener('click', () => this.toggle());
        this.$('#modal-save').addEventListener('click', () => {
            Object.entries(game.constants).forEach(([ key, cte ]) => {
                const v = x => x === '' ? null : parseFloat(x);
                cte.min = v(this.$(`#modal [data-key=${key}][data-kind=min]`).value);
                cte.max = v(this.$(`#modal [data-key=${key}][data-kind=max]`).value);
                cte.default = v(this.$(`#modal [data-key=${key}][data-kind=default]`).value);
                cte.current = v(this.$(`#modal [data-key=${key}][data-kind=current]`).value);
            });
            game.resetMenu();
            this.toggle();
        });

        this._betaGammaSetup(game);
    },

    _betaGammaUpdate(variables) {
        Object.entries(variables).forEach(([ key, variable ]) => {
            const tr = this.$(`#modal tr[data-variable=${key}]`);
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
            inputRW.disabled = variable.lock;
            inputRW.value = variable.rw.toExponential();
            inputS.disabled = variable.lock;
            inputS.value = variable.s.toExponential();
        });
    },

    _betaGammaSetup(game) {
        game._variables = {
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

        const table = this.$('#modal .beta-gamma');
        table.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
            this._betaGammaRecalculate(game._variables);
        }));
        table.querySelectorAll('.lock').forEach(lock => lock.addEventListener('click', () => {
            alert('Feature not available yet!');
            return;
            const name = lock.closest('tr').getAttribute('data-variable');
            const variable = game._variables[name];
            variable.lock = !variable.lock;
            this._betaGammaUpdate(game._variables);
        }));

        this._betaGammaRecalculate(game._variables);
    },

    _betaGammaRecalculate(vars) {
        this._calcGamma(vars);
        this._calcXi(vars);
        this._betaGammaUpdate(vars);
    },

    _RWtoS(v) {
        return v.s / v.rw;
    },

    _StoRW(v) {
        return v.rw / v.s;
    },

    _calcXi(vars) {
        const beta = this._RWtoS(vars.beta) ** 3;
        const gamma = this._StoRW(vars.gamma) ** 2;
        vars.xi.s = vars.xi.rw * beta * gamma;
    },

    _calcGamma(vars) {
        vars.gamma.s = this._StoRW(vars.vzero) * this._RWtoS(vars.beta) / vars.gamma.rw;
    },
};
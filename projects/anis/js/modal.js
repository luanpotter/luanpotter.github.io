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
    },
};
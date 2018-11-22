const ModalStats = {
    setup(game) {
        this.game = game;
        const chart = this.$('#modal-stats-chart');
        const close = this.$('#modal-stats-close');

        this.reset = () => {
            chart.innerHTML = game.stats.thetas;
        };

        close.addEventListener('click', () => this.toggle());
    },

    $(selector) {
        return document.querySelector(selector);
    },

    toggle() {
        this.reset();
        this.$('#modal-stats').classList.toggle('show');
        if (this.$('#modal-stats').classList.contains('show')) {
            this.$('#modal-config').classList.remove('show');
        }
    }
};
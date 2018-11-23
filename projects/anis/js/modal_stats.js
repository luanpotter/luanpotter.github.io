const ModalStats = {
    setup(game) {
        this.game = game;
        const chart = this.$('#modal-stats-chart');
        const close = this.$('#modal-stats-close');

        this.reset = () => {
            const { thetas } = game.stats;
            if (thetas.length === 0) {
                chart.innerHTML = '<p>No data available yet.</p>';
            } else {
                const BINS = 10;

                const size = { w: 600, h: 400 };
                const margin = {top: 10, right: 30, bottom: 30, left: 40};
                const width = size.w - margin.left - margin.right;
                const height = size.h - margin.top - margin.bottom;

                const bins = np.linspace(0, 90, BINS);
                const values = bins.map((bin, i) => {
                    const prev = i === 0 ? bins[0] - 1 : bins[i - 1];
                    const next = i === bins.length - 1 ? bins[i - 1] + 1 : bins[i];
                    const y = thetas.map(toDegrees).filter(t => prev < t && t <= next).length;
                    return { x: bin, y };
                });
                const maxy = values.reduce((a, b) => a > b.y ? a : b.y);

                const x = d3.scaleBand().rangeRound([0, width]).domain(bins).padding(0.2);
                const y = d3.scaleLinear().range([height, 0]).domain([0, maxy]);

                chart.innerHTML = `<svg width="${size.w}" height="${size.h}"></svg>`;

                const svg = d3.select('svg');
                const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

                g.append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                g.append('g')
                    .attr('class', 'axis axis-y')
                    .call(d3.axisLeft(y).ticks(10));

                g.selectAll('.bar')
                    .data(values)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d.x))
                    .attr('y', d => y(d.y))
                    .attr('width', x.bandwidth())
                    .attr('height', d => height - y(d.y));
            }
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
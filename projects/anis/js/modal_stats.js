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

                const divisions = np.linspace(0, 90, BINS);
                const bins = divisions.slice(1).map((v, i) => [divisions[i], v]);
                const values = bins.map(bin => {
                    const y = thetas.map(toDegrees).map(Math.abs).filter(t => bin[0] < t && t <= bin[1]).length;
                    return { x: bin, y };
                });
                const maxy = values.reduce((a, b) => a > b.y ? a : b.y);
                const miny = values.filter(b => b.y !== 0).reduce((a, b) => a < b.y ? a : b.y);

                const x = d3.scaleBand().rangeRound([0, width]).domain(bins).padding(0.2);
                const y = d3.scaleLog().base(10).range([height, 0]).domain([miny, maxy]);

                chart.innerHTML = `<svg width="${size.w}" height="${size.h}"></svg>`;

                const svg = d3.select('svg');
                const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

                g.append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x).tickFormat(d => `${d[0]} - ${d[1]} °`));

                g.append('g')
                    .attr('class', 'axis axis-y')
                    .call(d3
                        .axisLeft(y)
                        .ticks(10)
                        // .tickFormat(d => parseFloat(d).toPrecision(2))
                    );

                g.selectAll('.bar')
                    .data(values)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d.x))
                    .attr('y', d => d.y === 0 ? 0 : y(d.y))
                    .attr('width', x.bandwidth())
                    .attr('height', d => d.y === 0 ? 0 : height - y(d.y));
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
const Point = class {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(p, q) {
		return new Point(this.x + p.x, this.y + p.y);
	}

	times(m) {
		return new Point(this.x * m, this.y * m);
	}

	squared() {
		return this.x * this.x + this.y * this.y;
	}

	mod() {
		return Math.sqrt(this.squared());
	}
};
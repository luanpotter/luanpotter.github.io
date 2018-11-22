const Particle = class {
  constructor(game, b, vzero) {
    this.game = game;
    this.p = new Point(-game.width/2, b);
    this.speed = new Point(vzero, 0);
    this.b = b;

    this.pixi = this._genPixi();
    this.pixi.x = this.p.x;
    this.pixi.y = this.p.y;
  }

  update(dt) {
    const xi = getValueOrGenerate(this.game.constants.xi);

    // const modAcc = xi / this.p.squared();
    // const acc = this.p.times(modAcc / this.p.mod());
    // this.p = this.p.add(this.speed.times(dt)).add(acc.times((dt * dt) / 2));
    // this.speed = this.speed.add(acc.times(dt));

    // I changed for performance, above is the prettier code for reference (it works still)

    const speedIncMod = dt * xi / this.p.squared()  / this.p.mod();
    const speedIncX = this.p.x * speedIncMod;
    const speedIncY = this.p.y * speedIncMod;

    this.p.x += this.speed.x * dt + speedIncX * dt / 2;
    this.p.y += this.speed.y * dt + speedIncY * dt / 2;

    const _asd = this.speed.x;
    this.speed.x += speedIncX;
    this.speed.y += speedIncY;

    this.pixi.x = this.p.x;
    this.pixi.y = this.p.y;
  }

  tween(dt) {
    this.pixi.x = this.p.x + dt * this.speed.x;
    this.pixi.y = this.p.y + dt * this.speed.y;
  }

  toPixi() {
    return this.pixi;
  }

  _genPixi() {
    const g = new PIXI.Graphics();
    g.lineStyle(2, 0xfff4e6);
    g.drawCircle(
      this.game.width / 2,
      this.game.height / 2,
      1
    );
    return g;
  }

  destroy(stage) {
    const shouldDestroy =
      this.p.x < -(this.game.width / 2) ||
      this.p.y < -(this.game.height / 2) ||
      this.p.x > this.game.width / 2 - SM ||
      this.p.y > this.game.height / 2 - SM;

    if (shouldDestroy) {
      this.runStats();
      stage.removeChild(this.pixi);
    }

    return shouldDestroy;
  }

  runStats() {
    this.game.stats.total += 1;
    this.game.stats.hits += this.isHit() ? 1 : 0;
    this.game.stats.prob = this.game.stats.hits / this.game.stats.total;
  }

  isHit() {
    if (this.p.x <= SIZE / 2 - MARGIN) {
      return true;
    }

    const yf = this.p.y;
    const dy = yf - this.b;
    const ttheta = dy / SIZE;
    const theta = Math.atan(ttheta);
    this.game.stats.thetas.push(theta);

    const thetaMax = getValueOrGenerate(this.game.constants.theta);
    return Math.abs(theta) > thetaMax;
  }
};

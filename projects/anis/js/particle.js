const Particle = class {
    constructor(game, p, speed) {
      this.game = game;
      this.p = p;
      this.speed = speed;
    }

    update(dt) {
      const modAcc = this.game.constants.alpha / this.p.squared();
      const acc = this.p.times(modAcc / this.p.mod());

      this.p = this.p.add(this.speed.times(dt)).add(acc.times(dt*dt / 2))
      this.speed = this.speed.add(acc.times(dt));
    }

    render(canvas) {
      canvas.lineStyle(2, 0xFFF4E6);
      canvas.drawCircle(this.game.width / 2 + this.p.x, this.game.height /2 + this.p.y, 1);
    }

    destroy() {
      return (this.p.x < -(this.game.width/2))
       || (this.p.y < -(this.game.height/2))
       || (this.p.x > this.game.width/2)
       || (this.p.y > this.game.height/2);
    }
  };
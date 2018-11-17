const FormComponents = (() => {
  const Component = class {
    build(stage, x, y) {
      this.c.x = x;
      this.c.y = y;
      stage.addChild(this.c);
    }

    width() {
      return this.c.width;
    }

    height() {
      return this.c.height;
    }

    ref(cb) {
      cb(this.c);
      return this;
    }

    setVisible(visible) {
      this.c.visible = visible;
    }
  };

  const Label = class extends Component {
    constructor(text, style = STYLES.regular) {
      super();
      this.c = new PIXI.Text(text, style);
    }
  };

  const Button = class extends Component {
    constructor(sheet, name, click) {
			super();
      this.c = new PIXI.Sprite(sheet.textures[`${name}.png`]);
      if (click) {
        this.c.on("pointerdown", click);
        this.c.interactive = true;
        this.c.buttonMode = true;
      }
    }
  };

  const Row = class extends Component {
    constructor(elements, m = SM, em = 0) {
			super();
      this.elements = elements;
      this.m = m;
      this.em = em;
      this._width =
        2 * this.em +
        (this, elements.length - 1) * this.m +
        this.elements.reduce((total, el) => total + el.width(), 0);
      this._height =
				2 * this.em + this.elements.map(el => el.height()).reduce((a, b) => Math.max(a, b), 0);
    }

    width() {
      return this._width;
    }

    height() {
      return this._height;
    }

    build(stage, x, y) {
      let cX = x + this.em;
      this.elements.forEach(el => {
				el.build(stage, cX, y);
				cX += el.width() + this.m;
      });
    }

    setVisible(visible) {
      this.elements.forEach(el => el.setVisible(visible));
    }
  };

  const Column = class extends Component {
    constructor(elements, m = SM, em = 0) {
			super();
      this.elements = elements;
      this.m = m;
      this.em = em;
      this._width =
        2 * this.em + this.elements.map(el => el.width()).reduce((a, b) => Math.max(a, b), 0);
      this._height =
        2 * this.em +
        -this.m +
				this.elements.reduce((total, el) => total + el.height() + this.m, 0);
    }

    width() {
      return this._width;
    }

    height() {
      return this._height;
    }

    build(stage, x, y) {
      let cY = y + this.em;
      this.elements.forEach(el => {
				el.build(stage, x, cY);
        cY += el.height() + this.m;
      });
    }

    setVisible(visible) {
      this.elements.forEach(el => el.setVisible(visible));
    }
  };

  const SliderInput = class extends Component {
    constructor(sheet, value) {
			super();
      this.value = value;
      this.label = new PIXI.Text(this.value.get(), STYLES.small);
      this.slider = new PIXI.Graphics();
      this.sprite = new PIXI.Sprite(sheet.textures[`slider.png`]);
    }

    width() {
      return SIZE;
    }

    height() {
      return this.label.height;
    }

    build(stage, x, y) {
      const label = this.label;
      label.x = x;
      label.y = y;
      const labelWidth = 20;
      stage.addChild(label);

      const slider = this.slider;
      slider.x = label.x + SM + labelWidth;
      slider.y = label.y;
      const sliderWidth = FULL_SIZE - slider.x - SM;
      const sliderHeight = label.height;
      stage.addChild(slider);

      slider.lineStyle(2, 0xbe9b7b);
      slider.drawCircle(1, (sliderHeight - 1) / 2, 1);
      slider.drawCircle(sliderWidth - 1, (sliderHeight - 1) / 2, 1);

      slider.moveTo(1, (sliderHeight - 1) / 2);
      slider.lineTo(sliderWidth - 1, (sliderHeight - 1) / 2);

      const sprite = this.sprite;
      const minX = slider.x + 4;
      const maxX = minX + sliderWidth - 1 - 8 - 16;
      sprite.x = minX;
      sprite.y = slider.y - 4;
      stage.addChild(sprite);

      this.createDragAndDropFor(sprite, (position, delta) => {
        let nx = position.x + delta.x;
        if (nx < minX) {
          nx = minX;
        } else if (nx > maxX) {
          nx = maxX;
        }
        position.x = nx;
        const frac = (nx - minX) / (maxX - minX);
        const v = this.value.min + frac * (this.value.max - this.value.min);
        this.value.set(Math.round(v));
        label.text = this.value.get();
      });

      const frac =
        (this.value.get() - this.value.min) / (this.value.max - this.value.min);
      sprite.position.x = minX + (maxX - minX) * frac;
    }

    createDragAndDropFor(target, handler) {
      let drag = false;
      target.interactive = true;
      target.buttonMode = true;
      target.on("mousedown", () => (drag = target));
      target.on("mouseup", () => (drag = false));
      target.on("mouseupoutside", () => (drag = false));
      target.on("mousemove", e => {
        if (drag) {
          handler(drag.position, {
            x: e.data.originalEvent.movementX,
            y: e.data.originalEvent.movementY
          });
        }
      });
    }

    setVisible(visible) {
      this.label.visible = visible;
      this.slider.visible = visible;
      this.sprite.visible = visible;
    }
  };

  const Switch = class extends Component {
    constructor({ on, off, v = true }) {
      super();
      this.on = on;
      this.off = off;
      this.v = v;
    }

    build(stage, x, y) {
      this.update();
      this.on.build(stage, x, y);
      this.off.build(stage, x, y);
    }

    set(v) {
      this.v = v;
      this.update();
    }

    update() {
      console.log(this.v);
      this.on.setVisible(this.v);
      this.off.setVisible(!this.v);
    }

    width() {
      return Math.max(this.on.width(), this.off.width());
    }

    height() {
      return Math.max(this.on.height(), this.off.height());
    }

    ref(cb) {
      cb({
        on: this.on,
        off: this.off,
        set: v => this.set(v),
        get: () => this.v,
      });
      return this;
    }

    setVisible(v) {
      if (v) {
        this.update();
      } else {
        this.on.setVisible(false);
        this.off.setVisible(false);
      }
    }
  }

  return { Component, Column, Row, Label, Button, SliderInput, Switch };
})();
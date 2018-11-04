const UI = (app, game) => {
    const sheet = PIXI.loader.resources.sprites.spritesheet;

    const options = new PIXI.Text('Options', STYLES.title);
    options.x = SIZE + 2*MARGIN;
    options.y = MARGIN;
    app.stage.addChild(options);

    const time = new PIXI.Text('Time', STYLES.regular);
    time.x = SIZE + 2*MARGIN;
    time.y = MARGIN + options.height + SM;
    app.stage.addChild(time);

    const p = new Point(SIZE + 2*MARGIN, time.y + SM + time.height);
    const d = new Point(16.0 + SM, 0);
    new Button(sheet, p.add(d.times(0)), 'stop', () => game.speed = 0).add(app);
    new Button(sheet, p.add(d.times(1)), 'play', () => game.speed = 1).add(app);
    new Button(sheet, p.add(d.times(2)), 'fast', () => game.speed = 10).add(app);

    const flow = new PIXI.Text('Flow', STYLES.regular);
    flow.x = SIZE + 2*MARGIN;
    flow.y = p.y + SM + 16.0;
    app.stage.addChild(flow);

    const p2 = new Point(SIZE + 2*MARGIN, flow.y + SM + flow.height);
    new Button(sheet, p2.add(d.times(0)), 'pause', () => game.repeat = false).add(app);
    new Button(sheet, p2.add(d.times(1)), 'single', () => game.create()).add(app);
    new Button(sheet, p2.add(d.times(2)), 'repeat', () => game.repeat = true).add(app);

    const config = new PIXI.Text('Config', STYLES.regular);
    config.x = SIZE + 2*MARGIN;
    config.y = p2.y + SM + 16.0;
    app.stage.addChild(config);

    const flowControl = new PIXI.Text('Flow (particles/second)', STYLES.small);
    flowControl.x = SIZE + 2*MARGIN;
    flowControl.y = config.y + SM + config.height;
    app.stage.addChild(flowControl);

    const flowControlInputPoint = new Point(flowControl.x, flowControl.y + SM + flowControl.height);
    const flowControlInput = new Input(sheet, flowControlInputPoint, {
        get() {
            return game.constants.flow;
        },

        set(frac) {
            game.constants.flow = Math.round(1 + frac * 99);
        },
    });
    flowControlInput.append(app.stage);
};

const Input = class {
    constructor(sheet, p, value) {
        this.sheet = sheet;
        this.p = p;
        this.value = value;
    }

    append(stage) {
        const label = new PIXI.Text(this.value.get(), STYLES.small);
        label.x = this.p.x;
        label.y = this.p.y;
        const labelWidth = 20;
        stage.addChild(label);

        const slider = new PIXI.Graphics();
        slider.x = label.x + SM + labelWidth;
        slider.y = label.y;
        const sliderWidth = FULL_SIZE - slider.x - SM;
        const sliderHeight = label.height;
        stage.addChild(slider);

        slider.lineStyle(2, 0xBE9B7B);
        slider.drawCircle(1, (sliderHeight - 1) / 2, 1);
        slider.drawCircle(sliderWidth - 1, (sliderHeight - 1) / 2, 1);

        slider.moveTo(1, (sliderHeight - 1) / 2);
        slider.lineTo(sliderWidth - 1, (sliderHeight - 1) / 2);

        const sprite = new PIXI.Sprite(this.sheet.textures[`slider.png`]);
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
            this.value.set(frac);
            label.text = this.value.get();
        });
    }

    createDragAndDropFor(target, handler) {
        let drag = false;
        target.interactive = true;
        target.buttonMode = true;
        target.on('mousedown', () => drag = target);
        target.on('mouseup', () => drag = false);
        target.on('mouseupoutside', () => drag = false);
        target.on('mousemove', e => {
          if (drag) {
            handler(drag.position, {
                x: e.data.originalEvent.movementX,
                y: e.data.originalEvent.movementY,
            });
          }
        });
      }
};
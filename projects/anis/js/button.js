const Button = class {
    constructor(sheet, p, name, click) {
        this.button = new PIXI.Sprite(sheet.textures[`${name}.png`]);
        this.button.x = p.x;
        this.button.y = p.y;
        this.button.on('pointerdown', click);
        this.button.interactive = true;
        this.button.buttonMode = true;
    }

    add(app) {
        app.stage.addChild(this.button);
    }
};
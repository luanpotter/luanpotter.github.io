const Background = class {
    toPixi(game) {
        const canvas = new PIXI.Graphics();

        canvas.beginFill(0x000000);
        canvas.lineStyle(2, 0x000000);
        canvas.drawRect(0, 0, game.fullWidth, game.height);
        canvas.endFill();

        canvas.beginFill(0x3C2F2F);
        canvas.lineStyle(2, 0xBE9B7B);
        canvas.drawRect(0, 0, game.width, game.height);
        canvas.drawRect(game.width + MARGIN, 0, game.width, game.height);
        canvas.endFill();

        canvas.lineStyle(2, 0xBE9B7B);
        canvas.drawCircle(game.width / 2, game.height / 2, 1);

        return canvas;
    }
};
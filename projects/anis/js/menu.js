const Menu = {
    createInput(game, sheet, name) {
        const { Column, Row, Label, Button, SliderInput, Switch } = FormComponents;
        return new Column([
            new Row([
                new Label(game.constants[name].title, STYLES.small),
                new Button(sheet, 'dice', () => {
                    if (game.constants[name].current !== null) {
                        game.constants[name].current = null;
                        game.labels[name].set(false);
                    } else {
                        game.constants[name].current = game.constants[name].default;
                        game.labels[name].set(true);
                    }
                }),
            ]),
            new Switch({
                on: new SliderInput(sheet, {
                    min: game.constants[name].min,
                    max: game.constants[name].max,
                    get: () => game.constants[name].current || 0,
                    set: v => (game.constants[name].current = v) && game.stats.reset(),
                }),
                off: new Label('Will be generated randomly', STYLES.small),
                v: game.constants[name].current !== null,
            }).ref(v => game.labels[name] = v),
        ], SM, SSM);
    },

    create(container, game) {
        const { Column, Row, Label, Button } = FormComponents;
        const sheet = PIXI.loader.resources.sprites.spritesheet;

        game.labels = {};

        const form = new Column([
            new Row([ new Label('Options', STYLES.title)]),
            new Column([
                new Label('Time'),
                new Row([
                    new Button(sheet, 'stop', () => game.options.speed = 0),
                    new Button(sheet, 'play', () => game.options.speed = 1),
                    new Button(sheet, 'fast', () => game.options.speed = 10),
                ]),
            ], SM, SM),
            new Column([
                new Label('Flow'),
                new Row([
                    new Button(sheet, 'pause', () => game.options.repeat = false),
                    new Button(sheet, 'single', () => game.create()),
                    new Button(sheet, 'repeat', () => game.options.repeat = true),
                ]),
            ], SM, SM),
            new Column([
                new Row([
                    new Label('Config'),
                    new Button(sheet, 'config', () => ModalConfig.toggle()),
                ], SM, 0),
                this.createInput(game, sheet, 'flow'),
                this.createInput(game, sheet, 'xi'),
                this.createInput(game, sheet, 'vzero'),
                this.createInput(game, sheet, 'b'),
                this.createInput(game, sheet, 'theta'),
            ], SM, SM),
            new Column([
                new Row([
                    new Label('Stats'),
                    new Button(sheet, 'repeat', () => game.stats.reset()),
                    new Button(sheet, 'dice', () => ModalStats.toggle()),
                ]),
                new Row([
                    new Label('Hits: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => game.labels.hits = ref),
                ]),
                new Row([
                    new Label('Total: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => game.labels.total = ref),
                ]),
                new Row([
                    new Label('Prob: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => game.labels.prob = ref),
                ]),
            ], SM, SM),
        ], 0, SM);

        const x = SIZE + 2*MARGIN;
        const y = MARGIN;

        container.removeChildren();
        form.build(container, x, y);
    }
};

const Menu = {
    create(app, game) {
        const { Column, Row, Label, Button, SliderInput } = FormComponents;
        const sheet = PIXI.loader.resources.sprites.spritesheet;
        let hits, total, prob;

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
                new Label('Config'),
                new Column([
                    new Label('Flow (particles/ps)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 1,
                        max: 100,
                        get: () => game.constants.flow,
                        set: v => game.constants.flow = v,
                    }),
                ], SM, SM),
                new Column([
                    new Label('Xi (px^3/ps^2)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 20000,
                        max: 30000,
                        get: () => game.constants.alpha,
                        set: v => (game.constants.alpha = v) && game.stats.reset(),
                    }),
                ], SM, SM),
                new Column([
                    new Label('vzero (px/ps)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 30,
                        max: 60,
                        get: () => game.constants.vzero,
                        set: v => (game.constants.vzero = v) && game.stats.reset(),
                    }),
                ], SM, SM),
                new Column([
                    new Label('delta y (px)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 0,
                        max: SIZE/2,
                        get: () => game.constants.dy,
                        set: v => (game.constants.dy = v) && game.stats.reset(),
                    }),
                ], SM, SM),
            ], SM, SM),
            new Column([
                new Row([
                    new Label('Stats'),
                    new Button(sheet, 'repeat', () => game.stats.reset()),
                ]),
                new Row([
                    new Label('Hits: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => hits = ref),
                ]),
                new Row([
                    new Label('Total: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => total = ref),
                ]),
                new Row([
                    new Label('Prob: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => prob = ref),
                ]),
            ], SM, SM),
        ], SM, MARGIN);

        const x = SIZE + 2*MARGIN;
        const y = MARGIN;
        form.build(app.stage, x, y);

        game.labels = { hits, total, prob };
    }
};
const Menu = {
    create(app, game) {
        const { Column, Row, Label, Button, SliderInput, Switch } = FormComponents;
        const sheet = PIXI.loader.resources.sprites.spritesheet;
        const refs = {};

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
                ], SM, SSM),
                new Column([
                    new Label('Xi (px^3/ps^2)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 20000,
                        max: 30000,
                        get: () => game.constants.alpha,
                        set: v => (game.constants.alpha = v) && game.stats.reset(),
                    }),
                ], SM, SSM),
                new Column([
                    new Row([
                        new Label('vzero (px/ps)', STYLES.small),
                        new Button(sheet, 'config', () => {
                            if (game.constants.vzero.current !== null) {
                                game.constants.vzero.current = null;
                                refs.vzero.set(false);
                            } else {
                                game.constants.vzero.current = game.constants.vzero.default;
                                refs.vzero.set(true);
                            }
                        }),
                    ]),
                    new Switch({
                        on: new SliderInput(sheet, {
                            min: game.constants.vzero.min,
                            max: game.constants.vzero.max,
                            get: () => game.constants.vzero.current,
                            set: v => (game.constants.vzero.current = v) && game.stats.reset(),
                        }),
                        off: new Label('Will be generated randomly', STYLES.small),
                    }).ref(v => refs.vzero = v),
                ], SM, SSM),
                new Column([
                    new Row([
                        new Label('b (px)', STYLES.small),
                        new Button(sheet, 'config', () => {
                            if (game.constants.b.current !== null) {
                                game.constants.b.current = null;
                                refs.b.set(false);
                            } else {
                                game.constants.b.current = game.constants.b.default;
                                refs.b.set(true);
                            }
                        }),
                    ]),
                    new Switch({
                        on: new SliderInput(sheet, {
                            min: game.constants.b.min,
                            max: game.constants.b.max,
                            get: () => game.constants.b.current || 0,
                            set: v => (game.constants.b.current = v) && game.stats.reset(),
                        }),
                        off: new Label('Will be generated randomly', STYLES.small),
                        v: false,
                    }).ref(v => refs.b = v),
                ], SM, SSM),
                new Column([
                    new Label('delta y (px)', STYLES.small),
                    new SliderInput(sheet, {
                        min: 0,
                        max: SIZE/2,
                        get: () => game.constants.dy,
                        set: v => (game.constants.dy = v) && game.stats.reset(),
                    }),
                ], SM, SSM),
            ], SM, SM),
            new Column([
                new Row([
                    new Label('Stats'),
                    new Button(sheet, 'repeat', () => game.stats.reset()),
                ]),
                new Row([
                    new Label('Hits: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => refs.hits = ref),
                ]),
                new Row([
                    new Label('Total: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => refs.total = ref),
                ]),
                new Row([
                    new Label('Prob: ', STYLES.small),
                    new Label('', STYLES.small).ref(ref => refs.prob = ref),
                ]),
            ], SM, SM),
        ], 0, SM);

        const x = SIZE + 2*MARGIN;
        const y = MARGIN;
        form.build(app.stage, x, y);

        game.labels = refs;
    }
};
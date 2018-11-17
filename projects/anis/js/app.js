const random = (min, max) => Math.random() * (max - min) + min;

const App = {
    run() {
        const type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas';
        PIXI.utils.sayHello(type);

        const app = new PIXI.Application({
            width: FULL_SIZE,
            height: SIZE,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        const getValueOrGenerate = constant => {
            if (constant.current === null) {
                return random(constant.min, constant.max);
            }
            return constant.current;
        };

        const game = {
            _lastTime: Date.now(),
            _lastDt: 0,
            fullWidth: FULL_SIZE,
            width: SIZE,
            height: SIZE,
            components: [],
            options: {
                speed: 1,
                repeat: false,
                repeatClock: 0,
            },
            constants: {
                alpha: 25080,
                vzero: {
                    min: 30,
                    max: 60,
                    default: 51.2,
                    current: 51.2,
                },
                b: {
                    min: -SIZE / 2,
                    max: SIZE / 2,
                    default: 0,
                    current: null,
                },
                dy: SIZE/4,
                flow: 1,
            },
            stats: {
                total: 0,
                hits: 0,
                prob: 0,
                reset() {
                    game.stats.total = 0;
                    game.stats.hits = 0;
                    game.stats.prob = 0;
                },
            }
        };

        const setup = () => {
            app.ticker.add(gameLoop);

            const bg = new Background();
            app.stage.addChild(bg.toPixi(game));

            Menu.create(app, game);

            game.create = () => {
                const b = getValueOrGenerate(game.constants.b);
                const vzero = getValueOrGenerate(game.constants.vzero);
                const pt = new Particle(game, new Point(-game.width/2, b), new Point(vzero, 0));
                game.components.push(pt);
                app.stage.addChild(pt.toPixi(game));
            };

            document.getElementById('root').replaceWith(app.view);
        };

        const gameLoop = () => {
            const time = Date.now();
            const dt = time - game._lastTime;
            game._lastTime = time;

            const realDt = dt * game.options.speed;
            if (realDt === 0) {
                return;
            }

            update(game, realDt / 1000);
        };

        const update = (game, dt) => {
            dt += game._lastDt;
            while (dt >= STEP) {
                if (game.options.repeat) {
                    game.options.repeatClock += STEP;
                    while (game.options.repeatClock > 1 / game.constants.flow) {
                        game.options.repeatClock -= 1 / game.constants.flow;
                        game.create();
                    }
                } else {
                    game.options.repeatClock = 0;
                }

                game.components.forEach(p => p.update(STEP));
                dt -= STEP;
            }
            game._lastDt = dt;
            if (dt > 0) {
                game.components.forEach(p => p.tween(dt));
            }
            game.components = game.components.filter(e => !e.destroy(app.stage));

            game.labels.hits.text = game.stats.hits;
            game.labels.total.text = game.stats.total;
            game.labels.prob.text = game.stats.prob;
        };

        PIXI.loader.add('sprites', 'assets/spritesheet.json').load(setup);
    },
};
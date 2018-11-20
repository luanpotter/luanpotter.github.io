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
                xi: {
                    title: 'Xi (px^3/ps^2)',
                    min: 10,
                    max: 10000,
                    default: 1812,
                    current: 1812,
                },
                vzero: {
                    title: 'vzero (px/ps)',
                    min: 30,
                    max: 60,
                    default: 51.2,
                    current: 51.2,
                },
                b: {
                    title: 'b (px)',
                    min: -SIZE / 2,
                    max: SIZE / 2,
                    default: 0,
                    current: null,
                },
                theta: {
                    title: 'theta (degrees)',
                    min: 0,
                    max: 90,
                    default: 45,
                    current: 45,
                },
                flow: {
                    title: 'Flow (particles/ps)',
                    min: 1,
                    max: 100,
                    default: 1,
                    current: 100,
                }
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

            const menu = new PIXI.Container();
            app.stage.addChild(menu);
            game.menu = menu;
            game.resetMenu = () => Menu.create(menu, game);
            game.resetMenu();

            game.create = () => {
                const b = getValueOrGenerate(game.constants.b);
                const vzero = getValueOrGenerate(game.constants.vzero);
                const pt = new Particle(game, b, vzero);
                game.components.push(pt);
                app.stage.addChild(pt.toPixi(game));
            };

            document.getElementById('root').replaceWith(app.view);
            Modal.setup(game);
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
            const flow = getValueOrGenerate(game.constants.flow);
            dt += game._lastDt;
            while (dt >= STEP) {
                if (game.options.repeat) {
                    game.options.repeatClock += STEP;
                    while (game.options.repeatClock > 1 / flow) {
                        game.options.repeatClock -= 1 / flow;
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

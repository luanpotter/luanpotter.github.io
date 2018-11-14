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
            alpha: 25080,
            vzero: 51.2,
            dy: SIZE/4,
            flow: 1,
        },
        stats: {
            total: 0,
            hits: 0,
        }
        };

        const setup = () => {
            app.ticker.add(gameLoop);

            const bg = new Background();
            app.stage.addChild(bg.toPixi(game));

            UI(app, game);
            
            game.create = () => {
                const b = Math.random() * game.height - game.height / 2;
                const vzero = game.constants.vzero;
                const pt = new Particle(game, new Point(-game.width/2, b), new Point(vzero, 0));
                game.components.push(pt);
                app.stage.addChild(pt.toPixi(game));
            };

            document.body.appendChild(app.view);
        };

        const gameLoop = () => {
            const time = Date.now();
            const dt = time - game._lastTime;
            game._lastTime = time;

            const realDt = dt * game.options.speed;
            if (realDt === 0) {
                return;
            }

            update(game, dt / 1000);
        };

        const update = (game, dt) => {
            if (game.options.repeat) {
                game.options.repeatClock += dt;
                while (game.options.repeatClock > 1/game.constants.flow) {
                game.options.repeatClock -= 1/game.constants.flow;
                game.create();
                }
            } else {
                game.options.repeatClock = 0;
            }

            dt += game._lastDt;
            while (dt >= STEP) {
                game.components.forEach(p => p.update(STEP));
                dt -= STEP;
            }
            game._lastDt = dt;
            game.components = game.components.filter(e => !e.destroy(app.stage));
        };

        PIXI.loader.add('sprites', 'assets/spritesheet.json').load(setup);
    },
};
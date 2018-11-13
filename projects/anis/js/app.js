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
            render: true,
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
            app.ticker.add(delta => gameLoop(game, delta));
            const canvas = new PIXI.Graphics();
            app.stage.addChild(canvas);

            UI(app, game);

            document.body.appendChild(app.view);
            game.canvas = canvas;
            
            game.create = () => {
                const b = Math.random() * game.height - game.height / 2;
                const vzero = game.constants.vzero;
                game.components.push(new Particle(game, new Point(-game.width/2, b), new Point(vzero, 0)));
            };
        };

        const gameLoop = (game, delta) => {
            const time = Date.now();
            const dt = time - game._lastTime;
            game._lastTime = time;
            update(game, dt / 1000);
            game.options.render && render(game);
        };

        const render = game => {
            const { canvas } = game;

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

            game.components.forEach(p => p.render(canvas));
        };

        const update = (game, dt) => {
            dt *= game.options.speed;
            if (dt === 0) {
                return;
            }

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
            game.components = game.components.filter(e => !e.destroy());
        };

        PIXI.loader.add('sprites', 'assets/spritesheet.json').load(setup);
    },
};
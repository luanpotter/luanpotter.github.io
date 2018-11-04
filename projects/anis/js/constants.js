const STEP = 0.01;
const MARGIN = 16;
const SM = MARGIN / 2;
const SIZE = 512;
const FULL_SIZE = 2 * SIZE + MARGIN;

const STYLES = {
    title: new PIXI.TextStyle({
      fontFamily: 'diffusion',
      fontSize: 24,
      fill: '#fff4e6',
    }),
    regular: new PIXI.TextStyle({
      fontFamily: 'diffusion',
      fontSize: 12,
      fill: '#fff4e6',
    }),
    small: new PIXI.TextStyle({
      fontFamily: 'diffusion',
      fontSize: 8,
      fill: '#fff4e6',
    }),
  };
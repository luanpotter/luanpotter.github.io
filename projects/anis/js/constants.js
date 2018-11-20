const STEP = 0.01; // ps (pixeconds)
const MARGIN = 16; // px
const SM = MARGIN / 2; // px
const SSM = SM / 2; // px
const SIZE = 512; // px
const FULL_SIZE = 2 * SIZE + MARGIN; // px

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

const random = (min, max) => Math.random() * (max - min) + min;

const getValueOrGenerate = constant => {
  if (constant.current === null) {
    return random(constant.min, constant.max);
  }
  return constant.current;
};
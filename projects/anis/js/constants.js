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

// it's spec now, folks
Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

Object.fromEntries = iterable => {
  return [...iterable]
    .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
};
//

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const deepClone = v => JSON.parse(JSON.stringify(v));

const np = {
  linspace(start, end, num = 10) {
    const result = [start];
    const step = (end - start) / num;
    while (start < end) {
      start += step;
      result.push(start);
    }
    return result;
  }
};

const toDegrees = angle => angle * (180 / Math.PI);
const toRadians = angle => angle * (Math.PI / 180);
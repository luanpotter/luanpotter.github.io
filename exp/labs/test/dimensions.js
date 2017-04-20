const labs = require('./labs');
const Env = labs.Env;
const EnvBuilder = labs.EnvBuilder;

var expect = require('chai').expect;
describe('dimensions', function() {

    it('simplify division', function() {
        let unit = Dimensions.simplify('V/A');
        expect(unit).to.equal('\\Omega');
    });

    it('simplify number', function() {
        let unit = Dimensions.simplify('7');
        expect(unit).to.equal('');
    });

    it('simplify product', function() {
        let unit = Dimensions.simplify('N * m');
        expect(unit).to.equal('J');
    });

    it('simplify complex', function() {
        let unit = Dimensions.simplify('g * (m/s^2) / (V/m)');
        expect(unit).to.equal('C');
    });

    it('simplify sum', function() {
        let unit = Dimensions.simplify('N * m + J - W * s');
        expect(unit).to.equal('J');
    });

    it('incoherent sum', function() {
        expect(() => Dimensions.simplify('N + J')).to.throw('');
    });

    it('complex exponent', function() {
        let unit = Dimensions.simplify('(N^(2^2-1/2-(3+2+1)/2))^2');
        expect(unit).to.equal('N');
    });

    it('incoherent exponent', function() {
        expect(() => console.log(Dimensions.simplify('N^J'))).to.throw('');
    });
});

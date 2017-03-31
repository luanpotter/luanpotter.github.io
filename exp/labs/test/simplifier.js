const labs = require('./labs');
const Exp = labs.Exp;

var assert = require('chai').assert;
describe('simplifier', function() {
    it('multiply by inverse', function() {
        var exp = Exp.parse('1/m * m');
        assert.equal('1', exp.simplify().toPrettyString());
    });
    it('sum', function() {
        var exp = Exp.parse('2*x + 3*x + 7*x^2/x');
        assert.equal('12*x', exp.simplify().toPrettyString());
    });
});

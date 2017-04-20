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
    it('potency of potency', function() {
        var exp = Exp.parse('(x^2)^2');
        assert.equal('x^4', exp.simplify().toPrettyString());
    });
    it('product of product', function() {
        var exp = Exp.parse('(x*y)*x');
        assert.equal('x^2*y', exp.simplify().toPrettyString());
    });
});

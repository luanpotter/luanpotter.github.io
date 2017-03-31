const labs = require('./labs');
const Env = labs.Env;
const EnvBuilder = labs.EnvBuilder;

var assert = require('chai').assert;
describe('units', function() {
    it('fetch direct unit', function() {
        var builder = new EnvBuilder();
        builder.var('r', 'r', 'm');
        
        var env = builder.build();
        var unit = env.fetchUnit(env.vars.r);
        assert.equal('m', unit);
    });

    it('fetch derived unit', function() {
        var builder = new EnvBuilder();
        builder.var('r', 'r', 'm');
        builder.varWithFormula('A', 'A', 'pi*r^2');
        
        var env = builder.build();
        var unit = env.fetchUnit(env.vars.A);
        assert.equal('', unit); // TODO implement these : m^2
    });

    it('derived complex units', function() {
        var builder = new EnvBuilder();
        builder.constantWithValue('k', 'k', 2, 0, '1/m');
        builder.var('r', 'r', 'm');
        builder.varWithFormula('d1', 'd1', 'k*r');

        var env = builder.build();
        assert.equal('', env.fetchUnit(env.vars.d1));
    });
});

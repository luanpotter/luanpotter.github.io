const labs = require('./labs');
const Env = labs.Env;
const EnvBuilder = labs.EnvBuilder;

var assert = require('chai').assert;
describe('consts', function() {
    it('using const in a formula', function() {
        var builder = new EnvBuilder();
        builder.var('r', 'r', 'm');
        builder.var('A', 'A', 'm', 'pi*r^2');
        
        var env = builder.build();
        env.add('r', [1, 2], 0.5);
        var table = env.table(['r', 'A']);
        var result = [
            [
                { value: '1.0', error: '0.5', multiplier: '' },
                { value: '3', error: '3', multiplier: '' }
            ],
            [
                { value: '2.0', error: '0.5', multiplier: '' },
                { value: '13', error: '6', multiplier: '' }
            ]
        ];
        assert.deepEqual(result, table);
    });

    it('using custom const', function() {
        var builder = new EnvBuilder();
        builder.constantWithValue('k', 'k', 2, 0.5, 'N/m');
        builder.var('x', 'x', 'm');
        builder.var('F', 'F', 'N', 'k*x');
        
        var env = builder.build();
        env.add('x', [1], 0.5);
        var table = env.table(['F', 'x']);
        var result = [[
            { value: '2', error: '1', multiplier: '' },
            { value: '1.0', error: '0.5', multiplier: '' }
        ]];
        assert.deepEqual(result, table);
    });

    it('using derived constant', function() {
        var builder = new EnvBuilder();
        builder.constantWithFormula('tau', '\\tau', '2*pi');
        builder.var('r', 'r', 'm');
        builder.var('C', 'C', 'm', 'tau*r');
        
        var env = builder.build();
        env.add('r', [1], 0.5);
        var table = env.table(['C', 'r']);
        var result = [[
            { value: '6', error: '3', multiplier: '' },
            { value: '1.0', error: '0.5', multiplier: '' }
        ]];
        assert.deepEqual(result, table);
    });

    it('using derived complex constant', function() {
        var builder = new EnvBuilder();
        builder.constantWithFormula('tau', '\\tau', '2*pi');
        builder.constantWithFormula('zero', 'zero', 'sin(tau)');
        builder.var('x', 'x', 'm');
        builder.var('y', 'y', 'm', 'zero+x');
        
        var env = builder.build();
        env.add('x', [1], 0.5);
        var table = env.table(['y', 'x']);
        var result = [[
            { value: '1.0', error: '0.5', multiplier: '' },
            { value: '1.0', error: '0.5', multiplier: '' }
        ]];
        assert.deepEqual(result, table);
    });
});

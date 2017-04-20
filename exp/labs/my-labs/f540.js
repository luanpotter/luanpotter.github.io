var labs = require ('./labs');

var b = new labs.EnvBuilder();

b.variableObj({
	name: 'r',
	unit : '\\Omega'
});

b.variableObj({
	name: 'vm',
	unit : 'V'
});

b.variableObj({
	name: 'vr',
	unit : 'V'
});

b.variableObj({
	name: 'ir',
	unit : 'A',
	formula: 'vr/r'
});

b.variableObj({
	name: 'im',
	unit : 'A',
	formula: 'vm/r'
});
/*
var c1 = b.build();

c1.add('r', [[4980, 59.8], [2490, 34.9], [1210, 22.1], [990, 19.9], [800, 18], [600, 16], [500, 15], [400, 14], [322, 13.22], [303, 13.03]]);

c1.add('vm', [[11.7, 0.356], [11.1, 0.338], [10.1, 0.308], [9.8, 0.299], [9.39, 0.2867], [8.78, 0.2684], [8.37, 0.2561], [7.88, 0.2414], [7.41, 0.2273], [7.26, 0.2228]]);

c1.add('vr', [[3.44, 0.1082], [4.52, 0.1406], [6.44, 0.1982], [7.1, 0.218], [7.88, 0.2414], [8.96, 0.2738], [9.64, 0.2942], [10.4, 0.317], [11, 0.335], [11.1, 0.338]]);

var a = c1.fullLatexTable(['r', 'vm', 'im', 'vr', 'ir'], 'My table', 'ir_im');
*/


var c2 = b.build();

const v_error = v => [v, 3/100*v+5/100*0.1];

var rs =  [4.98, 2.49, 1.21, .994,  0.8,  0.6,  0.5,  0.4,  0.325, 0.304].map(r => [r, 1/100*r+0.01]);
var vms = [12.5, 12.1, 11.6, 11.4, 11.2, 10.9, 10.6, 10.3, 10,    9.96].map(v_error);
var vrs = [2,    2.64, 3.76, 4.3,  4.8,  5.6,  6.16, 6.88, 7.56,  7.8].map(v_error);

c2.add('r', rs, 'k');
c2.add('vm', vms);
c2.add('vr', vrs);

var b = c2.fullLatexTable(['r', 'vm', 'im', 'vr', 'ir'], 'Para o circuito 2', 'ir_im');


var args = ['vm', 'im', 'vr', 'ir'];

const toOrigin = (args) => {
	var headers = args.map(arg => arg + '\te' + arg).join('\t') + '\n';
	return headers + c2.table(args).map(row => row.map(el => {
    	var ms = el.multiplier;
    	var m = new Decimal(10).pow(parseInt(labs.Env.MULTIPLIERS[ms].multiplier));
		return (m*el.value) + '\t' + (m*el.error);
	}).join("\t")).join("\n");
};

var c = toOrigin(args);

console.log(b);
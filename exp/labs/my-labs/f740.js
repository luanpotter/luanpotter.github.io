var labs = require ('../test/labs');

var b = new labs.EnvBuilder();

b.constObj({
	name: 'epsilon',
	latexName: '\\epsilon',
	formula: '-V/d',
	unit: 'V/m'
});

b.constObj({
	name: 'V',
	unit: 'V',
	value: 500,
	error: 1
});

b.constObj({
	name: 'd',
	unit: 'm',
	value: '0.0072',
	error: '0.00005'
});

b.constObj({
	name: 'rho',
	latexName: '\\rho',
	unit: 'g/m^3',
	multiplier: 'k',
	value: '886',
	error: 0
});

b.constObj({
	name: 'g',
	unit: 'm/s^2',
	value: '9.887',
	error: '0.001'
});

b.constObj({
	name: 'b',
	description: 'Constante de Stokes',
	unit: 'J/m^2',
	value: '0.008226',
	error: 0
});

b.constObj({
	name: 'eta',
	latexName: '\\eta',
	description: 'Viscosidade do ar na sala',
	multiplier: '\\mu',
	unit: 'Pa*s',
	value: '18.61',
	error: '0.01'
});

b.constObj({
	name: 'p',
	description: 'Pressão atmosférica na sala',
	multiplier: 'k',
	unit: 'Pa',
	value: '94',
	error: 0
});

b.constObj({
	name: 'dt',
	unit: 's',
	value: 2,
	error: 0
});

b.constObj({
	name: 'q',
	unit: 'm',
	multiplier: 'm',
	value: 0.1,
	error: 0
});

b.constObj({
	name: 'q_prime',
	unit: 'cm\'',
	value: 0.9,
	error: 0.05
});

b.variableObj({
	name: 'df_prime',
	latexName: '\delta_f^\prime',
	unit : 'cm\''
});

b.variableObj({
	name: 'dr_prime',
	latexName: '\delta_r^\prime',
	unit : 'cm\''
});

b.variableObj({
	name: 'df',
	latexName: '\delta_f',
	unit: 'm',
	formula: 'df_prime*q/q_prime'
});

b.variableObj({
	name: 'dr',
	latexName: '\delta_r',
	unit: 'm',
	formula: 'dr_prime*q/q_prime'
});

b.variableObj({
	name: 'vf',
	latexName: 'v_f',
	unit: 'm/s',
	formula: 'df/dt'
});

b.variableObj({
	name: 'vr',
	latexName: 'v_r',
	unit: 'm/s',
	formula: 'dr/dt'
});

b.variableObj({
	name: 'a',
	description: 'Raio da gotícula',
	unit: 'm',
	formula: '((b/(2*p))^2 + 9*eta*vf/(2*g*p))^(1/2) - b/(2*p)'
})

b.variableObj({
	name: 'Vol',
	description: 'Volume da gotícula',
	unit: 'm^3',
	formula: '4/3*pi*a^3'
});

b.variableObj({
	name: 'm',
	description: 'Massa da gotícula',
	unit: 'g',
	formula: 'rho * Vol'
});

b.variableObj({
	name: 'charge',
	latexName: 'q',
	description: 'Carga da gotícula',
	unit: 'C',
	formula: 'm*g*(vf-vr)/(epsilon*vf)'
});

var e = b.build();

e.add('df_prime', [ 1.55, 1.3, 1.2, 1, 0.9, 1.6, 1.7, 1.9, 1.6, 1.7, 1.1, 0.85, 1.5, 0.5, 0.7, 3.2, 0.85, 0.9, 3.15, 1.2, 0.7, 0.6, 1.4, 1.1, 3.2, 3, 2.4, 1.2, 0.3, 0.1 ], 0.05);
e.add('dr_prime', [ -1.3, -1.15, -1.6, -0.4, 0.5, -1.3, 1.7, -2.3, -1.3, 1.7, -1.4, 0.7, -1.7, -1.8, -0.4, -0.8, -1.6, 0.9, -0.9, 1.2, 0.7, 2.8, 0.55, 1.1, -0.75, -1.3, 0.6, -2.9, 0, 0 ], 0.05);

// console.log(e.error(e.vars.charge).simplify().toString());

console.log('---------------------------------------')
console.log(e.fullLatexTable(['df_prime', 'dr_prime', 'df', 'dr'], 'Medições N', 'medicoes_n'));
console.log('---------------------------------------')
console.log(e.fullLatexTable(['vr', 'vf', 'a'], 'Caracteriação N', 'caracterizacao_n'));
console.log('---------------------------------------')
console.log(e.fullLatexTable(['a', 'Vol', 'm', 'charge'], 'Cargas N', 'cargas_n'));
console.log('---------------------------------------')
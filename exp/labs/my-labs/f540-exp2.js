const labs = require ('./labs');

const erro_r = rs => rs.map(r => [r, 0.1]);
const erro_v = vs => vs.map(v => [v, 0.1]);

var rs = erro_r([ 10, 100, 500, 1000, 4000, 8000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000 ]);
var vs_10kohm = erro_v([ 10.39, 10.38, 10.3, 10.21, 9.67, 9.05, 8.765, 7.6, 6.725, 6.04, 5.5, 5, 4.73, 4.47, 4.3, 4.15 ]);
var vs_15kohm = erro_v([ 9.4, 9.39, 9.32, 9.25, 8.81, 8.3, 8.06, 7.08, 6.32, 5.71, 5.24, 4.86, 4.53, 4.3, 4.2, 4.1 ]);
var vs_18kohm = erro_v([ 9.05, 9.04, 8.98, 8.91, 8.51, 8.03, 7.81, 6.89, 6.17, 5.61, 5.16, 4.79, 4.52, 4.32, 4.17, 4.04 ]);





var b = new labs.EnvBuilder();

b.constObj({ name: 'vcc', latexName: 'V_{CC}', unit : 'V', value: 15, error: 0 });

b.variableObj({ name: 'r', unit : '\\Omega' });
b.variableObj({ name: 'v', latexName: 'V_{CE}', unit : 'V' });
b.variableObj({ name: 'i', latexName: 'I_{CE}', unit : 'A', formula : '(vcc - v)/r' });

var e = b.build();
e.add('r', rs);
e.add('v', vs_10kohm);
var a = e.fullLatexTable(['v', 'i'], 'Valores de $V_{CE}$ por $I_{CE}$', 'v_por_i');
console.log(a);
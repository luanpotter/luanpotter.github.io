Latex = (function () {
    var Latex = {};

    const elToLatex = function (el) {
        let m = el.multiplier ? ' ' + el.multiplier : '';
        return '$' + el.value + ' \\pm ' + el.error + m + '$';
    };

    function header(env, name) {
        let variable = env.vars[name];
        let unit = env.fetchUnit(variable);
        return '$' + variable.name + (unit === '' ? '' : ' (' + unit + ')') + '$';
    }

    Latex.latexTable = function (names, env) {
        let table = env.table(names).map(function (row) {
            return row.map(elToLatex);
        });
        table.splice(0, 0, names.map(function (name) {
            return header(env, name);
        }.bind(env)));
        return table.map(function (row) {
            return row.join(' & ');
        }).join(' \\\\\n');
    };

    Latex.fullLatexTable = function (names, caption, ref, env) {
        return [
            '\\begin{longtable}[c]{|' + ' c |'.repeat(names.length) + '}',
            '\\caption{' + caption + '\\label{tab:' + ref + '}}\\\\',
            '\\hline',
            names.map(n => header(env, n)).join(' & ') + ' \\\\',
            '\\hline',
            '\\endhead',
            '\\hline',
            '\\endfoot',
            '\\hline',
            '\\caption*{ ' + names.map(n => '$' + env.name(n) + '$: desc...').join('; ') + '}',
            '\\endlastfoot',
            env.table(names).map(function (row) {
                return row.map(elToLatex).join(' & ') + ' \\\\';
            }).join('\n'),
            '\\end{longtable}'
        ].join('\n');
    };

    return Latex;
})();

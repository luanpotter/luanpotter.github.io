const Engine = class {
    constructor(sentences) {
        this.sentences = sentences.map(sentence => {
            const halfs = sentence.split('=');
            if (halfs.length !== 2) {
                throw `Invalid sentence ${sentence}; must have exactly one '=' sign.`;
            }
            const terms = [];
            const parse = sign => term => {
                const bits = term.split('^');
                const variable = bits[0].trim();
                if (bits.length === 1) {
                    terms.push({ variable, exp: sign });
                } else if (bits.length === 2) {
                    const exp = bits[1].trim();
                    if (!exp.match(/\-?\d*/)) {
                        throw `Invalid exponent ${exp}; must be only integers.`;
                    }
                    terms.push({ variable, exp: sign * parseInt(exp) });
                } else {
                    throw `Invalid term ${term}; must have a single carret.`;
                }
            };
            halfs[0].split('*').forEach(parse(-1));
            halfs[1].split('*').forEach(parse(+1));
            if (terms.length <= 2) {
                throw `Invalid sentence ${sentence}; must have at least two terms.`;
            }
            return terms;
        });
        this.variables = this.sentences.flatMap(sentence => sentence.map(term => term.variable)).filter(onlyUnique);
    }

    calc(given) {
        const givenNames = Object.keys(given);
        if (givenNames.length === this.variables.length) {
            return given; // done
        }
        const resolvables = this.sentences.filter(sentence => {
            const variables = sentence.map(term => term.variable);
            const newOnes = variables.filter(variable => !givenNames.includes(variable));
            return newOnes.length === 1;
        });
        if (resolvables.length === 0) {
            console.info({ given });
            throw 'Unsolvable! Can\'t move on';
        } else {
            resolvables.forEach(sentence => {
                const variables = sentence.map(term => term.variable);
                const newOne = variables.filter(variable => !givenNames.includes(variable))[0];
                const newValue = this._calcOne(newOne, sentence, given);
                given[newOne] = { name: newOne, value: newValue };
            });
            return this.calc(given);
        }
    }

    _calcOne(variable, sentence, given) {
        const otherVariables = sentence.filter(term => term.variable !== variable);
        const me = sentence.filter(term => term.variable === variable)[0];
        const otherValue = otherVariables.map(v => given[v.variable].value ** v.exp).reduce((a, b) => a * b);
        return otherValue ** (-me.exp);
    }
};
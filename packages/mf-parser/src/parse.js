'use strict';


const Kind = require('./Kind');
const parseCharge = require('./util/parseCharge');

/**
 * Parse a mf to an array of kind / value
 * @param {String} mf
 */

module.exports = function parse(mf) {
    return new MFParser().parse(mf);
};

class MFParser {
    parse(mf = '') {
        this.mf = mf;
        this.i = 0;
        this.result = [];

        let lastKind = Kind.BEGIN;
        while (this.i < mf.length) {
            if (this.result.length > 0 && this.result[this.result.length - 1].kind !== Kind.TEXT) {
                lastKind = this.result[this.result.length - 1].kind;
            }
            let char = mf.charAt(this.i);
            let ascii = mf.charCodeAt(this.i);
            let nextAscii = 0;
            if (this.i + 1 < mf.length) nextAscii = mf.charCodeAt(this.i + 1);

            if ((ascii > 47 && ascii < 58) || (char === '-' && nextAscii > 47 && nextAscii < 58)) { // a number
                let value = this.getNumber(ascii);
                if (lastKind === Kind.SALT || lastKind === Kind.BEGIN || lastKind === Kind.OPENING_PARENTHESIS) {
                    if (value.to) throw new MFError(this.mf, this.i, 'Premultiplier may not contain a -');
                    this.result.push({ kind: Kind.PRE_MULTIPLIER, value: value.from });
                } else {
                    if (value.to) {
                        this.result.push({ kind: Kind.MULTIPLIER_RANGE, value });
                    } else {
                        this.result.push({ kind: Kind.MULTIPLIER, value: value.from });
                    }
                }

                continue;
            } else if (char === '.') { // a point
                this.result.push({ kind: Kind.SALT, value: char });
                // it is not in a number otherwise it would have been taken before
                // it must be in a salt
            } else if (ascii > 64 && ascii < 91) { // an uppercase = new atom
                let value = this.getAtom(ascii);
                this.result.push({ kind: Kind.ATOM, value });
                continue;
            } else if (ascii > 96 && ascii < 123) { // a lowercase
                throw new MFError(this.mf, this.i, 'found a lowercase not following an uppercase');
            } else if (char === '(') {
                let charge = this.getParenthesisCharge(ascii);
                if (charge) {
                    this.result.push({ kind: Kind.CHARGE, value: charge });
                } else {
                    this.result.push({ kind: Kind.OPENING_PARENTHESIS, value: '(' });
                }
            } else if (char === ')') {
                this.result.push({ kind: Kind.CLOSING_PARENTHESIS, value: ')' });
            } else if (char === '[') { // defines an isotope
                let isotope = this.getIsotope(ascii);
                this.result.push({ kind: Kind.ISOTOPE, value: isotope });
            } else if (char === ']') {
                throw new MFError(this.mf, this.i, 'should never meet an closing bracket not in isotopes');
            } else if (char === '{') { // can define an exotic isotopic ratio or mixtures of groups
                let isotopeRatio = this.getCurlyBracketIsotopeRatio(ascii);
                if (lastKind === Kind.ATOM) {
                    let lastResult = this.result[this.result.length - 1];
                    lastResult.kind = Kind.ISOTOPE_RATIO;
                    lastResult.value = {
                        atom: lastResult.value,
                        ratio: isotopeRatio
                    };
                } else {
                    throw new MFError(this.mf, this.i, 'isotopic composition has to follow an atom');
                }
            } else if (char === '}') {
                throw new MFError(this.mf, this.i, 'found a unexpected closing curly bracket');
            } else if (char === '+') { // charge not in parenthesis
                let charge = this.getNonParenthesisCharge(ascii);
                this.result.push({ kind: Kind.CHARGE, value: charge });
            } else if (char === '-') { // charge not in parenthesis
                let charge = this.getNonParenthesisCharge(ascii);
                this.result.push({ kind: Kind.CHARGE, value: charge });
            } else if (char === '$') { // it is a comment after
                this.result.push({ kind: Kind.COMMENT, value: this.mf.substring(this.i + 1) });
                break;
            } else {
                this.result.push({ kind: Kind.TEXT, value: char });
            }
            this.i++;
        }

        this.checkParenthesis();
        return this.result;
    }

    checkParenthesis() {
        let counter = 0;
        for (let line of this.result) {
            if (line.kind === Kind.OPENING_PARENTHESIS) counter++;
            if (line.kind === Kind.CLOSING_PARENTHESIS) counter--;
        }
        if (counter !== 0) {
            throw new MFError(this.mf, this.i, 'number of opening and closing parenthesis not equal');
        }
    }

    getNumber(ascii) {
        let number = '';
        let previous;
        do {
            previous = ascii;
            number += String.fromCharCode(ascii);
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii > 47 && ascii < 58 || ascii === 46 || ascii === 45); // number, . or -
        // we need to deal with the case there is a from / to
        if (previous === 46) this.i--;
        let indexOfDash = number.indexOf('-', 1);

        if (indexOfDash > -1) {
            return { from: Number(number.substr(0, indexOfDash)), to: Number(number.substr(indexOfDash + 1)) };
        }
        return { from: Number(number) };
    }

    getAtom(ascii) {
        let atom = '';
        do {
            atom += String.fromCharCode(ascii);
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii > 96 && ascii < 123);
        return atom;
    }

    getIsotope(ascii) { // [13C]
        let substring = '';
        do {
            substring += String.fromCharCode(ascii);
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii !== 93 && this.i <= this.mf.length);

        let atom = substring.replace(/[^a-zA-Z]/g, '');
        let isotope = Number(substring.replace(/[^0-9]/g, ''));
        return { atom, isotope };
    }


    getCurlyBracketIsotopeRatio(ascii) {
        let substring = '';
        let first = true;
        do {
            if (!first) {
                substring += String.fromCharCode(ascii);
            } else {
                first = false;
            }
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii !== 125 && this.i <= this.mf.length); // closing curly bracket
        if (substring.match(/^[0-9,]+$/)) {
            return substring.split(',').map((a) => Number(a));
        }
        throw new MFError(this.mf, this.i, 'Curly brackets should contain only number and comma');
    }

    getParenthesisCharge(ascii) {
        let substring = '';
        let begin = this.i;
        do {
            substring += String.fromCharCode(ascii);
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii !== 41 && this.i <= this.mf.length); // closing parenthesis
        if (substring.match(/^\([0-9+-]+$/)) {
            return parseCharge(substring.substring(1));
        } else {
            this.i = begin;
            return undefined;
        }
    }

    getNonParenthesisCharge(ascii) {
        let substring = '';
        do {
            substring += String.fromCharCode(ascii);
            this.i++;
            ascii = this.mf.charCodeAt(this.i);
        } while (ascii === 43 || ascii === 45 || (ascii > 47 && ascii < 58));
        this.i--;
        return parseCharge(substring);
    }
}
class MFError extends SyntaxError {
    constructor(mf, i, message) {
        let text = `${message}\n\n${mf}\n${' '.repeat(i)}^`;
        super(text);
    }
}

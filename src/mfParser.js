'use strict';

/**
 * Parse a mf to an array of kind / value
 * @param {string} mf
 *
 */
const Kind = require('./kind');


function parse(mf) {

    let atom = '';
    let charge = 0;
    let from = 0;
    let to = 0;

    let result = [];
    let lastKind = Kind.BEGIN;
    let i = 0;
    while (i < mf.length) {
        if (result.length > 0 && result[result.length - 1].kind !== Kind.TEXT) {
            lastKind = result[result.length - 1].kind;
        }
        let char = mf.charAt(i);
        let ascii = mf.charCodeAt(i);
        let nextAscii = 0;
        if (i + 1 < mf.length) nextAscii = mf.charCodeAt(i + 1);
        if ((ascii > 47 && ascii < 58) || (char === '-' && nextAscii > 47 && nextAscii < 58)) { // a number
            [i, from, to] = getNumber(mf, i, ascii);
            if (lastKind === Kind.SALT || lastKind === Kind.BEGIN || lastKind === Kind.OPENING_PARENTHESIS) {
                if (to) throw new MFError(mf, i, 'Premultiplier may not contain a -');
                result.push({kind: Kind.PRE_MULTIPLIER, value: from});
            } else {
                result.push({kind: Kind.MULTIPLIER, from, to});
            }
            continue;
        } else if (char === '.') { // a point
            result.push({kind: Kind.SALT, value: char});
            // it is not in a number otherwise it would have been taken before
            // it must be in a salt

        } else if (ascii > 64 && ascii < 91) { // an uppercase = new atom
            [i, atom] = getAtom(mf, i, ascii);
            result.push({kind: Kind.ATOM, value: atom});
            continue;
        } else if (ascii > 96 && ascii < 123) { // a lowercase
            throw new MFError(mf, i, 'found a lowercase not following an uppercase');
        } else if (char === '(') {
            [i, charge] = getParenthesisCharge(mf, i, ascii);
            if (charge) {
                result.push({kind: Kind.CHARGE, value: charge});
            } else {
                result.push({kind: Kind.OPENING_PARENTHESIS, value: '('});
            }
        } else if (char === ')') {
            result.push({kind: Kind.CLOSING_PARENTHESIS, value: ')'});
        } else if (char === '[') { // defines an isotope
            [i, atom] = getIsotope(mf, i, ascii);
            result.push({kind: Kind.ATOM, value: atom});
        } else if (char === ']') {
            throw new MFError(mf, i, 'should never meet an closing bracket not in isotopes');
        } else if (char === '{') { // can define an exotic isotopic ratio or mixtures of groups

        } else if (char === '}') {

        } else if (char === '+') { // charge not in parenthesis
            [i, charge] = getNonParenthesisCharge(mf, i, ascii);
            result.push({kind: Kind.CHARGE, value: charge});
        } else if (char === '-') { // charge not in parenthesis OR a negative number of atom
            if (result.pop().kind === Kind.ATOM) {

            } else {

            }
        } else {
            result.push({kind: Kind.TEXT, value: char});
        }
        i++;
    }
    return result;
}

function getNumber(mf, i, ascii) {
    let number = '';
    do {
        number += String.fromCharCode(ascii);
        i++;
        ascii = mf.charCodeAt(i);
    } while (ascii > 47 && ascii < 58 || ascii === 46 || ascii === 45); // number, . or -
    // we need to deal with the case there is a from / to
    let indexOfDash = number.indexOf('-', 1);
    if (indexOfDash > -1) {
        return [i, Number(number.substr(0, indexOfDash)), Number(number.substr(indexOfDash + 1))];
    }
    return [i, Number(number)];
}

function getAtom(mf, i, ascii) {
    let atom = '';
    do {
        atom += String.fromCharCode(ascii);
        i++;
        ascii = mf.charCodeAt(i);
    } while (ascii > 96 && ascii < 123);
    return [i, {atom}];
}

function getIsotope(mf, i, ascii) { // [13C]
    let substring = '';
    do {
        substring += String.fromCharCode(ascii);
        i++;
        ascii = mf.charCodeAt(i);
    } while (ascii !== 93);

    let atom = substring.replace(/[^a-zA-Z]/g, '');
    let isotope = Number(substring.replace(/[^0-9]/g, ''));
    return [i, {atom, isotope}];
}

function getParenthesisCharge(mf, i, ascii) {
    let substring = '';
    let begin = i;
    do {
        substring += String.fromCharCode(ascii);
        i++;
        ascii = mf.charCodeAt(i);
    } while (ascii !== 41); // closing parenthesis
    if (substring.match(/^\([0-9+-]+$/)) {
        return [i, getCharge(substring.substring(1))];
    } else {
        return [begin];
    }
}

function getNonParenthesisCharge(mf, i, ascii) {
    let substring = '';
    do {
        substring += String.fromCharCode(ascii);
        i++;
        ascii = mf.charCodeAt(i);
    } while (ascii === 43 || ascii === 45 || (ascii > 47 && ascii < 58)); // closing parenthesis
    return [i, getCharge(substring)];
}


const styleSuperimpose = 'flex-direction: column;display: inline-flex;justify-content: center;text-align: left;vertical-align: middle;';
const styleSuperimposeSupSub = 'line-height: 1; font-size: 70%';


function getHtml(lines) {
    var html = [];
    for (let line of lines) {
        switch (line.kind) {
            case FORMAT_SUBSCRIPT:
                html.push('<sub>' + line.value + '</sub>');
                break;
            case FORMAT_SUPERSCRIPT:
                html.push('<sup>' + line.value + '</sup>');
                break;
            case FORMAT_SUPERIMPOSE:
                html.push(`<span style="${styleSuperimpose}">`);
                html.push(`<sup style="${styleSuperimposeSupSub}">${line.over}</sup>`);
                html.push(`<sub style="${styleSuperimposeSupSub}">${line.value}</sub>`);
                html.push('</span>');


                break;
            default:
                html.push(line.value);
        }
    }
    return html.join('');
}

class MFError extends SyntaxError {
    constructor(mf, i, message) {
        let text = message + '\n\n' + mf + '\n' + ' '.repeat(i) + '^';
        super(text);
    }
}

// var result = parse('(CH3)2NO32[13C]2(++)-2');
var results = parse('C22-23 H1-2 Cl-3');
console.log(results);
results = convertForDisplay(results);
console.log(results);
console.log(getHtml(results));

// parse('(CH3CH2)3N . [2H]2O3++ . 0.5H3O(+) . NH4+ . NO3-- . NO3(2-) . NO3 (-2)');


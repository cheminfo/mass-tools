/* eslint-disable unicorn/prefer-code-point */

import { atomSorter } from 'atom-sorter';
import { elementsObject } from 'chemical-elements';
import { groupsObject } from 'chemical-groups';

import { Kind } from './Kind';
import { parseCharge } from './util/parseCharge';

/**
 * Parse a mf to an array of kind / value
 * @param {String} mf
 * @param {Object} [options={}]
 * @param {Boolean} [options.expandGroups=false] - if true, expand groups
 * @param {Boolean} [options.simplify=false] - if true, remove all the parenthesis and join identical atoms / groups
 */

export function parse(mf, options = {}) {
  return new MFParser().parse(mf, options);
}

class MFParser {
  parse(mf = '', options = {}) {
    this.expandGroups = options?.expandGroups ?? false;
    this.simplify = options?.simplify ?? false;
    this.mf = mf;
    this.i = 0;
    this.result = [];

    let lastKind = Kind.BEGIN;
    while (this.i < mf.length) {
      if (this.result.length > 0 && this.result.at(-1).kind !== Kind.TEXT) {
        lastKind = this.result.at(-1).kind;
      }
      let char = mf.charAt(this.i);
      let ascii = mf.charCodeAt(this.i);
      let nextAscii = 0;
      if (this.i + 1 < mf.length) nextAscii = mf.charCodeAt(this.i + 1);

      if (
        (ascii > 47 && ascii < 58) ||
        (char === '-' && nextAscii > 47 && nextAscii < 58)
      ) {
        // a number
        let value = this.getNumber(ascii);
        if (
          lastKind === Kind.SALT ||
          lastKind === Kind.BEGIN ||
          lastKind === Kind.OPENING_PARENTHESIS
        ) {
          if (value.to) {
            throw new MFError(
              this.mf,
              this.i,
              'Premultiplier may not contain a -',
            );
          }
          this.result.push({ kind: Kind.PRE_MULTIPLIER, value: value.from });
        } else if (lastKind === Kind.ANCHOR) {
          if (value.to) {
            throw new MFError(this.mf, this.i, 'Anchor ID may not contain -');
          }
          this.result.at(-1).value = value.from;
        } else if (value.to) {
          this.result.push({
            kind: Kind.MULTIPLIER_RANGE,
            value: {
              from: Math.min(value.from, value.to),
              to: Math.max(value.from, value.to),
            },
          });
        } else {
          this.result.push({ kind: Kind.MULTIPLIER, value: value.from });
        }
        continue;
      } else if (char === '.') {
        // a point
        this.result.push({ kind: Kind.SALT, value: char });
        // it is not in a number otherwise it would have been taken before
        // it must be in a salt
      } else if (char === '#') {
        // an anchor
        this.result.push({ kind: Kind.ANCHOR, value: 0 });
        // it is not in a number otherwise it would have been taken before
        // it must be in a salt
      } else if (ascii > 64 && ascii < 91) {
        // an uppercase = new atom
        this.result.push(...this.getAtom(ascii));
        continue;
      } else if (ascii > 96 && ascii < 123) {
        // a lowercase
        throw new MFError(
          this.mf,
          this.i,
          'found a lowercase not following an uppercase',
        );
      } else if (char === '(') {
        let charge = this.getParenthesisCharge(ascii);
        if (charge) {
          this.result.push({ kind: Kind.CHARGE, value: charge });
        } else {
          this.result.push({ kind: Kind.OPENING_PARENTHESIS, value: '(' });
        }
      } else if (char === ')') {
        this.result.push({ kind: Kind.CLOSING_PARENTHESIS, value: ')' });
      } else if (char === '[') {
        // defines an isotope
        let isotope = this.getIsotope(ascii);
        this.result.push({ kind: Kind.ISOTOPE, value: isotope });
      } else if (char === ']') {
        throw new MFError(
          this.mf,
          this.i,
          'should never meet an closing bracket not in isotopes',
        );
      } else if (char === '{') {
        // can define an exotic isotopic ratio or mixtures of groups
        let isotopeRatio = this.getCurlyBracketIsotopeRatio(ascii);
        if (lastKind === Kind.ATOM) {
          let lastResult = this.result.at(-1);
          lastResult.kind = Kind.ISOTOPE_RATIO;
          lastResult.value = {
            atom: lastResult.value,
            ratio: isotopeRatio,
          };
        } else {
          throw new MFError(
            this.mf,
            this.i,
            'isotopic composition has to follow an atom',
          );
        }
      } else if (char === '}') {
        throw new MFError(
          this.mf,
          this.i,
          'found a unexpected closing curly bracket',
        );
      } else if (char === '+') {
        // charge not in parenthesis
        let charge = this.getNonParenthesisCharge(ascii);
        this.result.push({ kind: Kind.CHARGE, value: charge });
      } else if (char === '-') {
        // charge not in parenthesis
        let charge = this.getNonParenthesisCharge(ascii);
        this.result.push({ kind: Kind.CHARGE, value: charge });
      } else if (char === '$') {
        // it is a comment after
        this.result.push({
          kind: Kind.COMMENT,
          value: this.mf.slice(this.i + 1),
        });
        break;
      } else {
        this.result.push({ kind: Kind.TEXT, value: char });
      }
      this.i++;
    }

    this.checkParenthesis();
    if (this.simplify) {
      this.result = simplify(this.result);
    }
    return this.result;
  }

  checkParenthesis() {
    let counter = 0;
    for (let line of this.result) {
      if (line.kind === Kind.OPENING_PARENTHESIS) counter++;
      if (line.kind === Kind.CLOSING_PARENTHESIS) counter--;
    }
    if (counter !== 0) {
      throw new MFError(
        this.mf,
        this.i,
        'number of opening and closing parenthesis not equal',
      );
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
    } while (
      (ascii > 47 && ascii < 58) ||
      ascii === 46 ||
      ascii === 45 ||
      ascii === 47
    ); // number . - /
    // we need to deal with the case there is a from / to
    if (previous === 46) this.i--;
    let indexOfDash = number.indexOf('-', 1);

    if (indexOfDash > -1) {
      return {
        from: parseNumberWithDivision(number.slice(0, indexOfDash)),
        to: parseNumberWithDivision(number.slice(indexOfDash + 1)),
      };
    }
    return { from: parseNumberWithDivision(number) };
  }

  getAtom(ascii) {
    let atom = '';
    do {
      atom += String.fromCharCode(ascii);
      this.i++;
      ascii = this.mf.charCodeAt(this.i);
    } while (ascii > 96 && ascii < 123);

    if (elementsObject[atom] || !this.expandGroups) {
      return [
        {
          kind: Kind.ATOM,
          value: atom,
        },
      ];
    }

    if (groupsObject[atom]) {
      const group = groupsObject[atom].mf;
      const expandedGroups = parse(group, {
        expandGroups: this.expandGroups,
      });
      // need to surround with parenthesis
      return [
        { kind: Kind.OPENING_PARENTHESIS, value: '(' },
        ...expandedGroups,
        { kind: Kind.CLOSING_PARENTHESIS, value: ')' },
      ];
    }
    throw new MFError(`Not able to expand group: ${this.mf}`);
  }

  getIsotope(ascii) {
    // [13C]
    let substring = '';
    do {
      substring += String.fromCharCode(ascii);
      this.i++;
      ascii = this.mf.charCodeAt(this.i);
    } while (ascii !== 93 && this.i <= this.mf.length);

    let atom = substring.replaceAll(/[^A-Za-z]/g, '');
    let isotope = Number(substring.replaceAll(/\D/g, ''));
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
    if (substring.match(/^[0-9.,]+$/)) {
      return substring.split(',').map(Number);
    }
    throw new MFError(
      this.mf,
      this.i,
      'Curly brackets should contain only number, dot and comma',
    );
  }

  getParenthesisCharge(ascii) {
    let substring = '';
    let begin = this.i;
    do {
      substring += String.fromCharCode(ascii);
      this.i++;
      ascii = this.mf.charCodeAt(this.i);
    } while (ascii !== 41 && this.i <= this.mf.length); // closing parenthesis
    if (substring.match(/^\([\d+-]+$/)) {
      return parseCharge(substring.slice(1));
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

function parseNumberWithDivision(string) {
  if (string.includes('/')) {
    let parts = string.split('/');
    if (parts.length !== 2) {
      throw new TypeError('Can not parse MF with number like: ', string);
    }
    return Number(parts[0]) / Number(parts[1]);
  } else {
    return Number(string);
  }
}

/**
 * Remove all the parenthesis and multipliers
 * Merge atoms and groups if present many times
 * We will also sort the atoms and groups
 * @param {*} parsed
 * @returns
 */
function simplify(parsed) {
  if (!parsed || parsed.length === 0) return [];

  const multipliers = [];
  let currentMultiplier = { from: 1, to: 1 };
  let newParsed = [];
  for (let i = parsed.length - 1; i >= 0; i--) {
    const item = parsed[i];
    switch (item.kind) {
      case 'atom':
      case 'isotope':
        {
          let realMultiplier = currentMultiplier;
          for (const multiplier of multipliers) {
            realMultiplier = {
              from: multiplier.from * realMultiplier.from,
              to: multiplier.to * realMultiplier.to,
            };
          }
          newParsed.push(
            {
              kind: item.kind,
              value: item.value,
            },
            {
              kind: 'multiplierRange',
              value: realMultiplier,
            },
          );
          currentMultiplier = { from: 1, to: 1 };
        }
        break;
      case 'multiplier':
        currentMultiplier = { from: item.value, to: item.value };
        break;
      case 'multiplierRange':
        currentMultiplier = item.value;
        break;
      case 'openingParenthesis':
        multipliers.pop();
        break;
      case 'closingParenthesis':
        multipliers.push(currentMultiplier);
        currentMultiplier = { from: 1, to: 1 };
        break;
      case 'text':
        break;
      default:
        throw new Error(
          `Unexpected kind --${item.kind}-- in removeParenthesis`,
        );
    }
  }

  // if we have many times the same atom / group, we can merge them
  const distinctParsedObject = {};
  for (let i = 0; i < newParsed.length; i = i + 2) {
    const item = newParsed[i];
    const multiplier = newParsed[i + 1];
    const key = JSON.stringify(item.value);
    if (!distinctParsedObject[key]) {
      distinctParsedObject[key] = {
        ...item,
        multiplier: multiplier.value,
      };
    } else {
      distinctParsedObject[key].multiplier.from += multiplier.value.from;
      distinctParsedObject[key].multiplier.to += multiplier.value.to;
    }
  }

  const sorted = Object.values(distinctParsedObject).sort((a, b) => {
    const atomA = a.kind === 'atom' ? a.value : a.value.atom;
    const atomB = b.kind === 'atom' ? b.value : b.value.atom;
    if (atomA === atomB) {
      if (a.kind === 'isotope' && b.kind === 'isotope') {
        return a.value.isotope - b.value.isotope;
      }
      if (a.kind === 'isotope' && b.kind !== 'isotope') {
        return -1; // isotope comes before non-isotope
      }
      if (a.kind !== 'isotope' && b.kind === 'isotope') {
        return 1; // non-isotope comes after isotope
      }
      return 0;
    }
    return atomSorter(atomA, atomB);
  });

  const distinctParsed = [];
  for (const item of sorted) {
    if (item.multiplier.from === 0 && item.multiplier.to === 0) {
      continue;
    }
    distinctParsed.push({
      kind: item.kind,
      value: item.value,
    });
    if (item.multiplier.from === 1 && item.multiplier.to === 1) {
      continue; // no need to add a multiplier
    }
    if (item.multiplier.from === item.multiplier.to) {
      distinctParsed.push({
        kind: 'multiplier',
        value: item.multiplier.from,
      });
    } else {
      distinctParsed.push({
        kind: 'multiplierRange',
        value: {
          from: item.multiplier.from,
          to: item.multiplier.to,
        },
      });
    }
  }

  return distinctParsed;
}

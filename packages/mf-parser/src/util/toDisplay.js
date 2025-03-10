import { Format } from '../Format';
import { Kind } from '../Kind';

import { formatCharge } from './formatCharge.js';

/**
 * Converts an array of mf elements to an array of formatting information
 * @param {object[]} lines of the parse method
 * @returns {{kind: string, value: string}[]}
 */

export function toDisplay(lines) {
  const special = specialCases(lines);
  if (special) return special;
  let results = [];
  let result = {};
  for (let line of lines) {
    switch (line.kind) {
      case Kind.MULTIPLIER:
        if (line.value !== 1) {
          result = {
            kind: Format.SUBSCRIPT,
            value: String(line.value),
          };
          results.push(result);
        }
        break;
      case Kind.MULTIPLIER_RANGE:
        result = {
          kind: Format.SUBSCRIPT,
          value: `${String(line.value.from)}-${line.value.to}`,
        };
        results.push(result);
        break;
      case Kind.CHARGE:
        if (result.kind === Format.SUBSCRIPT) {
          result.kind = Format.SUPERIMPOSE;
          result.over = formatCharge(line.value);
          result.under = result.value;
          result.value = undefined;
        } else {
          result = {
            kind: Format.SUPERSCRIPT,
            value: formatCharge(line.value),
          };
          results.push(result);
        }

        break;

      case Kind.ISOTOPE:
        result = {
          kind: Format.SUPERSCRIPT,
          value: line.value.isotope,
        };
        results.push(result);
        result = {
          kind: Format.TEXT,
          value: line.value.atom,
        };
        results.push(result);
        break;

      case Kind.ISOTOPE_RATIO:
        if (result.kind === Format.TEXT) {
          result.value += line.value.atom;
        } else {
          result = {
            kind: Format.TEXT,
            value: line.value.atom,
          };
          results.push(result);
        }
        result = {
          kind: Format.SUPERSCRIPT,
          value: `{${line.value.ratio.join(',')}}`,
        };
        results.push(result);
        break;
      case Kind.SALT:
        if (result.kind === Format.TEXT) {
          result.value += ' • ';
        } else {
          result = {
            kind: Format.TEXT,
            value: ' • ',
          };
          results.push(result);
        }
        break;
      default:
        if (result.kind === Format.TEXT) {
          result.value += line.value;
        } else {
          result = {
            kind: Format.TEXT,
            value: line.value,
          };
          results.push(result);
        }
    }
  }
  return results;
}

/**
 * Some special changes for specific cases
 * @param {} lines
 */
function specialCases(lines) {
  // (-)
  if (lines.length === 1 && lines[0].kind === Kind.CHARGE) {
    const charge = lines[0].value;
    if (charge === 0) return [];
    if (charge === 1) {
      return [
        { kind: Format.TEXT, value: '-e' },
        { kind: Format.SUPERSCRIPT, value: '-' },
      ];
    }
    if (charge === -1) {
      return [
        { kind: Format.TEXT, value: '+e' },
        { kind: Format.SUPERSCRIPT, value: '-' },
      ];
    }
    if (charge > 1) {
      return [
        { kind: Format.TEXT, value: `-${charge}e` },
        { kind: Format.SUPERSCRIPT, value: '-' },
      ];
    }
    if (charge < -1) {
      return [
        { kind: Format.TEXT, value: `+${-charge}e` },
        { kind: Format.SUPERSCRIPT, value: '-' },
      ];
    }
  }

  // (-)2, (-)-1, (+)2, (+)-1, (2+)2, (2+)-1, (2-)+1, (2-)-1
  if (
    lines.length === 2 &&
    lines[0].kind === Kind.CHARGE &&
    lines[1].kind === Kind.MULTIPLIER
  ) {
    const charge = lines[0].value;
    const nbElectrons = -lines[1].value * charge;
    const results = [];
    if (nbElectrons === 0) return [];
    if (nbElectrons === 1) {
      results.push({ kind: Format.TEXT, value: '+e' });
    }
    if (nbElectrons === -1) {
      results.push({ kind: Format.TEXT, value: '-e' });
    }
    if (nbElectrons > 1) {
      results.push({ kind: Format.TEXT, value: `+${nbElectrons}e` });
    }
    if (nbElectrons < -1) {
      results.push({ kind: Format.TEXT, value: `${nbElectrons}e` });
    }
    results.push({ kind: Format.SUPERSCRIPT, value: '-' });
    return results;
  }

  return undefined;
}

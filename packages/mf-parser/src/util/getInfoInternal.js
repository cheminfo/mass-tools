import {
  ELECTRON_MASS,
  unsaturationsObject as unsaturations,
  elementsAndIsotopesObject as elements,
  isotopesObject as isotopes,
} from 'chemical-elements';
import { groupsObject as groups } from 'chemical-groups';

import { Kind } from '../Kind';

import { getIsotopeRatioInfo } from './getIsotopeRatioInfo';
import { getNumberOfIsotopologues } from './getNumberOfIsotopologues';
import { partToAtoms } from './partToAtoms';
import { partToMF } from './partToMF';

/** @typedef {import('./getInfo.types').PartInfo} PartInfo */
/** @typedef {import('./getInfo.types').PartInfoWithParts} PartInfoWithParts */

/**
 *
 * @param {*} parts
 * @param {*} [options={}]
 * @returns {object|PartInfo|PartInfoWithParts}
 */
export function getInfoInternal(parts, options = {}) {
  let {
    customUnsaturations = {},
    emFieldName = 'monoisotopicMass',
    msemFieldName = 'observedMonoisotopicMass',
  } = options;
  if (parts.length === 0) return {};
  if (parts.length === 1) {
    let oneResult = getProcessedPart(parts[0], {
      customUnsaturations,
      emFieldName,
      msemFieldName,
    });
    oneResult.nbIsotopologues = getNumberOfIsotopologues(oneResult.atoms);
    return oneResult;
  }

  let result = { parts: [] };
  for (let part of parts) {
    result.parts.push(
      getProcessedPart(part, {
        customUnsaturations,
        emFieldName,
        msemFieldName,
      }),
    );
  }

  result[emFieldName] = 0;
  result.mass = 0;
  result.charge = 0;
  result.unsaturation = 0;
  result.atoms = {};
  result.mf = result.parts.map((a) => a.mf).join('.');
  for (const part of result.parts) {
    result.mass += part.mass;
    result[emFieldName] += part[emFieldName];
    result.charge += part.charge;
    result.unsaturation += part.unsaturation;
    for (const atom in part.atoms) {
      if (!result.atoms[atom]) {
        result.atoms[atom] = 0;
      }
      result.atoms[atom] += part.atoms[atom];
    }
  }
  result.nbIsotopologues = getNumberOfIsotopologues(result.atoms);
  return result;
}

function getProcessedPart(part, options) {
  let { customUnsaturations, emFieldName, msemFieldName } = options;

  /** @type {PartInfo} */
  let currentPart = {
    mass: 0,
    charge: 0,
    mf: '',
    atoms: partToAtoms(part),
  };
  currentPart[emFieldName] = 0;

  let unsaturation = 0;
  let validUnsaturation = true;
  currentPart.mf = partToMF(part);

  for (let line of part) {
    let currentElement = '';
    switch (line.kind) {
      case Kind.ATOM: {
        currentElement = line.value;
        let element = elements[line.value];

        // todo should we have a kind GROUP ?
        if (!element) {
          element = groups[line.value];
          if (!element) throw new Error(`Unknown element: ${line.value}`);
          if (!customUnsaturations[line.value]) {
            customUnsaturations[line.value] = element.unsaturation;
          }
        }
        if (!element) throw new Error(`Unknown element: ${line.value}`);
        currentPart[emFieldName] += element.monoisotopicMass * line.multiplier;
        currentPart.mass += element.mass * line.multiplier;
        break;
      }
      case Kind.ISOTOPE: {
        currentElement = line.value.atom;
        let isotope = isotopes[line.value.isotope + line.value.atom];
        if (!isotope) {
          throw new Error(
            `Unknown isotope: ${line.value.isotope}${line.value.atom}`,
          );
        }
        currentPart[emFieldName] += isotope.mass * line.multiplier;
        currentPart.mass += isotope.mass * line.multiplier;
        break;
      }
      case Kind.ISOTOPE_RATIO: {
        currentElement = line.value.atom;
        let isotopeRatioInfo = getIsotopeRatioInfo(line.value);
        currentPart[emFieldName] +=
          isotopeRatioInfo[emFieldName] * line.multiplier;
        currentPart.mass += isotopeRatioInfo.mass * line.multiplier;
        break;
      }
      case Kind.CHARGE:
        currentPart.charge = line.value;
        if (validUnsaturation) {
          unsaturation -= line.value;
        }
        break;
      default:
        throw new Error('Unimplemented Kind in getInfo', line.kind);
    }
    if (currentElement) {
      if (customUnsaturations[currentElement] !== undefined) {
        unsaturation += customUnsaturations[currentElement] * line.multiplier;
      } else if (unsaturations[currentElement] !== undefined) {
        unsaturation += unsaturations[currentElement] * line.multiplier;
      } else {
        validUnsaturation = false;
      }
    }
  }

  // need to calculate the observedMonoisotopicMass
  if (currentPart.charge) {
    currentPart[msemFieldName] =
      (currentPart[emFieldName] - currentPart.charge * ELECTRON_MASS) /
      Math.abs(currentPart.charge);
  }
  if (validUnsaturation) {
    currentPart.unsaturation = unsaturation / 2 + 1;
  }
  return currentPart;
}

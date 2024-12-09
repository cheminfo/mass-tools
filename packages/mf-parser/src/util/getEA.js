import {
  isotopesObject as isotopes,
  elementsObject as elements,
} from 'chemical-elements';
import { groupsObject as groups } from 'chemical-groups';

import { Kind } from '../Kind';

import { getIsotopeRatioInfo } from './getIsotopeRatioInfo';

/**
 * @param {*} parts
 */
export function getEA(parts) {
  let results = {};
  for (let part of parts) {
    for (let line of part) {
      switch (line.kind) {
        case Kind.ISOTOPE: {
          let isotope = isotopes[line.value.isotope + line.value.atom];
          if (!isotope) {
            throw new Error(
              `Unknown isotope: ${line.value.isotope}${line.value.atom}`,
            );
          }
          addMass(results, line.value.atom, isotope.mass * line.multiplier);
          break;
        }

        case Kind.ISOTOPE_RATIO: {
          let isotopeRatioInfo = getIsotopeRatioInfo(line.value);
          addMass(
            results,
            line.value.atom,
            isotopeRatioInfo.mass * line.multiplier,
          );
          break;
        }

        case Kind.ATOM: {
          let element = elements[line.value];
          if (!element) {
            element = groups[line.value];
            if (!element) throw new Error(`Unknown element: ${line.value}`);
            // need to explode group ????
          }
          addMass(results, line.value, element.mass * line.multiplier);
          break;
        }

        case Kind.CHARGE:
          break;
        default:
          throw new Error('partToMF unhandled Kind: ', line.kind);
      }
    }
  }

  let eas = [];
  let sum = 0;
  for (let key in results) {
    sum += results[key];
    eas.push({
      element: key,
      mass: results[key],
    });
  }

  for (const ea of eas) {
    ea.ratio = ea.mass / sum;
  }
  return eas;
}

function addMass(results, atom, mass) {
  if (!results[atom]) results[atom] = 0;
  results[atom] += mass;
}

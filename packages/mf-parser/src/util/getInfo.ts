import {
  ELECTRON_MASS,
  unsaturationsObject as unsaturations,
  elementsAndIsotopesObject as elements,
  isotopesObject as isotopes,
} from 'chemical-elements';
import { groupsObject as groups } from 'chemical-groups';

import { Kind } from '../Kind';

import type {
  GetInfoOptions,
  GetInfoOptionsAllowed,
  PartInfo,
  PartInfoWithParts,
} from './getInfo.types';
import { getIsotopeRatioInfo } from './getIsotopeRatioInfo';
import { partToAtoms } from './partToAtoms';
import { partToMF } from './partToMF';

export function getInfo<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(
  parts: Part[][],
  options?: GIO,
): PartInfo<GIO> | PartInfoWithParts<GIO> {
  const {
    customUnsaturations = {},
    emFieldName = 'monoisotopicMass',
    msemFieldName = 'observedMonoisotopicMass',
  } = options ?? {};

  if (parts.length === 1) {
    return getProcessedPart(parts[0], {
      customUnsaturations,
      emFieldName,
      msemFieldName,
    }) as PartInfo<GIO>;
  }

  const result: PartInfoWithParts<GIO> = {
    [emFieldName]: 0,
    mass: 0,
    charge: 0,
    unsaturation: 0,
    atoms: {},
    mf: '',
    parts: [],
  } as PartInfoWithParts<GIO>;

  for (const rawPart of parts) {
    const part = getProcessedPart(rawPart, {
      customUnsaturations,
      emFieldName,
      msemFieldName,
    }) as PartInfo<GIO>;

    result.parts.push(part);

    result.mass += part.mass;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    result[emFieldName] += part[emFieldName];
    result.charge += part.charge;
    result.unsaturation += part.unsaturation ?? 0;

    for (const atom in part.atoms) {
      if (!result.atoms[atom]) {
        // @ts-expect-error ts restrict indexing on read
        result.atoms[atom] = 0;
      }
      // @ts-expect-error ts restrict indexing on read
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      result.atoms[atom] += part.atoms[atom];
    }
  }

  // @ts-expect-error ts consider `result.mf` could be never
  result.mf = result.parts.map((a) => a.mf).join('.');

  if (result.parts.length === 0) {
    // eslint-disable-next-line no-shadow
    const { parts, ...trimmedResult } = result;

    return trimmedResult as PartInfo<GIO>;
  }

  return result;
}

interface AtomPart {
  kind: (typeof Kind)['ATOM'];
  value: string;
  multiplier: number;
}

interface IsotopePart {
  kind: (typeof Kind)['ISOTOPE'];
  value: { atom: string; isotope: number };
  multiplier: number;
}

interface IsotopeRatioPart {
  kind: (typeof Kind)['ISOTOPE_RATIO'];
  value: { atom: string; ratio: number[] };
  multiplier: number;
}

interface ChargePart {
  kind: (typeof Kind)['CHARGE'];
  value: number;
}

type Part = AtomPart | IsotopePart | IsotopeRatioPart | ChargePart;

function getProcessedPart<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(
  part: Part[],
  options: Required<GIO>,
): PartInfo<GIO> {
  const { emFieldName, msemFieldName } = options;
  const customUnsaturations = options.customUnsaturations ?? {};

  const currentPart = {
    mass: 0,
    charge: 0,
    mf: '',
    atoms: partToAtoms(part),
    [emFieldName as string]: 0,
  } as PartInfo<GIO>;

  let unsaturation = 0;
  let validUnsaturation = true;
  currentPart.mf = partToMF(part);

  for (const line of part) {
    let currentElement = '';
    switch (line.kind) {
      case Kind.ATOM: {
        currentElement = line.value;
        let element = elements[line.value];

        // todo should we have a kind GROUP ?
        if (!element) {
          element = groups[line.value];
          if (!element) throw new Error(`Unknown element: ${line.value}`);
          if (!customUnsaturations?.[line.value] && 'unsaturation' in element) {
            customUnsaturations[line.value] = element.unsaturation;
          }
        }

        if (!element) throw new Error(`Unknown element: ${line.value}`);

        // @ts-expect-error indexable only for reading
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        currentPart[emFieldName] +=
          (element.monoisotopicMass ?? 0) * line.multiplier;
        currentPart.mass += (element.mass ?? 0) * line.multiplier;
        break;
      }
      case Kind.ISOTOPE: {
        currentElement = line.value.atom;
        const isotope = isotopes[`${line.value.isotope}${line.value.atom}`];
        if (!isotope) {
          throw new Error(
            `Unknown isotope: ${line.value.isotope}${line.value.atom}`,
          );
        }

        // @ts-expect-error indexable only for reading
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        currentPart[emFieldName] += isotope.mass * line.multiplier;
        currentPart.mass += isotope.mass * line.multiplier;
        break;
      }
      case Kind.ISOTOPE_RATIO: {
        currentElement = line.value.atom;
        const isotopeRatioInfo = getIsotopeRatioInfo(line.value);

        // @ts-expect-error indexable only for reading
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        currentPart[emFieldName] +=
          isotopeRatioInfo.monoisotopicMass * line.multiplier;
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
        throw new Error('Unimplemented Kind in getInfo', { cause: line });
    }

    if (currentElement) {
      const hasMultiplier = 'multiplier' in line;
      if (customUnsaturations[currentElement] !== undefined && hasMultiplier) {
        unsaturation += customUnsaturations[currentElement] * line.multiplier;
      } else if (unsaturations[currentElement] !== undefined && hasMultiplier) {
        unsaturation += (unsaturations[currentElement] ?? 0) * line.multiplier;
      } else {
        validUnsaturation = false;
      }
    }
  }

  // need to calculate the observedMonoisotopicMass
  if (currentPart.charge) {
    // @ts-expect-error indexable only for reading
    currentPart[msemFieldName] =
      // @ts-expect-error indexable only for reading
      (currentPart[emFieldName] - currentPart.charge * ELECTRON_MASS) /
      Math.abs(currentPart.charge);
  }
  if (validUnsaturation) {
    currentPart.unsaturation = unsaturation / 2 + 1;
  }
  return currentPart;
}

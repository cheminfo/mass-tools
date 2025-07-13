import { fragment } from 'mass-fragmentation';
import { msemMatcher } from 'mf-matcher';
import { MF } from 'mf-parser';
import { preprocessIonizations } from 'mf-utilities';

/** * Generates a database 'monoisotopic' from a monoisotopic mass and various options
 * @param {{smiles?:string,molecule?:string,idCode?:string}[]}    entries - Array of object containing a property to recreate the molecule
 * @param {typeof import('openchemlib')} OCL - The OCL library
 * @param {object}    [options={}]
 * @param {function}  [options.onStep] - Callback to do after each step
 * @param {boolean}   [options.allowNeutral=true]
 * @param {string}    [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number}    [options.precision=100] - Allowed mass range based on precision
 * @param {boolean}   [options.groupResults=false] - Should we group the results if they have the same monoisotopic mass and experimental mass
 * @param {object}    [options.fragmentation={}]
 * @param {object}    [options.fragmentation.acyclic=false]
 * @param {object}    [options.fragmentation.cyclic=false]
 * @param {object}    [options.fragmentation.full=true]
 * @param {import('mf-matcher').MSEMFilterOptions}        [options.filter={}]
 * @returns {Promise}
 */
export async function fromMolecules(entries, OCL, options = {}) {
  let {
    onStep,
    ionizations,
    filter,
    fragmentation = { acyclic: false, cyclic: false, full: true },
    groupResults = false,
  } = options;

  ionizations = preprocessIonizations(ionizations);
  let results = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const molecule = getMolecule(entry, OCL);
    if (!molecule) continue;

    const { acyclic = false, cyclic = false, full = true } = fragmentation;

    const allFragments = fragment(molecule, {
      acyclic,
      cyclic,
      full,
    });

    for (const oneFragment of allFragments) {
      appendResults(results, oneFragment, {
        entry,
        ionizations,
        filter,
      });
      if (onStep) onStep(i);
    }
  }

  if (groupResults) {
    results = groupFragmentationResults(results);
  }
  return results.sort((a, b) => a.em - b.em);
}

/**
 * We could group the results and replace the property 'fragment' by 'fragments'
 * @param {*} results
 */
function groupFragmentationResults(results) {
  const sortedResults = results.slice().sort((a, b) => {
    if (a.em !== b.em) {
      return a.em - b.em;
    }
    if (a.ms.em !== b.ms.em) {
      return a.ms.em - b.ms.em;
    }
    if (a.fragment.idCode < b.fragment.idCode) return -1;
    return 1;
  });
  const groupedResults = [];
  let currentResult = {};
  for (let result of sortedResults) {
    if (
      result.em !== currentResult.em ||
      result.ms.em !== currentResult.ms.em
    ) {
      currentResult = { ...result };
      currentResult.fragments = [
        {
          idCode: result.fragment.idCode,
          type: result.fragment.type,
          count: 1,
          parents: [{ ...result.fragment.parent, count: 1 }],
        },
      ];
      delete currentResult.fragment;
      groupedResults.push(currentResult);
    } else {
      const lastFragment = currentResult.fragments.at(-1);
      if (lastFragment.idCode === result.fragment.idCode) {
        lastFragment.count++;
        if (
          lastFragment.parents.at(-1).idCode === result.fragment.parent.idCode
        ) {
          lastFragment.parents.at(-1).count++;
        } else {
          lastFragment.parents.push({ ...result.fragment.parent, count: 1 });
        }
      } else {
        currentResult.fragments.push({
          idCode: result.fragment.idCode,
          type: result.fragment.type,
          count: 1,
          parents: [{ ...result.fragment.parent, count: 1 }],
        });
      }
    }
  }
  for (let group of groupedResults) {
    group.fragments = group.fragments.sort((a, b) => b.count - a.count);
  }
  return groupedResults;
}

/**
 *
 * @param {object} entry
 * @param {typeof import('openchemlib')} OCL - The OCL library
 */
function getMolecule(entry, OCL) {
  if (entry.idCode) {
    return OCL.Molecule.fromIDCode(entry.idCode);
  }
  if (entry.ocl && entry.ocl.idCode) {
    return OCL.Molecule.fromIDCode(entry.ocl.idCode);
  }
  if (entry.smiles) {
    return OCL.Molecule.fromSmiles(entry.smiles);
  }
  if (entry.molfile) {
    return OCL.Molecule.fromMolfile(entry.molfile);
  }
  return undefined;
}

function appendResults(results, oneFragment, options) {
  const mf = oneFragment.mfInfo.mf;
  const { ionizations, filter, entry } = options;
  const mfInfo = new MF(mf).getInfo();
  for (let ionization of ionizations) {
    const result = {
      charge: mfInfo.charge,
      em: mfInfo.monoisotopicMass,
      mw: mfInfo.mass,
      mf: mfInfo.mf,
      ionization,
      unsaturation: mfInfo.unsaturation,
      atoms: mfInfo.atoms,
      fragment: {
        parent: {
          ...entry,
          idCode: oneFragment.parentIDCode,
        },
        idCode: oneFragment.idCode,
        type: oneFragment.fragmentType,
      },
    };

    let match = msemMatcher(result, filter);
    if (!match) continue;
    result.ms = match.ms;
    result.ionization = match.ionization;

    results.push(result);
  }
}

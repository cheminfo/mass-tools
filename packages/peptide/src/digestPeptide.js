import { getCombinationsIterator } from 'ml-spectra-processing';

/**
 * Digest a peptide sequence using a specified enzyme.
 * @param {string} sequence - The peptide sequence to digest.
 * @param {object} [options={}] - Digestion options.
 * @param {string} options.enzyme - The enzyme to use for digestion. Required. Supported values: 'chymotrypsin', 'trypsin', 'lysc', 'glucph4', 'glucph8', 'thermolysin', 'cyanogenbromide', 'any'.
 * @param {number} [options.minMissed=0] - Minimum number of missed cleavages.
 * @param {number} [options.maxMissed=0] - Maximum number of missed cleavages.
 * @param {number} [options.minResidue=0] - Minimum number of residues in a fragment.
 * @param {number} [options.maxResidue=Infinity] - Maximum number of residues in a fragment.
 * @param {number} [options.minDigestions=0] - Minimum number of cleavage sites to use. Generates all combinations with at least this many cleavages. Defaults to `0`.
 * @param {number} [options.maxDigestions=Infinity] - Maximum number of cleavage sites to use. Generates all combinations with at most this many cleavages. Defaults to `Infinity`.
 * @returns {string[]} Array of digested peptide fragments.
 */
export function digestPeptide(sequence, options = {}) {
  const {
    enzyme,
    minMissed = 0,
    maxMissed = 0,
    minResidue = 0,
    maxResidue = Number.MAX_VALUE,
    minDigestions = 0,
    maxDigestions = Number.MAX_VALUE,
  } = options;

  if (!enzyme) {
    return [];
  }

  sequence = sequence.replace(/^H([^a-z])/, '$1').replace(/OH$/, '');
  let regexp = getRegexp(enzyme);
  let allFragments = sequence.replace(regexp, '$1 ').split(/ /).filter(Boolean);

  const numCleavages = allFragments.length - 1;

  // Return empty if minDigestions is impossible to achieve
  if (minDigestions > numCleavages) {
    return [];
  }

  const effectiveMaxDigestions = Math.min(maxDigestions, numCleavages);
  const effectiveMinDigestions = minDigestions;

  if (effectiveMinDigestions > effectiveMaxDigestions) {
    return [];
  }

  // Determine if we need combinatorial approach
  // Use combinatorial logic when maxDigestions explicitly limits cleavages OR minDigestions > 0
  const useCombinatorial = maxDigestions < numCleavages || minDigestions > 0;

  // When using combinatorial due to maxDigestions limit, ensure at least 1 cleavage
  const startDigestions = useCombinatorial
    ? Math.max(1, effectiveMinDigestions)
    : effectiveMinDigestions;

  if (!useCombinatorial) {
    // Default behavior: use all available cleavage sites
    const results = [];
    const fragments = [];
    let fragmentStart = 0;
    for (let i = 0; i < allFragments.length; i++) {
      let nbResidue = allFragments[i]
        .replaceAll(/([A-Z][a-z]{2})/g, ' $1')
        .split(/ /)
        .filter(Boolean).length;
      fragments.push({
        sequence: allFragments[i],
        nbResidue,
        from: fragmentStart,
        to: fragmentStart + nbResidue - 1,
      });
      fragmentStart += nbResidue;
    }

    for (let i = 0; i < fragments.length - minMissed; i++) {
      for (
        let j = minMissed;
        j <= Math.min(maxMissed, fragments.length - i - 1);
        j++
      ) {
        let fragment = '';
        let nbResidue = 0;
        for (let k = i; k <= i + j; k++) {
          fragment += fragments[k].sequence;
          nbResidue += fragments[k].nbResidue;
        }
        let from = fragments[i].from + 1;
        let to = fragments[i + j].to + 1;
        if (fragment && nbResidue >= minResidue && nbResidue <= maxResidue) {
          results.push(`H${fragment}OH$D${from}>${to}`);
        }
      }
    }
    return results;
  }

  // Combinatorial approach: generate all combinations of cleavage sites
  const allResults = new Set();
  for (
    let numDigestions = startDigestions;
    numDigestions <= effectiveMaxDigestions;
    numDigestions++
  ) {
    const combinations = getCombinationsIterator(numCleavages, numDigestions);

    for (const cleavageSites of combinations) {
      // Create fragments based on selected cleavage sites
      const fragments = createFragmentsFromCleavages(
        allFragments,
        cleavageSites,
      );

      // Generate results with missed cleavages
      for (let i = 0; i < fragments.length - minMissed; i++) {
        for (
          let j = minMissed;
          j <= Math.min(maxMissed, fragments.length - i - 1);
          j++
        ) {
          let fragment = '';
          let nbResidue = 0;
          for (let k = i; k <= i + j; k++) {
            fragment += fragments[k].sequence;
            nbResidue += fragments[k].nbResidue;
          }
          let from = fragments[i].from + 1;
          let to = fragments[i + j].to + 1;
          if (fragment && nbResidue >= minResidue && nbResidue <= maxResidue) {
            allResults.add(`H${fragment}OH$D${from}>${to}`);
          }
        }
      }
    }
  }

  return [...allResults];
}

/**
 * Create fragments from selected cleavage sites.
 * @param {string[]} allFragments - All possible fragments if all sites were cleaved.
 * @param {number[]} cleavageSites - Indices of cleavage sites to use.
 * @returns {Array<{sequence: string, nbResidue: number, from: number, to: number}>} Fragment objects.
 */
function createFragmentsFromCleavages(allFragments, cleavageSites) {
  const fragments = [];
  const cleavageSet = new Set(cleavageSites);

  let currentFragment = '';
  let fragmentStartIndex = 0;

  for (let i = 0; i < allFragments.length; i++) {
    currentFragment += allFragments[i];

    // If this is a cleavage site or the last fragment, close the current fragment
    if (cleavageSet.has(i) || i === allFragments.length - 1) {
      const nbResidue = currentFragment
        .replaceAll(/([A-Z][a-z]{2})/g, ' $1')
        .split(/ /)
        .filter(Boolean).length;

      const from = fragmentStartIndex;
      const to = from + nbResidue - 1;

      fragments.push({
        sequence: currentFragment,
        nbResidue,
        from,
        to,
      });

      fragmentStartIndex = to + 1;
      currentFragment = '';
    }
  }

  return fragments;
}

function getRegexp(enzyme) {
  switch (enzyme.toLowerCase().replaceAll(/[^\da-z]/g, '')) {
    case 'chymotrypsin':
      return /(Phe|Tyr|Trp)(?!Pro)/g;
    case 'trypsin':
      return /(Lys|Arg)(?!Pro)/g;
    case 'lysc':
      return /(Lys)(?!Pro)/g;
    case 'glucph4':
      return /(Glu)(?!Pro|Glu)/g;
    case 'glucph8':
      return /(Asp|Glu)(?!Pro|Glu)/g;
    case 'thermolysin': // N-term of  Leu, Phe, Val, Ile, Ala, Met
      return /()(?=Ile|Leu|Val|Ala|Met|Phe)/g;
    case 'cyanogenbromide':
      return /(Met)/g;
    case 'any':
      return /()(?=[A-Z][a-z]{2})/g;
    default:
      throw new Error(`Digestion enzyme: ${enzyme} is unknown`);
  }
}

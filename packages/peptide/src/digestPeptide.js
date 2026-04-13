/**
 * Digest a peptide sequence using a specified enzyme.
 * @param {string} sequence - The peptide sequence to digest.
 * @param {object} [options={}] - Digestion options.
 * @param {string} [options.enzyme='trypsin'] - The enzyme to use for digestion. Supported values: 'chymotrypsin', 'trypsin', 'lysc', 'glucph4', 'glucph8', 'thermolysin', 'cyanogenbromide', 'any'.
 * @param {number} [options.minMissed=0] - Minimum number of missed cleavages.
 * @param {number} [options.maxMissed=0] - Maximum number of missed cleavages.
 * @param {number} [options.minResidue=0] - Minimum number of residues in a fragment.
 * @param {number} [options.maxResidue=Infinity] - Maximum number of residues in a fragment.
 * @returns {string[]} Array of digested peptide fragments.
 */
export function digestPeptide(sequence, options = {}) {
  const {
    enzyme = 'trypsin',
    minMissed = 0,
    maxMissed = 0,
    minResidue = 0,
    maxResidue = Number.MAX_VALUE,
  } = options;

  sequence = sequence.replace(/^H([^a-z])/, '$1').replace(/OH$/, '');
  let regexp = getRegexp(enzyme);
  let fragments = sequence.replace(regexp, '$1 ').split(/ /).filter(Boolean);

  {
    let from = 0;
    for (let i = 0; i < fragments.length; i++) {
      let nbResidue = fragments[i]
        .replaceAll(/([A-Z][a-z]{2})/g, ' $1')
        .split(/ /)
        .filter(Boolean).length;
      fragments[i] = {
        sequence: fragments[i],
        nbResidue,
        from,
        to: from + nbResidue - 1,
      };
      from += nbResidue;
    }
  }

  let results = [];

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

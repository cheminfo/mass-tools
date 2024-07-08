/*
Iotuibs:
* minMissed (default: 0)
* maxMissed (default: 0)
* minResidue: 0;
* maxResidue: infinity
* enzyme: chymotrypsin, trypsin, glucph4, glucph8, thermolysin, cyanogenbromide : Mandatory, no default value !
 */

export function digestPeptide(sequence, options = {}) {
  sequence = sequence.replace(/^H([^a-z])/, '$1').replace(/OH$/, '');
  options.enzyme = options.enzyme || 'trypsin';
  if (options.minMissed === undefined) options.minMissed = 0;
  if (options.maxMissed === undefined) options.maxMissed = 0;
  if (options.minResidue === undefined) options.minResidue = 0;
  if (options.maxResidue === undefined) options.maxResidue = Number.MAX_VALUE;
  let regexp = getRegexp(options.enzyme);
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

  for (let i = 0; i < fragments.length - options.minMissed; i++) {
    for (
      let j = options.minMissed;
      j <= Math.min(options.maxMissed, fragments.length - i - 1);
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
      if (
        fragment &&
        nbResidue >= options.minResidue &&
        nbResidue <= options.maxResidue
      ) {
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

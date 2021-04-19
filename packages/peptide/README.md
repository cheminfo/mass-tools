# peptide

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

Peptide

## Amino acids

#### getInfo()

Returns an array of information about amino acids

## Amino acids sequence

#### sequenceToMF(sequence)

Previously convertAASequence(sequence) (deprecated)

Returns a peptidic sequence from a PDB or one letter code to the internal molecular formula format

**Arguments**

- `sequence` - string with the amino acids sequence

#### chargePeptide(mf, options)

Charge the peptide at a specific pH. 'mf' is either a 3 letter peptide sequence or an array of peptide sequences.

**Arguments**

- `mf` - string with a molecular formula to charge
- options:
- pH : you may specify the pH to calculate the protonation state. By default: 0,
  it has the consequence to add a positive charge on Arg, His and Lys.

#### allowNeutralLoss(mf, options)

Allow neutral loss :

- H2O for S, T, E, D residues
- NH3 for R, K, Q, N residues

The residues may not be modified.

**Arguments**

- `mf` - string with a molecular formula to charge

#### generatePeptideFragments(mf, [options])

Generate [peptide fragmentation](http://en.wikipedia.org/wiki/Peptide_sequence_tag).
Returns an array of molecular formulas with the different fragments.

**Arguments**

- `mf` - string with the molecular formula
- `options` - object with requested fragments. Default: `{a:false, b:true, c:false, x:false, y:true, z:false, i:false}`

You can also specify internal fragments using the options 'ya', 'yb', 'yc' and 'zc' as well as the minimal length of internal fragments 'minInternal'
and the maximal length of internal fragments 'maxInternal'

## Isoelectric Point

pKa of amino acids is based on https://en.wikipedia.org/wiki/Amino_acid.

#### calculateCharge(sequence, ph)

Calculate the charge for a specific amino acid sequence. The sequence should be entered in the form "HAlaGlyOH".
Please take care about the N and C terminal end. You may use the methods "convertAASequence" to create such a sequence
from other format.

**Arguments**

- `sequence` - string with the amino acids sequence
- `ph` - ph for which to calculate the charge. Default: 7.0

#### splitPeptide(sequence)

Split a 3 letter code sequence respecting uppercase, lowercase in an array of residu.

**Arguments**

- `sequence` - string with the amino acids sequence

#### digestPeptide(sequence, options)

Allows to digest virtually a peptide

**Arguments**

- `sequence` - string with the amino acids sequence
- `options`
  - `minMissed` - minimal missed cleavage (default: 0)
  - `maxMissed` - maximal missed cleavage (default: 0)
  - `minResidue` - minimal number of residues (default: 0)
  - `maxResidue` - maximal number of residues (default: infinity)
  - `enzyme` - enzyme used for digestion
    - chymotrypsin : (Phe|Tyr|Trp)(?!Pro)
    - trypsin : (Lys|Arg)(?!Pro)
    - lysc : (Lys)(?!Pro)
    - glucph4 : (Glu)(?!Pro|Glu)
    - glucph8 : (Asp|Glu)(?!Pro|Glu)
    - thermolysin : (Leu|Ile|Met|Phe|Trp)
    - cyanogenbromide : (Met)

#### calculateIEP(sequence)

Calculate the isoelectric point for a specific amino acid sequence. The sequence should be entered in the form "HAlaGlyOH".
Please take care about the N and C terminal end. You may use the methods "convertAASequence" to create such a sequence
from other format.

**Arguments**

- `sequence` - string with the amino acids sequence

#### calculateIEPChart(sequence)

Returns an object containing the y and yAbs array of the charge of the peptide for a pH that goes from 0 to 14.

**Arguments**

- `sequence` - string with the amino acids sequence

#### getColorForIEP(iep)

Returns a color based on the isoelectric point :

- 0 -> 7 means that at pH 7 it is charged negatively (blue)
- 7 -> 14 means that at pH7 it is charged positively (red)

**Arguments**

- `iep` - the value of the isoelectric point

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/peptide.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/peptide
[travis-image]: https://img.shields.io/travis/cheminfo-js/peptide/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/peptide
[david-image]: https://img.shields.io/david/cheminfo-js/peptide.svg?style=flat-square
[david-url]: https://david-dm.org/cheminfo-js/peptide
[download-image]: https://img.shields.io/npm/dm/peptide.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/peptide

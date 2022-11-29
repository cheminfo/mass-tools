import {
  digestPeptide,
  chargePeptide,
  allowNeutralLoss,
  sequenceToMF,
  generatePeptideFragments,
} from 'peptide';

export function fragmentPeptide(sequence, options = {}) {
  const { digestion = {}, protonation, fragmentation, protonationPH } = options;
  sequence = sequenceToMF(sequence);

  let fragmentsArray = [sequence];
  // do we also have some digest fragments ?
  if (digestion.enzyme) {
    let digests = digestPeptide(sequence, digestion);
    if (options.protonation) {
      digests = chargePeptide(digests, {
        pH: options.protonationPH,
      });
    }
    fragmentsArray = fragmentsArray.concat(digests);
  }

  // allow neutral loss
  if (options.allowNeutralLoss) {
    sequence = allowNeutralLoss(sequence);
  }

  // apply protonation
  if (protonation) {
    sequence = chargePeptide(sequence, { pH: protonationPH });
  }

  // calculate fragmentation
  let fragments = generatePeptideFragments(sequence, fragmentation);

  fragmentsArray = fragmentsArray.concat(fragments);
  return fragmentsArray;
}

'use strict';

const peptide = require('peptide');

function fragmentArray(sequence, options = {}) {
  const {
    digestion = {},
    protonation,
    fragmentation,
    protonationPH,
    allowNeutralLoss,
  } = options;
  sequence = peptide.convertAASequence(sequence);

  let fragmentsArray = [sequence];
  // do we also have some digest fragments ?
  if (digestion.enzyme) {
    let digests = peptide.digestPeptide(sequence, digestion);
    if (options.protonation) {
      digests = peptide.chargePeptide(digests, {
        pH: options.protonationPH,
      });
    }
    fragmentsArray = fragmentsArray.concat(digests);
  }

  // allow neutral loss
  if (allowNeutralLoss) {
    sequence = peptide.allowNeutralLoss(sequence);
  }

  // apply protonation
  if (protonation) {
    sequence = peptide.chargePeptide(sequence, { pH: protonationPH });
  }

  // calculate fragmentation
  let fragments = peptide.generatePeptideFragments(sequence, fragmentation);
  fragmentsArray = fragmentsArray.concat(fragments);
  return fragmentsArray;
}

module.exports = fragmentArray;

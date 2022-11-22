import { mfDiff } from 'mf-utilities/src/mfDiff';

const mfLosses = {};
['Amp', 'Tmp', 'Cmp', 'Gmp', 'Ump'].forEach((nucleotide) => {
  mfLosses[nucleotide] = {
    code: nucleotide.charAt(0),
    diff: mfDiff('Rmp', nucleotide),
  };
});

['Damp', 'Dtmp', 'Dcmp', 'Dgmp', 'Dump'].forEach((nucleotide) => {
  mfLosses[nucleotide] = {
    code: nucleotide.charAt(1).toUpperCase(),
    diff: mfDiff('Drmp', nucleotide),
  };
});

export function baseLoss(nucleotide) {
  // any residue can loose a base
  let results = [];

  for (let key in mfLosses) {
    const base = mfLosses[key];
    if (nucleotide.includes(key)) {
      results.push(`${nucleotide}(${base.diff})$${base.code}*`);
    }
  }

  return results;
}

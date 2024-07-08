import { mfDiff } from 'mf-utilities';

const mfLosses = {};
for (const nucleotide of ['Amp', 'Tmp', 'Cmp', 'Gmp', 'Ump']) {
  mfLosses[nucleotide] = {
    code: nucleotide.charAt(0),
    diff: mfDiff('Rmp', nucleotide),
  };
}

for (const nucleotide of ['Damp', 'Dtmp', 'Dcmp', 'Dgmp', 'Dump']) {
  mfLosses[nucleotide] = {
    code: nucleotide.charAt(1).toUpperCase(),
    diff: mfDiff('Drmp', nucleotide),
  };
}

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

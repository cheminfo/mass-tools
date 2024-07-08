export function baseLossExhaustive(nucleotide) {
  // any residue can loose a base
  let results = [];
  let parts = nucleotide
    .replaceAll(' ', '')
    .replaceAll(/([\d)A-Za-z])(?=[A-Z])/g, '$1 ')
    .split(/ /);
  let counter = 0;
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    let middle = '';
    if (part.match(/^D[acgtu]mp$/)) {
      middle = 'Drmp';
      counter++;
    } else if (part.match(/^[ACGTU]mp$/)) {
      middle = 'Rmp';
      counter++;
    } else {
      continue;
    }
    let begin = parts.slice(0, i);
    let end = parts.slice(i + 1);

    results.push(`${begin.join('') + middle + end.join('')}$-B${counter}`);
  }

  return results;
}

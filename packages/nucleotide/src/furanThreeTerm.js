export function furanThreeTerm(nucleotide) {
  // last residue should become a furan
  let parts = nucleotide
    .replaceAll(' ', '')
    .replaceAll(/([\d)a-z])([A-Z][a-z](?=[a-z]))/g, '$1 $2')
    .split(/ /);
  let last = parts.pop();
  if (!last.match(/D[acgt]mp(.*)$/)) {
    // eslint-disable-next-line no-console
    console.warn(
      `furanThreeTerm can not remove a non monophosphate nucleic acid: ${last}`,
    );
    return parts.join('') + last;
  }
  return parts.join('') + last.replace(/D[acgt]mp(.*)$/, 'Furp');
}

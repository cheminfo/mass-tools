export function furanThreeTerm(nucleotide) {
  // last residue should become a furan
  let parts = nucleotide
    .replace(/ /g, '')
    .replace(/(?<t1>[a-z)0-9])(?<t2>[A-Z][a-z](?=[a-z]))/g, '$<t1> $<t2>')
    .split(/ /);
  let last = parts.pop();
  if (!last.match(/D[atcg]mp(?<t1>.*)$/)) {
    // eslint-disable-next-line no-console
    console.warn(
      `furanThreeTerm can not remove a non monophosphate nucleic acid: ${last}`,
    );
    return parts.join('') + last;
  }
  return parts.join('') + last.replace(/D[atcg]mp(?<t1>.*)$/, 'Furp');
}

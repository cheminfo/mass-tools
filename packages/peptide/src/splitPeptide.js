export function splitPeptide(sequence) {
  let aas = sequence.replace(/(?<t1>[A-Z])/g, ' $<t1>').split(/ /);
  let begin = 0;
  while (aas[begin] === '' || aas[begin] === 'H') {
    begin++;
  }
  let end = aas.length - 1;
  while (aas[end] === 'O' || aas[end] === 'H') {
    end--;
  }
  aas = aas.slice(begin, end + 1);
  return aas;
}

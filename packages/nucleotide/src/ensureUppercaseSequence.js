/**
 * Ensure that the sequence is in uppercase taking into account possible modifications
 * @param {string} [options.circular=false]
 */

export function ensureUppercaseSequence(sequence) {
  let parenthesisCounter = 0;
  let parts = [];
  let part = '';
  for (let i = 0; i < sequence.length; i++) {
    let currentSymbol = sequence[i];

    if (currentSymbol === '(' && parenthesisCounter === 0 && part) {
      parts.push(part);
      part = currentSymbol;
    } else if (currentSymbol === ')' && parenthesisCounter === 0) {
      part += currentSymbol;
      parts.push(part);
      part = '';
    } else {
      part += currentSymbol;
    }
  }
  if (part) parts.push(part);
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].startsWith('(') && parts[i].match(/^[a-z]+$/)) {
      parts[i] = parts[i].toUpperCase();
    }
  }
  return parts.join('');
}

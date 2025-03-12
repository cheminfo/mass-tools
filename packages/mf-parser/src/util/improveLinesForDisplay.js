import { Kind } from '../Kind.js';

/**
 * We try to remove useless lines that are not needed for the display and could be confusing
 * for the user
 * @param {object[]} lines
 */
export function improveLinesForDisplay(lines) {
  lines = lines.slice(0);

  // multipliers by one seems completely useless
  lines = lines.filter(
    (line) => !(line.kind === Kind.MULTIPLIER && line.value === 1),
  );
  // global surrouding useless parenthesis
  // (C) -> C, (CH2) -> CH2, ((CH2)) -> CH2, ((CH2)2) -> (CH2)2, (C(CH2)2) -> C(CH2)2
  // need to count the number of opening parenthesis
  // and check the minimum number of parenthesis we find
  let beginCounter = 0;
  let endCounter = 0;
  let minCounter = Number.MAX_SAFE_INTEGER;
  let counter = 0;
  let begin = true;
  for (let line of lines) {
    switch (line.kind) {
      case Kind.OPENING_PARENTHESIS:
        if (begin) {
          beginCounter++;
        }
        counter++;
        break;
      case Kind.CLOSING_PARENTHESIS:
        endCounter++;
        counter--;
        break;
      case Kind.CHARGE: // seems to me we can still remove parenthesis even if we have some charges
        break;
      default:
        if (counter < minCounter) minCounter = counter;
        endCounter = 0;
        begin = false;
    }
  }
  let nbParenthesisToSuppress = Math.min(minCounter, beginCounter, endCounter);
  if (nbParenthesisToSuppress > 0) {
    // need to remove from the beginning and from the end the number of parenthesis
    // knowing some of the lines could be charges
    let toSuppress = nbParenthesisToSuppress;
    let i = 0;
    while (toSuppress > 0) {
      if (lines[0].kind === Kind.OPENING_PARENTHESIS) {
        lines.splice(i, 1);
        toSuppress--;
      } else {
        i++;
      }
    }
    toSuppress = nbParenthesisToSuppress;
    i = lines.length - 1;
    while (toSuppress > 0) {
      if (lines[i].kind === Kind.CLOSING_PARENTHESIS) {
        toSuppress--;
        lines.splice(i, 1);
      }
      i--;
    }
  }

  return lines;
}

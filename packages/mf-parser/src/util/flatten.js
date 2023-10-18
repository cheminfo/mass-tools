export function flatten(parsed, options = {}) {
  const { groupIdentical = false, limit = 100000 } = options;
  if (parsed.length === 0) return [''];

  let parts = [];
  let parenthesisLevel = 0;
  let currentPart;
  let comments = [];

  for (const entry of parsed) {
    if (
      (entry.kind === 'atom' ||
        entry.kind === 'isotope' ||
        entry.kind === 'openingParenthesis' ||
        !currentPart) &&
      parenthesisLevel === 0
    ) {
      currentPart = {
        mf: '',
        min: 1,
        max: 1,
      };
      parts.push(currentPart);
    }
    switch (entry.kind) {
      case 'atom':
        currentPart.mf += entry.value;
        break;
      case 'isotope':
        currentPart.mf += `[${entry.value.isotope}${entry.value.atom}]`;
        break;
      case 'multiplier':
        currentPart.mf += entry.value;
        break;
      case 'multiplierRange':
        if (parenthesisLevel !== 0) {
          throw new Error(
            'Range definition inside parenthesis is not allowed.',
          );
        }
        currentPart.min = entry.value.from;
        currentPart.max = entry.value.to;
        break;
      case 'openingParenthesis':
        parenthesisLevel++;
        currentPart.mf += entry.value;
        break;
      case 'charge':
        if (entry.value === 1) {
          currentPart.mf += '+';
        } else if (entry.value > 1) {
          currentPart.mf += `(+${entry.value})`;
        } else if (entry.value < 0) {
          currentPart.mf += `(${entry.value})`;
        }
        break;
      case 'closingParenthesis':
        parenthesisLevel--;
        currentPart.mf += entry.value;
        break;
      case 'comment':
        comments.push(entry.value);
        break;
      case 'text':
        break;
      default:
        throw new Error(
          `Could not flatten the parsed MF. Unknown kind: ${entry.kind}`,
        );
    }
  }
  if (groupIdentical) {
    parts = optimizeRanges(parts);
  }
  const mfs = createMFs(parts, comments.join(' '), limit);
  return mfs;
}

/**
 * If we have many times the same mf we can combine them
 * This should only be applied if there are acutally some ranges
 */
function optimizeRanges(parts) {
  let newParts = [];
  let mfsObject = {};
  let hasRange = false;
  for (const mf of parts) {
    if (mf.min !== mf.max) {
      hasRange = true;
      break;
    }
  }
  if (!hasRange) return parts;
  for (const mf of parts) {
    if (!mfsObject[mf.mf]) {
      mfsObject[mf.mf] = {
        mf: mf.mf,
        min: mf.min,
        max: mf.max,
      };
      newParts.push(mfsObject[mf.mf]);
    } else {
      mfsObject[mf.mf].min = mfsObject[mf.mf].min + mf.min;
      mfsObject[mf.mf].max = mfsObject[mf.mf].max + mf.max;
    }
  }
  return newParts;
}

function createMFs(parts, comment, limit) {
  const currents = new Array(parts.length);
  for (let i = 0; i < currents.length; i++) {
    currents[i] = parts[i].min;
  }
  const mfs = [];
  let position = 0;
  while (position < currents.length) {
    if (currents[position] < parts[position].max) {
      mfs.push(getMF(parts, currents, comment));
      currents[position]++;
      for (let i = 0; i < position; i++) {
        currents[i] = parts[i].min;
      }
      position = 0;
    } else {
      position++;
    }
    if (mfs.length > limit) {
      throw Error(`MF.flatten generates too many fragments (over ${limit})`);
    }
  }
  mfs.push(getMF(parts, currents, comment));
  return mfs;
}

function getMF(parts, currents, comment) {
  let mf = '';
  for (let i = 0; i < parts.length; i++) {
    if (currents[i] === 0) {
      continue;
    }
    mf += parts[i].mf;
    if (currents[i] !== 1) {
      mf += currents[i];
    }
  }
  if (comment) mf += `$${comment}`;
  return mf;
}

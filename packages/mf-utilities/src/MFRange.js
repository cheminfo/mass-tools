import { parse } from 'mf-parser';

export class MFRange {
  constructor(mf) {
    this.range = getRange(mf);
  }

  isInRange(mf) {
    const target = getRange(mf);
    let rangeIndex = 0;
    let targetIndex = 0;
    while (rangeIndex < this.range.length && targetIndex < target.length) {
      const rangeElement = this.range[rangeIndex];
      const targetElement = target[targetIndex];

      if (rangeElement.element === targetElement.element) {
        // Check if the target's range is within the range's range
        if (
          targetElement.range.from >= rangeElement.range.from &&
          targetElement.range.to <= rangeElement.range.to
        ) {
          targetIndex++;
          rangeIndex++;
        } else {
          return false; // Target element is out of range
        }
      } else if (rangeElement.element < targetElement.element) {
        if (rangeElement.range.from > 0) {
          return false; // Remaining range elements must have a minimum of 1
        }
        rangeIndex++;
      } else {
        return false; // Target element is not in the range
      }
    }
    if (rangeIndex < this.range.length) {
      if (this.range[rangeIndex].range.from > 0) {
        return false; // Remaining range elements must have a minimum of 1
      }
      rangeIndex++;
    }
    if (targetIndex < target.length) {
      return false; // Not all target elements were matched
    }
    return true; // All target elements are within the range
  }
}

function getRange(mf) {
  const parsed = parse(mf, { expandGroups: true, simplify: true });
  const ranges = [];
  let currentRange;

  let currentElement = '';
  for (const item of parsed) {
    switch (item.kind) {
      case 'atom':
        currentRange = { element: item.value, range: { from: 1, to: 1 } };
        ranges.push(currentRange);
        break;
      case 'isotope':
        currentRange = {
          element: item.value.isotope + item.value.atom,
          range: { from: 1, to: 1 },
        };
        break;
      case 'multiplier':
        if (currentRange) {
          currentRange.range.from = item.value;
          currentRange.range.to = item.value;
        } else {
          throw new Error(
            `MFRange: Multiplier without preceding element in MF: ${mf}`,
          );
        }
        break;
      case 'multiplierRange':
        if (currentRange) {
          currentRange.range.from = item.value.from;
          currentRange.range.to = item.value.to;
        } else {
          throw new Error(
            `MFRange: Multiplier range without preceding element in MF: ${mf}`,
          );
        }
        break;
      default:
        throw new Error(`MFRange: Unknown kind: ${item.kind} in MF: ${mf}`);
    }
  }
  return ranges.sort((a, b) => {
    if (a.element < b.element) return -1;
    if (a.element > b.element) return 1;
    return 0;
  });
}

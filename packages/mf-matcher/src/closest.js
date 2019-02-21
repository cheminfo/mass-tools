'use strict';

function closest(array, target) {
  let low = 0;
  let high = array.length - 1;
  let middle = 0;
  while (low <= high) {
    middle = low + ((high - low) >> 1);
    if (array[middle] < target) {
      low = middle + 1;
    } else if (array[middle] > target) {
      high = middle - 1;
    } else {
      return middle;
    }
  }

  if (middle > 0) {
    if (target - array[middle - 1] < array[middle] - target) {
      return middle - 1;
    } else {
      return middle;
    }
  } else {
    return middle;
  }
}

module.exports = closest;

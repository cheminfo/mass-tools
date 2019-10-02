'use strict';

module.exports = function closestPointX(target) {
  this.sortX();

  let low = 0;
  let high = this.array.length - 1;
  let middle = 0;
  while (high - low > 1) {
    middle = low + ((high - low) >> 1);
    if (this.array[middle].x < target) {
      low = middle;
    } else if (this.array[middle].x > target) {
      high = middle;
    } else {
      return this.array[middle];
    }
  }

  if (low < this.array.length - 1) {
    if (
      Math.abs(target - this.array[low].x) <
      Math.abs(this.array[low + 1].x - target)
    ) {
      return this.array[low];
    } else {
      return this.array[low + 1];
    }
  } else {
    return this.array[low];
  }
};

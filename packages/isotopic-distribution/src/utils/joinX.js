'use strict';

/**
 * Join x values if there are similar
 */

module.exports = function joinX(threshold = Number.EPSILON) {
  // when we join we will use the center of mass
  if (this.array.length === 0) return [];
  this.sortX();
  let current = this.array[0];
  let result = [current];
  for (let i = 1; i < this.array.length; i++) {
    const item = this.array[i];
    if (item.x - current.x <= threshold) {
      // weighted sum
      current.x =
        (item.y / (current.y + item.y)) * (item.x - current.x) + current.x;
      current.y += item.y;
    } else {
      current = {
        x: item.x,
        y: item.y,
      };
      if (item.composition) current.composition = item.composition;
      result.push(current);
    }
  }
  this.array = result;
  this.ySorted = false;
  return this;
};

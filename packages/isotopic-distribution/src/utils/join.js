'use strict';

/**
 * Join x values if there are similar
 */

module.exports = function joinX(threshold = Number.EPSILON) {
  // when we join we will use the center of mass
  let result = [];
  this.sortX();
  let current = {
    x: Number.MIN_SAFE_INTEGER,
    y: 0
  };
  for (let item of this.array) {
    if ((item.x - current.x) <= threshold) {
      // weighted sum
      current.x = item.y / (current.y + item.y) * (item.x - current.x) + current.x;
      current.y += item.y;
    } else {
      current = {
        x: item.x,
        y: item.y
      };
      result.push(current);
    }
  }
  this.array = result;
  this.ySorted = false;
  return this;
};

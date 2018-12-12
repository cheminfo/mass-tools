'use strict';

module.exports = function sortX() {
  this.ySorted = false;
  if (this.xSorted) return this;
  this.array.sort((a, b) => a.x - b.x);
  this.xSorted = true;
  return this;
};

'use strict';

module.exports = function topY(limit) {
  if (!limit) return this;
  if (this.array.length <= limit) return this;
  this.sortY();
  this.array.splice(limit);
  return this;
};

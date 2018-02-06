'use strict';

module.exports = function sortY() {
    this.xSorted = false;
    if (this.ySorted) return this;
    this.array.sort((a, b) => b.y - a.y);
    return this;
};

'use strict';

/**
 * Sum of Y to 1
 */

module.exports = function normalize() {
    let sum = 0;
    for (let item of this.array) {
        sum += item.y;
    }
    for (let item of this.array) {
        item.y /= sum;
    }
    return this;
};

'use strict';

class Distribution {
  constructor(array) {
    if (Array.isArray(array)) {
      this.array = array;
      this.xSorted = false;
      this.ySorted = false;
    } else {
      this.array = [];
      this.xSorted = true;
      this.ySorted = true;
    }
  }

  get length() {
    return this.array.length;
  }

  get xs() {
    return this.array.map((p) => p.x);
  }

  get ys() {
    return this.array.map((p) => p.y);
  }

  get minX() {
    if (!this.xSorted) this.sortX();
    return this.array[0].x;
  }

  get maxX() {
    if (!this.xSorted) this.sortX();
    return this.array[this.array.length - 1].x;
  }

  get minY() {
    if (!this.ySorted) this.sortY();
    return this.array[0].y;
  }

  get maxY() {
    if (!this.ySorted) this.sortY();
    return this.array[this.array.length - 1];
  }
}

Distribution.prototype.multiplyY = function multiplyY(value) {
  this.array.forEach((item) => (item.y *= value));
};

Distribution.prototype.setArray = function setArray(array) {
  this.array = array;
  this.xSorted = false;
  this.ySorted = false;
};

Distribution.prototype.move = function move(other) {
  this.xSorted = other.xSorted;
  this.ySorted = other.ySorted;
  this.array = other.array;
};

Distribution.prototype.copy = function copy() {
  let distCopy = new this.constructor();
  distCopy.xSorted = this.xSorted;
  distCopy.ySorted = this.ySorted;
  distCopy.array = JSON.parse(JSON.stringify(this.array));
  return distCopy;
};

Distribution.prototype.push = function push(point, notUsed) {
  if (notUsed) new Error('should update code');
  this.array.push(point);

  this.xSorted = false;
  this.ySorted = false;
};

/**
 * Appen another distribution to the current distribution
 * @param {*} distribution
 */
Distribution.prototype.append = function append(distribution) {
  for (let item of distribution.array) {
    this.array.push(item);
  }
  this.xSorted = false;
  this.ySorted = false;
};

Distribution.prototype.sortX = require('./utils/sortX.js');
Distribution.prototype.sortY = require('./utils/sortY.js');
Distribution.prototype.joinX = require('./utils/joinX.js');
Distribution.prototype.topY = require('./utils/topY.js');
Distribution.prototype.maxToOne = require('./utils/maxToOne.js');
Distribution.prototype.multiply = require('./utils/multiply.js');
Distribution.prototype.square = require('./utils/square.js');
Distribution.prototype.power = require('./utils/power.js');
Distribution.prototype.normalize = require('./utils/normalize.js');
Distribution.prototype.closestPointX = require('./utils/closestPointX.js');

module.exports = Distribution;

import { closestPointX } from './utils/closestPointX.js';
import { joinX } from './utils/joinX.js';
import { multiply } from './utils/multiply.js';
import { power } from './utils/power.js';

/**
 * Internal class to deal with isotopic distribution calculations
 */
export class Distribution {
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

  get maxY() {
    if (!this.ySorted) this.sortY();
    return this.array[0].y;
  }

  get minY() {
    if (!this.ySorted) this.sortY();
    return this.array[this.array.length - 1].y;
  }

  multiplyY(value) {
    this.array.forEach((item) => (item.y *= value));
  }

  setArray(array) {
    this.array = array;
    this.xSorted = false;
    this.ySorted = false;
  }

  move(other) {
    this.xSorted = other.xSorted;
    this.ySorted = other.ySorted;
    this.array = other.array;
  }

  push(point) {
    this.array.push(point);

    this.xSorted = false;
    this.ySorted = false;
  }

  /**
   * Sort by ASCENDING x values
   * @returns {Distribution}
   */
  sortX() {
    this.ySorted = false;
    if (this.xSorted) return this;
    this.array.sort((a, b) => a.x - b.x);
    this.xSorted = true;
    return this;
  }

  /**
   * Sort by DESCENDING y values
   * @returns {Distribution}
   */
  sortY() {
    this.xSorted = false;
    if (this.ySorted) return this;
    this.array.sort((a, b) => b.y - a.y);
    this.ySorted = true;
    return this;
  }

  normalize() {
    let sum = 0;
    for (let item of this.array) {
      sum += item.y;
    }
    for (let item of this.array) {
      item.y /= sum;
    }
    return this;
  }

  /**
   * Only keep a defined number of peaks
   * @param {number} limit
   * @returns
   */
  topY(limit) {
    if (!limit) return this;
    if (this.array.length <= limit) return this;
    this.sortY();
    this.array.splice(limit);
    return this;
  }

  /**
   * remove all the peaks under a defined relative threshold
   * @param {number} [relativeValue=0] Should be between 0 and 1. 0 means no peak will be removed, 1 means all peaks will be removed
   */
  threshold(relativeValue = 0) {
    console.log(this.array);
    if (!relativeValue) return this;
    const maxY = this.maxY;
    console.log(maxY);
    const threshold = maxY * relativeValue;
    this.array = this.array.filter((point) => point.y >= threshold);
  }

  square(options = {}) {
    return this.multiply(this, options);
  }

  multiply(b, options) {
    return multiply(this, b, options);
  }

  power(p, options) {
    return power(this, p, options);
  }

  copy() {
    let distCopy = new Distribution();
    distCopy.xSorted = this.xSorted;
    distCopy.ySorted = this.ySorted;
    distCopy.array = JSON.parse(JSON.stringify(this.array));
    return distCopy;
  }

  maxToOne() {
    if (this.array.length === 0) return this;
    let currentMax = this.array[0].y;
    for (let item of this.array) {
      if (item.y > currentMax) currentMax = item.y;
    }
    for (let item of this.array) {
      item.y /= currentMax;
    }
    return this;
  }

  joinX(threshold) {
    return joinX(this, threshold);
  }

  append(distribution) {
    for (let item of distribution.array) {
      this.array.push(item);
    }
    this.xSorted = false;
    this.ySorted = false;
  }

  closestPointX(target) {
    this.sortX();
    return closestPointX(this.array, target);
  }
}

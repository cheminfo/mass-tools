import { closestPointX } from './utils/closestPointX.js';
import { joinX } from './utils/joinX.js';
import { multiply } from './utils/multiply.js';
import { power } from './utils/power.js';

/**
 * Internal class to deal with isotopic distribution calculations
 */
export class Distribution {
  constructor(array = []) {
    this.array = array;
    this.cache = getEmptyCache();
  }

  emptyCache() {
    if (this.cache.isEmpty) return;
    this.cache = getEmptyCache();
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

  get sumY() {
    if (!Number.isNaN(this.cache.sumY)) return this.cache.sumY;
    let sumY = 0;
    for (let item of this.array) {
      sumY += item.y;
    }
    this.cache.sumY = sumY;
    this.cache.isEmpty = false;
    return sumY;
  }

  get minX() {
    if (!Number.isNaN(this.cache.minX)) return this.cache.minX;
    let minX = Number.POSITIVE_INFINITY;
    for (let item of this.array) {
      if (item.x < minX) {
        minX = item.x;
      }
    }
    this.cache.minX = minX;
    this.cache.isEmpty = false;
    return minX;
  }

  get maxX() {
    if (!Number.isNaN(this.cache.maxX)) return this.cache.maxX;
    let maxX = Number.NEGATIVE_INFINITY;
    for (let item of this.array) {
      if (item.x > maxX) {
        maxX = item.x;
      }
    }
    this.cache.maxX = maxX;
    this.cache.isEmpty = false;
    return maxX;
  }

  get minY() {
    if (!Number.isNaN(this.cache.minY)) return this.cache.minY;
    let minY = Number.POSITIVE_INFINITY;
    for (let item of this.array) {
      if (item.y < minY) {
        minY = item.y;
      }
    }
    this.cache.minY = minY;
    this.cache.isEmpty = false;
    return minY;
  }

  get maxY() {
    if (!Number.isNaN(this.cache.maxY)) return this.cache.maxY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (let item of this.array) {
      if (item.y > maxY) {
        maxY = item.y;
      }
    }
    this.cache.maxY = maxY;
    this.cache.isEmpty = false;
    return maxY;
  }

  multiplyY(value) {
    for (const item of this.array) {
      item.y *= value;
    }
  }

  setArray(array) {
    this.array = array;
    this.emptyCache();
  }

  move(other) {
    this.array = other.array;
    this.emptyCache();
  }

  push(...points) {
    this.array.push(...points);
    this.emptyCache();
  }

  /**
   * Sort by ASCENDING x values
   * @returns {Distribution}
   */
  sortX() {
    this.cache.ySorted = false;
    if (this.cache.xSorted) return this;
    this.array.sort((a, b) => a.x - b.x);
    this.cache.xSorted = true;
    this.cache.isEmpty = false;
    return this;
  }

  /**
   * Sort by DESCENDING y values
   * @returns {Distribution}
   */
  sortY() {
    this.cache.xSorted = false;
    if (this.cache.ySorted) return this;
    this.array.sort((a, b) => b.y - a.y);
    this.cache.ySorted = true;
    this.cache.isEmpty = false;
    return this;
  }

  normalize() {
    const sum = this.sumY;
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
    if (!relativeValue) return this;
    const maxY = this.maxY;
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
    distCopy.cache = { ...this.cache };
    distCopy.array = structuredClone(this.array);
    return distCopy;
  }

  maxToOne() {
    if (this.array.length === 0) return this;
    let currentMax = this.maxY;
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
    this.emptyCache();
  }

  closestPointX(target) {
    this.sortX();
    return closestPointX(this.array, target);
  }
}

function getEmptyCache() {
  return {
    isEmpty: true,
    xSorted: false,
    ySorted: false,
    minX: Number.NaN,
    maxX: Number.NaN,
    minY: Number.NaN,
    maxY: Number.NaN,
    sumY: Number.NaN,
  };
}

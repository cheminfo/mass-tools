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
}

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

Distribution.prototype.push = function push(x, y) {
    this.array.push({ x, y });
    this.xSorted = false;
    this.ySorted = false;
};

Distribution.prototype.sortX = require('./utils/sortX.js');
Distribution.prototype.sortY = require('./utils/sortY.js');
Distribution.prototype.join = require('./utils/join.js');
Distribution.prototype.topY = require('./utils/topY.js');
Distribution.prototype.maxToOne = require('./utils/maxToOne.js');
Distribution.prototype.multiply = require('./utils/multiply.js');
Distribution.prototype.square = require('./utils/square.js');
Distribution.prototype.power = require('./utils/power.js');
Distribution.prototype.normalize = require('./utils/normalize.js');


module.exports = Distribution;

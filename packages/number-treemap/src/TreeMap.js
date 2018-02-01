'use strict';

class TreeMap {
    constructor() {
        this.root = null;
        this.size = 0;
    }
}

TreeMap.prototype.get = require('./get.js');
TreeMap.prototype.getEntry = require('./getEntry.js');
TreeMap.prototype.set = require('./set.js');
TreeMap.prototype.getClosestEntry = require('./getClosestEntry.js');
TreeMap.prototype.getFirstEntry = require('./getFirstEntry.js');
TreeMap.prototype.getLastEntry = require('./getLastEntry.js');

module.exports = TreeMap;

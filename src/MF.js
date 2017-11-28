'use strict';


const parse = require('./parse');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');
const toParts = require('./util/toParts');
const toInfo = require('./util/toInfo');
const partsToDisplay = require('./util/partsToDisplay');

class MF {
    constructor(mf) {
        this.parsed = parse(mf);
        this.cache = {};
    }

    toDisplay() {
        if (!this.cache.displayed) this.cache.displayed = toDisplay(this.parsed);
        return this.cache.displayed;
    }

    toHtml() {
        if (!this.cache.html) {
            this.toDisplay();
            this.cache.html = toHtml(this.cache.displayed);
        }
        return this.cache.html;
    }

    toParts() {
        if (!this.cache.parts) {
            this.cache.parts = toParts(this.parsed);
        }
        return this.cache.parts;
    }

    /**
     * Returns an object with the global MF, global charge, monoisotopic mass and mass
     * as well as the same informations for all the parts
     */
    toInfo() {
        if (!this.cache.info) {
            this.toParts();
            this.cache.info = toInfo(this.cache.parts);
        }
        return this.cache.info;
    }

    canonize() {
        this.toParts();
        this.cache.displayed = partsToDisplay(this.cache.parts);
        this.cache.html = undefined;
    }
}

module.exports = MF;

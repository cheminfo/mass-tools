'use strict';


const parse = require('./parse');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');
const toParts = require('./util/toParts');
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

    canonize() {
        this.toParts();
        this.cache.displayed = partsToDisplay(this.cache.parts);
        this.cache.html = undefined;
    }
}

module.exports = MF;

'use strict';


const parse = require('./parse');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');
const toParts = require('./util/toParts');
const toCanonicalHtml = require('./util/toCanonicalHtml');

class MF {
    constructor(mf) {
        this.parsed = parse(mf);
    }

    toDisplay() {
        if (!this.displayed) this.displayed = toDisplay(this.parsed);
        return this.displayed;
    }

    toHtml() {
        if (!this.html) {
            this.toDisplay();
            this.html = toHtml(this.displayed);
        }
        return this.html;
    }

    toParts() {
        if (!this.parts) {
            this.parts = toParts(this.parsed);
        }
        return this.parts;
    }

    toCanonicalHtml() {
        this.toParts();
        return toCanonicalHtml(this.parts);
    }
}

module.exports = MF;

'use strict';


const parse = require('./parse');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');

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


}

module.exports = MF;

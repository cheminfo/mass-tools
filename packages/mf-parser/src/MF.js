'use strict';

const ensureCase = require('./ensureCase');
const parse = require('./parse');
const getEA = require('./util/getEA');
const getElements = require('./util/getElements');
const getInfo = require('./util/getInfo');
const getIsotopesInfo = require('./util/getIsotopesInfo');
const partsToDisplay = require('./util/partsToDisplay');
const partsToMF = require('./util/partsToMF');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');
const toParts = require('./util/toParts');

class MF {
  constructor(mf, options = {}) {
    if (options.ensureCase) {
      mf = ensureCase(mf);
    }
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

  toParts(options) {
    if (!this.cache.parts) {
      this.cache.parts = toParts(this.parsed, options);
    }
    return this.cache.parts;
  }

  /**
   * Returns an object with the global MF, global charge, monoisotopic mass and mass
   * as well as the same informations for all the parts
   * @param {object} [options={}] options
   */
  getInfo(options = {}) {
    if (!this.cache.info) {
      this.toParts();
      this.cache.info = getInfo(this.cache.parts, options);
    }
    return this.cache.info;
  }

  /**
   * Returns an object with the elemental analysis
   */
  getEA(options = {}) {
    if (!this.cache.ea) {
      this.toParts();
      this.cache.ea = getEA(this.cache.parts, options);
    }
    return this.cache.ea;
  }

  /**
   * Get the different elements for each part
   * @returns an array
   */
  getElements() {
    if (!this.cache.elements) {
      this.toParts();
      this.cache.elements = getElements(this.cache.parts);
    }
    return this.cache.elements;
  }

  /**
   * Returns an array with each atom and isotopic composition
   */
  getIsotopesInfo(options = {}) {
    if (!this.cache.isotopesInfo) {
      this.toParts();
      this.cache.isotopesInfo = getIsotopesInfo(this.cache.parts, options);
    }
    return this.cache.isotopesInfo;
  }

  /**
   * Get a canonized MF
   */
  toMF() {
    if (!this.cache.mf) {
      this.toParts();
      this.cache.mf = partsToMF(this.cache.parts);
    }
    return this.cache.mf;
  }

  /**
   * Get a canonized MF
   */
  toNeutralMF() {
    if (!this.cache.neutralMF) {
      this.toParts();
      this.cache.neutralMF = partsToMF(this.cache.parts, { neutral: true });
    }
    return this.cache.neutralMF;
  }

  canonize() {
    this.toParts();
    this.cache.displayed = partsToDisplay(this.cache.parts);
    this.cache.html = undefined;
  }
}

module.exports = MF;

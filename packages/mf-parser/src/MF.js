import { ensureCase } from './ensureCase';
import { parse } from './parse';
import { getEA } from './util/getEA';
import { getElements } from './util/getElements';
import { getInfo } from './util/getInfo';
import { getIsotopesInfo } from './util/getIsotopesInfo';
import { partsToDisplay } from './util/partsToDisplay';
import { partsToMF } from './util/partsToMF';
import { toDisplay } from './util/toDisplay';
import { toHtml } from './util/toHtml';
import { toParts } from './util/toParts';
import { toText } from './util/toText';

/**
 * Class allowing to deal with molecular formula and derived information
 */
export class MF {
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

  toText() {
    if (!this.cache.text) {
      this.toDisplay();
      this.cache.text = toText(this.cache.displayed);
    }
    return this.cache.text;
  }

  toCanonicText() {
    if (!this.cache.canonicText) {
      this.cache.canonicText = new MF(this.toMF()).toText(this.cache.displayed);
    }
    return this.cache.canonicText;
  }

  toParts(options) {
    if (!this.cache.parts) {
      this.cache.parts = toParts(this.parsed, options);
    }
    return this.cache.parts;
  }

  /**
   * Returns an object with the global MF, global charge, monoisotopic mass and mass
   * as well as the same information for all the parts
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

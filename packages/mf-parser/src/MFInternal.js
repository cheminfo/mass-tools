import { ensureCase } from './ensureCase';
import { parse } from './parse';
import { flatten } from './util/flatten';
import { getEA } from './util/getEA';
import { getElements } from './util/getElements';
import { getInfoInternal } from './util/getInfoInternal';
import { getIsotopesInfo } from './util/getIsotopesInfo';
import { partsToDisplay } from './util/partsToDisplay';
import { partsToMF } from './util/partsToMF';
import { toDisplay } from './util/toDisplay';
import { toHtml } from './util/toHtml';
import { toParts } from './util/toParts';
import { toText } from './util/toText';

/** @typedef {import('./util/getIsotopesInfo.types').IsotopesInfo} IsotopesInfo */
/** @typedef {import('./util/getInfo.types').PartInfo} PartInfo */
/** @typedef {import('./util/getInfo.types').PartInfoWithParts} PartInfoWithParts */

/**
 * Class allowing to deal with molecular formula and derived information
 */
export class MFInternal {
  constructor(mf, options = {}) {
    if (options.ensureCase) {
      mf = ensureCase(mf);
    }
    this.parsed = parse(mf);
    this.cache = {};
  }

  /**
   * Returns an array of objects with kind and value that can be used to easily
   * display the molecular formula.
   * @returns {{kind: string, value: string}[]}
   */
  toDisplay() {
    if (!this.cache.displayed) this.cache.displayed = toDisplay(this.parsed);
    return this.cache.displayed;
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript in HTML.
   * @returns {string}
   */
  toHtml() {
    if (!this.cache.html) {
      this.toDisplay();
      this.cache.html = toHtml(this.cache.displayed);
    }
    return this.cache.html;
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript
   * using Unicode characters. This can not be parsed anymore so kind of dead end ...
   * @returns {string}
   */
  toText() {
    if (!this.cache.text) {
      this.toDisplay();
      this.cache.text = toText(this.cache.displayed);
    }
    return this.cache.text;
  }

  /**
   * Similar to toText but returns a canonic string in which the atoms are sorted using the Hill system
   * @returns {string}
   */
  toCanonicText() {
    if (!this.cache.canonicText) {
      this.cache.canonicText = new MFInternal(this.toMF()).toText();
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
   * @param {object} [options.customUnsaturations={}] custom unsaturations
   * @param {string} [options.emFieldName='monoisotopicMass'] name of the monoisotopic mass field
   * @param {string} [options.msemFieldName='observedMonoisotopicMass'] name of the observed monoisotopic mass field
   * @returns {PartInfo|PartInfoWithParts}
   */
  getInfo(options = {}) {
    if (!this.cache.info) {
      this.toParts();
      this.cache.info = getInfoInternal(this.cache.parts, options);
    }
    return this.cache.info;
  }

  /**
   * Returns an object with the elemental analysis
   * @returns {*[]}
   */
  getEA() {
    if (!this.cache.ea) {
      this.toParts();
      this.cache.ea = getEA(this.cache.parts);
    }
    return this.cache.ea;
  }

  /**
   * Get the different elements for each part
   * @returns {*[]}
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
   * @returns {IsotopesInfo}
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
   * @returns {string}
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
   * @returns {string}
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

  flatten(options) {
    return flatten(this.parsed, options);
  }
}

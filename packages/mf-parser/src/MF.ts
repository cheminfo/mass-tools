import { ensureCase } from './ensureCase';
import { parse } from './parse';
import type { MFParsedPart } from './parse.types';
import { flatten } from './util/flatten';
import type { FlattenOptions } from './util/flatten.types';
import { getEA } from './util/getEA';
import type { EA } from './util/getEA.types';
import { getElements } from './util/getElements';
import type { Element } from './util/getElements.types';
import { getInfo } from './util/getInfo';
import type {
  GetInfoOptions,
  GetInfoOptionsAllowed,
  PartInfo,
  PartInfoWithParts,
} from './util/getInfo.types';
import { getIsotopesInfo } from './util/getIsotopesInfo';
import type { IsotopesInfo } from './util/getIsotopesInfo.types';
import { partsToDisplay } from './util/partsToDisplay';
import { partsToMF } from './util/partsToMF';
import { toDisplay } from './util/toDisplay';
import type { ToDisplayParts } from './util/toDisplay.types';
import { toHtml } from './util/toHtml';
import { toParts } from './util/toParts';
import type { ToPartsOptions, ToPartsPart } from './util/toParts.types';
import { toText } from './util/toText';

interface MFConstructorOptions {
  ensureCase?: boolean;
}

/**
 * Class allowing to deal with molecular formula and derived information
 */
export class MF {
  private readonly parsed: MFParsedPart[];
  private cache: {
    displayed?: ReturnType<typeof toDisplay>;
    html?: ReturnType<typeof toHtml>;
    text?: ReturnType<typeof toText>;
    canonicText?: ReturnType<typeof toText>;
    parts?: ReturnType<typeof toParts>;
    info?: ReturnType<typeof getInfo>;
    ea?: ReturnType<typeof getEA>;
    elements?: ReturnType<typeof getElements>;
    isotopesInfo?: ReturnType<typeof getIsotopesInfo>;
    mf?: ReturnType<typeof partsToMF>;
    neutralMF?: ReturnType<typeof partsToMF>;
  };

  constructor(mf: string, options?: MFConstructorOptions) {
    if (options?.ensureCase) {
      mf = ensureCase(mf);
    }

    this.parsed = parse(mf);
    this.cache = {};
  }

  /**
   * Returns an array of objects with kind and value that can be used to easily
   * display the molecular formula.
   */
  toDisplay(): ToDisplayParts[] {
    if (!this.cache.displayed) this.cache.displayed = toDisplay(this.parsed);
    return this.cache.displayed;
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript in HTML.
   */
  toHtml(): string {
    if (!this.cache.html) {
      this.toDisplay();
      assertIsDefined(this.cache.displayed);
      this.cache.html = toHtml(this.cache.displayed);
    }
    return this.cache.html;
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript
   * using unicode characters. This can not be parsed anymore so kind of dead end ...
   */
  toText(): string {
    if (!this.cache.text) {
      this.toDisplay();
      assertIsDefined(this.cache.displayed);
      this.cache.text = toText(this.cache.displayed);
    }
    return this.cache.text;
  }

  /**
   * Similar to toText but returns a canonic string in which the atoms are sorted using the Hill system
   */
  toCanonicText(): string {
    if (!this.cache.canonicText) {
      this.toDisplay();
      assertIsDefined(this.cache.displayed);
      this.cache.canonicText = new MF(this.toMF()).toText();
    }
    return this.cache.canonicText;
  }

  toParts(options?: ToPartsOptions): ToPartsPart[][] {
    if (!this.cache.parts) {
      this.cache.parts = toParts(this.parsed, options);
    }
    return this.cache.parts;
  }

  /**
   * Returns an object with the global MF, global charge, monoisotopic mass and mass
   * as well as the same information for all the parts
   */
  getInfo<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(
    options?: GIO,
  ): PartInfo<GIO> | PartInfoWithParts<GIO> {
    if (!this.cache.info) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.info = getInfo(this.cache.parts, options);
    }
    return this.cache.info;
  }

  /**
   * Returns an object with the elemental analysis
   */
  getEA(): EA[] {
    if (!this.cache.ea) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.ea = getEA(this.cache.parts);
    }
    return this.cache.ea;
  }

  /**
   * Get the different elements for each part
   * @returns an array
   */
  getElements(): Element[] {
    if (!this.cache.elements) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.elements = getElements(this.cache.parts);
    }
    return this.cache.elements;
  }

  /**
   * Returns an array with each atom and isotopic composition
   * @returns {IsotopesInfo}
   */
  getIsotopesInfo(): IsotopesInfo {
    if (!this.cache.isotopesInfo) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.isotopesInfo = getIsotopesInfo(this.cache.parts);
    }
    return this.cache.isotopesInfo;
  }

  /**
   * Get a canonized MF
   */
  toMF(): string {
    if (!this.cache.mf) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.mf = partsToMF(this.cache.parts);
    }
    return this.cache.mf;
  }

  /**
   * Get a canonized MF
   */
  toNeutralMF(): string {
    if (!this.cache.neutralMF) {
      this.toParts();
      assertIsDefined(this.cache.parts);
      this.cache.neutralMF = partsToMF(this.cache.parts, { neutral: true });
    }
    return this.cache.neutralMF;
  }

  canonize() {
    this.toParts();
    this.cache.displayed = partsToDisplay(this.cache.parts);
    this.cache.html = undefined;
  }

  flatten(options?: FlattenOptions): string[] {
    return flatten(this.parsed, options);
  }
}

function assertIsDefined<T>(
  value: T | null | undefined,
): asserts value is Exclude<T, null | undefined> {
  if (value === undefined || value === null) {
    throw new Error('unexpected null or undefined value');
  }
}

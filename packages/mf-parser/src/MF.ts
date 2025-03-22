import type {
  DisplayPart,
  EA,
  Element,
  FlattenOptions,
  Parts,
} from './MF.types';
import { MFInternal } from './MFInternal';
import type {
  GetInfoOptions,
  GetInfoOptionsAllowed,
  MFInfo,
  MFInfoWithParts,
} from './util/getInfo.types';
import type { IsotopesInfo } from './util/getIsotopesInfo.types';

export interface MFConstructorOptions {
  ensureCase?: boolean;
}

export class MF {
  private readonly internal: MFInternal;

  constructor(mf: string, options: MFConstructorOptions = {}) {
    this.internal = new MFInternal(mf, options);
  }

  /**
   * Returns an array of objects with kind and value that can be used to easily
   * display the molecular formula.
   */
  toDisplay(): DisplayPart[] {
    return this.internal.toDisplay();
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript in HTML.
   */
  toHtml(): string {
    return this.internal.toHtml();
  }

  /**
   * Returns a string that represents the molecular formula adding subscript and superscript
   * using Unicode characters. This can not be parsed anymore so kind of dead end ...
   */
  toText(): string {
    return this.internal.toText();
  }

  /**
   * Similar to toText but returns a canonic string in which the atoms are sorted using the Hill system
   */
  toCanonicText(): string {
    return this.internal.toCanonicText();
  }

  toParts(options?: { expand?: boolean }): Parts[] {
    return this.internal.toParts(options);
  }

  /**
   * Returns an object with the global MF, global charge, monoisotopic mass and mass
   * as well as the same information for all the parts
   */
  getInfo<GIO extends GetInfoOptionsAllowed = GetInfoOptions>(
    options?: GIO,
  ): MFInfo<GIO> | MFInfoWithParts<GIO> {
    return this.internal.getInfo(options);
  }

  /**
   * Returns an object with the elemental analysis
   */
  getEA(): EA[] {
    return this.internal.getEA();
  }

  /**
   * Get the different elements for each part
   */
  getElements(): Element[] {
    return this.internal.getElements();
  }

  /**
   * Returns an array with each atom and isotopic composition
   */
  getIsotopesInfo(options = {}): IsotopesInfo | [] {
    return this.internal.getIsotopesInfo(options);
  }

  /**
   * Get a canonized parsable Molecule Formula
   */
  toMF(): string {
    return this.internal.toMF();
  }

  /**
   * Get a canonized MF
   */
  toNeutralMF(): string {
    return this.internal.toNeutralMF();
  }

  canonize(): void {
    return this.internal.canonize();
  }

  flatten(options?: FlattenOptions): string[] {
    return this.internal.flatten(options);
  }
}

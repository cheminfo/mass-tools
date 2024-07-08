import type { IsotopesInfo, PartInfo } from 'mf-parser';

/**
 * An object containing two arrays.
 */
export interface XY {
  x: number[];
  y: number[];
}

export interface IsotopicDistributionPart extends PartInfo {
  confidence: number;
  isotopesInfo: IsotopesInfo;
  em: number;
}

export interface IsotopicDistributionOptions {
  /**
   * String containing a comma separated list of modifications.
   */
  ionizations?: string;
  /**
   * Amount of Dalton under which 2 peaks are joined.
   * @default 0.01
   */
  fwhm?: number;
  /**
   * Maximal number of lines during calculations.
   * @default 5000
   */
  maxLines?: number;
  /**
   * Minimal signal height during calculations.
   * @default 1e-8
   */
  minY?: number;
  /**
   * Ensure uppercase / lowercase.
   * @default false
   */
  ensureCase?: boolean;
  /**
   * We can filter the result based on the relative height of the peaks.
   */
  threshold?: number;
  /**
   * We may define the maximum number of peaks to keep.
   */
  limit?: number;
  /**
   * Whether to keep the distribution if the molecule has no charge.
   * @default true
   */
  allowNeutral?: boolean;
}

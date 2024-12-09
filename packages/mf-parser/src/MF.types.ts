/**
 * Temporary interface for incremental migrations to typescript
 */

/**
 * approximately toDisplay return type
 */
export interface DisplayPart {
  kind: string;
  value: string;
}

/**
 * approximately toParts return type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parts = any[];

/**
 * approximately getEA return type
 */
export interface EA {
  element: string;
  mass: number;
  ratio: number;
}

/**
 * approximately getElements return type
 */
export interface Element {
  symbol: string;
  number: number;
  isotope?: number;
}

/**
 * approximately flatten options type
 */
export interface FlattenOptions {
  /** @default false */
  groupIdentical: boolean;
  /** @default 100000 */
  limit: number;
}

/**
 * Defines static variables corresponding to the various formatting possibilities
 */

export const Format = {
  SUBSCRIPT: 'subscript',
  SUPERSCRIPT: 'superscript',
  SUPERIMPOSE: 'superimpose',
  TEXT: 'text',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Format = (typeof Format)[keyof typeof Format];

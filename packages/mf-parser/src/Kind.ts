/**
 * Define static variable corresponding to the various Kinds of a molecular formula part.
 */

export const Kind = {
  BEGIN: 'begin',
  ATOM: 'atom',
  MULTIPLIER_RANGE: 'multiplierRange',
  ISOTOPE: 'isotope',
  ISOTOPE_RATIO: 'isotopeRatio',
  CHARGE: 'charge',
  SALT: 'salt',
  OPENING_PARENTHESIS: 'openingParenthesis',
  CLOSING_PARENTHESIS: 'closingParenthesis',
  PRE_MULTIPLIER: 'preMultiplier',
  MULTIPLIER: 'multiplier',
  TEXT: 'text',
  ANCHOR: 'anchor',
  COMMENT: 'comment',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Kind = (typeof Kind)[keyof typeof Kind];

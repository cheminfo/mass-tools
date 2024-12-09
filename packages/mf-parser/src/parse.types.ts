import type { Kind } from './Kind';

interface MFParsedPreMultiplier {
  kind: (typeof Kind)['PRE_MULTIPLIER'];
  value: number;
}

interface MFParsedMultiplierRange {
  kind: (typeof Kind)['MULTIPLIER_RANGE'];
  value: {
    from: number;
    to: number;
  };
}

interface MFParsedMultiplier {
  kind: (typeof Kind)['MULTIPLIER'];
  value: number;
}

interface MFParsedSalt {
  kind: (typeof Kind)['SALT'];
  value: '.';
}

interface MFParsedAnchor {
  kind: (typeof Kind)['ANCHOR'];
  value: 0;
}

interface MFParsedAtom {
  kind: (typeof Kind)['ATOM'];
  value: string;
}

interface MFParsedCharge {
  kind: (typeof Kind)['CHARGE'];
  value: number;
}

interface MFParsedOpeningParenthesis {
  kind: (typeof Kind)['OPENING_PARENTHESIS'];
  value: '(';
}

interface MFParsedClosingParenthesis {
  kind: (typeof Kind)['CLOSING_PARENTHESIS'];
  value: ')';
}

interface MFParsedIsotope {
  kind: (typeof Kind)['ISOTOPE'];
  value: {
    atom: string;
    isotope: number;
  };
}

interface MFParsedIsotopeRatio {
  kind: (typeof Kind)['ISOTOPE_RATIO'];
  value: {
    atom: string;
    ratio: number[];
  };
}

interface MFParsedComment {
  kind: (typeof Kind)['COMMENT'];
  value: string;
}

interface MFParsedText {
  kind: (typeof Kind)['TEXT'];
  value: string;
}

export type MFParsedPart =
  | MFParsedPreMultiplier
  | MFParsedMultiplierRange
  | MFParsedMultiplier
  | MFParsedSalt
  | MFParsedAnchor
  | MFParsedAtom
  | MFParsedCharge
  | MFParsedOpeningParenthesis
  | MFParsedClosingParenthesis
  | MFParsedIsotope
  | MFParsedIsotopeRatio
  | MFParsedComment
  | MFParsedText;

export type MFParsedPartOfKind<K extends Kind> = Extract<
  MFParsedPart,
  { kind: K }
>;

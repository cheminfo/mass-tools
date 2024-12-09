import type { Format } from '../Format';

interface ToDisplaySubScript {
  kind: (typeof Format)['SUBSCRIPT'];
  value: string;
}

interface ToDisplaySuperImpose {
  kind: (typeof Format)['SUPERIMPOSE'];
  over: string;
  under: Exclude<ToDisplayParts, ToDisplaySuperImpose>['value'];
  value: undefined;
}

interface ToDisplaySuperScript {
  kind: (typeof Format)['SUPERSCRIPT'];
  value: string | number;
}

interface ToDisplayText {
  kind: (typeof Format)['TEXT'];
  value: string;
}

export type ToDisplayParts =
  | ToDisplaySubScript
  | ToDisplaySuperImpose
  | ToDisplaySuperScript
  | ToDisplayText;

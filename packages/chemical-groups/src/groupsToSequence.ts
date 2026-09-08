import { groupsObject } from './groupsObject.js';

/**
 * Rebuild the one letter sequence of a molecular formula made of groups, like
 * `HOAlaGlyOH` giving `AG`. A group without a one letter code becomes `?`.
 * @param mf - Molecular formula containing group symbols.
 * @returns The one letter sequence.
 */
export function groupsToSequence(mf: string): string {
  const withoutComments = mf.replaceAll(/\([^(]*\)/g, '');
  const parts = withoutComments.split(/(?=[ A-Z])/);
  const usefulParts: string[] = [];
  for (const part of parts) {
    if (part === ' ') {
      usefulParts.push(' ');
      continue;
    }
    if (!/^[A-Z][a-z]{2,6}/.test(part)) continue;
    const oneLetter = groupsObject[part]?.oneLetter;
    usefulParts.push(oneLetter ?? '?');
  }
  return usefulParts.join('').replaceAll(/ +/g, ' ').trim();
}

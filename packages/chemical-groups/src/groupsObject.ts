import { groups } from './groups.js';
import type { Group } from './types.js';

/**
 * The groups indexed by their symbol. Symbols are unique, which is asserted by
 * the tests of this package and by the groups editor.
 */
export const groupsObject: Record<string, Group> = {};

for (const group of groups) {
  groupsObject[group.symbol] = group;
}

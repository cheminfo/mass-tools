import { groups } from './groups.js';

export * from './groups.js';

export { groupsToSequence } from './groupsToSequence';

export function getGroupsObject() {
  let object = {};
  groups.forEach((e) => {
    object[e.symbol] = e;
  });
  return object;
}

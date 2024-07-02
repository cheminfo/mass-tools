import { groups } from './groups';

export const groupsObject = {};
groups.forEach((e) => {
  if (groupsObject[e.symbol]) {
    // eslint-disable-next-line no-console
    console.log(`The symbol ${e.symbol} is used more than once`);
  }
  groupsObject[e.symbol] = e;
});

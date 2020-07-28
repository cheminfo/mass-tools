'use strict';

let groupsToSequence = require('../groupsToSequence');

test('groupsToSequence', () => {
  expect(groupsToSequence('HOAlaGlyOH')).toBe('AG');
  expect(groupsToSequence('HOAla(H-1OH-1)GlyOH(C2H5)')).toBe('AG');
  expect(groupsToSequence('HOAlaAlaFmoc(H-1OH-1)GlyOH(C2H5)')).toBe('AA?G');
  expect(groupsToSequence('HO AlaAlaFmoc (H-1OH-1)Gly OH(C2H5)')).toBe('AA? G');
  expect(groupsToSequence('O-2P-1DcmpDampDgmpH')).toBe('CAG');
  expect(groupsToSequence('HODamDamDamDamDamH')).toBe('œœœœœ');
});

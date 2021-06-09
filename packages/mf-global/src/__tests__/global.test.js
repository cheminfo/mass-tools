'use strict';

const MFGlobal = require('..');

test('mf-global', () => {
  expect(MFGlobal.Groups).toHaveLength(303);
  expect(MFGlobal.Elements).toHaveLength(118);
});

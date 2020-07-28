'use strict';

const MFGlobal = require('..');

test('mf-global', () => {
  expect(MFGlobal.Groups).toHaveLength(299);
  expect(MFGlobal.Elements).toHaveLength(118);
});

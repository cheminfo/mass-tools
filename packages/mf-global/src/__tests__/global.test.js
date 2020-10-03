'use strict';

const MFGlobal = require('..');

test('mf-global', () => {
  expect(MFGlobal.Groups).toHaveLength(301);
  expect(MFGlobal.Elements).toHaveLength(118);
});

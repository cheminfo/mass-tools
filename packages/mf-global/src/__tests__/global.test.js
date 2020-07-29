'use strict';

const MFGlobal = require('..');

test('mf-global', () => {
  expect(MFGlobal.Groups).toHaveLength(300);
  expect(MFGlobal.Elements).toHaveLength(118);
});

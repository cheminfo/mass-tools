'use strict';

var data = require('..');

test('data size', () => {
  expect(data.elements).toHaveLength(118);
});

test('getElementsObject', () => {
  var elementsObject = data.getElementsObject();
  expect(Object.keys(elementsObject)).toHaveLength(118);
});

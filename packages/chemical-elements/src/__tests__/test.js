'use strict';

let data = require('..');

test('data size', () => {
  expect(data.elements).toHaveLength(118);
});

test('getElementsObject', () => {
  let elementsObject = data.getElementsObject();
  expect(Object.keys(elementsObject)).toHaveLength(118);
});

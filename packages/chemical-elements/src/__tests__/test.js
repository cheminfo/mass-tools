'use strict';

let data = require('..');

describe('chemical-lements', () => {
  it('data size', () => {
    expect(data.elements).toHaveLength(118);
  });

  it('elementsObject', () => {
    expect(Object.keys(data.elementsObject)).toHaveLength(118);
  });
});

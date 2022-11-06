let { elements, elementsObject } = require('..');

describe('chemical-lements', () => {
  it('data size', () => {
    expect(elements).toHaveLength(118);
  });

  it('elementsObject', () => {
    expect(Object.keys(elementsObject)).toHaveLength(118);
  });
});

import { elements, elementsObject } from '..';

describe('chemical-lements', () => {
  it('data size', () => {
    expect(elements).toHaveLength(118);
  });

  it('elementsObject', () => {
    const keys = Object.keys(elementsObject);
    expect(keys).toHaveLength(118);
  });
});

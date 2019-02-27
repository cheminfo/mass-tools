'use strict';

const getPeaksAnnotation = require('../getPeaksAnnotation');

describe('test getPeaksAnnotation', () => {
  let peaks = [
    { x: 12, y: 1 },
    { x: 24, y: 2 },
    { x: 36, y: 3 },
    { x: 42, y: 4 }
  ];
  it('default options', () => {
    let result = getPeaksAnnotation(peaks);
    expect(result).toMatchSnapshot();
  });
});

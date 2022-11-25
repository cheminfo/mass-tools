import { Spectrum } from '../Spectrum';

describe('test Spectrum JSGraph', () => {
  it('getAnnotation', async () => {
    let peaks = [
      {
        x: 1,
        y: 2,
        close: false,
      },
      { x: 2, y: 3, close: true },
    ];
    let annotations = await Spectrum.JsGraph.getPeaksAnnotation(peaks);

    expect(annotations).toHaveLength(3);
    expect(annotations).toMatchSnapshot();
  });
});

import { Spectrum } from '../Spectrum';

test('Spectrum fromPeaks', () => {
  const peaks = [
    {
      x: 120,
      y: 0.8980077624805509,
      composition: '[12C]10',
    },
    {
      x: 121.00335483507,
      y: 0.09712607963754064,
      composition: '[12C]9[13C]',
    },
    {
      x: 122.00670967014,
      y: 0.004727201793740607,
      composition: '[12C]8[13C]2',
    },
    {
      x: 123.01006450521,
      y: 0.00013634168049603962,
      composition: '[12C]7[13C]3',
    },
    {
      x: 124.01341934028,
      y: 0.0000025806104996344306,
      composition: '[12C]6[13C]4',
    },
    {
      x: 125.01677417535,
      y: 1.8607454662278652e-8,
      composition: '[12C]5[13C]5',
    },
  ];

  const spectrum = Spectrum.fromPeaks(peaks);

  expect(Object.keys(spectrum.data)).toStrictEqual(['x', 'y', 'composition']);
});

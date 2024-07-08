import { PowerRegression } from 'ml-regression-power';
import { xMaxValue, xMinValue } from 'ml-spectra-processing';

export function peaksWidth(peaks) {
  let xs = peaks.map((peak) => peak.x);
  let widths = peaks.map((peak) => peak.width);

  if (xs.length < 2) {
    throw new Error(
      `peaksWidth: not enough peaks (less than 2) for automatic width calculation: ${xs.length}`,
    );
  }
  let regression = new PowerRegression(xs, widths);

  if (Number.isNaN(regression.A) || Number.isNaN(regression.B)) {
    throw new Error('peaksWidth: can not calculate regression');
  }

  let from = xMinValue(xs);
  let to = xMaxValue(xs);

  let regressionChart = { x: [], y: [] };
  for (let x = from; x <= to; x += (to - from) / 1000) {
    regressionChart.x.push(x);
    regressionChart.y.push(regression.predict(x));
  }
  return {
    widths: {
      x: xs,
      y: widths,
    },
    fit: regressionChart,
    score: regression.score(xs, widths),

    predictFct: regression.predict.bind(regression),
    tex: regression.toLaTeX(3),
    A: regression.A,
    B: regression.B,
    predictFctString: `${regression.A} * mass ** ${regression.B}`,
  };
}

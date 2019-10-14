'use strict';

const Regression = require('ml-regression-power/lib/index.js');
const min = require('ml-array-min/lib/index');
const max = require('ml-array-max/lib/index');

function peaksWidth(peaks) {
  let xs = peaks.map((peak) => peak.x);
  let widths = peaks.map((peak) => peak.width);

  if (xs.length < 2) {
    throw new Error(
      `peaksWidth: not enough peaks (less than 2) for automatic width calculation: ${xs.length}`
    );
  }
  let regression = new Regression(xs, widths, {
    computeQuality: true,
    computeCoefficient: true
  });

  if (isNaN(regression.A) || isNaN(regression.B)) {
    throw new Error('peaksWidth: can not calculate regression');
  }

  let from = min(xs);
  let to = max(xs);

  let regressionChart = { x: [], y: [] };
  for (let x = from; x <= to; x += (to - from) / 1000) {
    regressionChart.x.push(x);
    regressionChart.y.push(regression.predict(x));
  }
  return {
    widths: {
      x: xs,
      y: widths
    },
    fit: regressionChart,
    score: regression.score(xs, widths),
    // eslint-disable-next-line no-new-func
    predictFct: regression.predict.bind(regression),
    tex: regression.toLaTeX(3),
    A: regression.A,
    B: regression.B,
    predictFctString: `${regression.A} * mass ** ${regression.B}`
  };
}

module.exports = peaksWidth;

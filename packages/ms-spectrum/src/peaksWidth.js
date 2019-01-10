'use strict';

const Regression = require('ml-regression-power/lib/index.js');

function peaksWidth(peaks) {
  let xs = peaks.map((peak) => peak.x);
  let widths = peaks.map((peak) => peak.width);

  if (xs.length < 2) {
    throw new Error(
      `Not enough peaks (less than 2) for automatic width calculation: ${
        xs.length
      }`
    );
  }
  var regression = new Regression(xs, widths, {
    computeQuality: true,
    computeCoefficient: true
  });

  var from = Math.min(...xs);
  var to = Math.max(...xs);

  var regressionChart = { x: [], y: [] };
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
    tex: regression.toLaTeX(3)
  };
}

module.exports = peaksWidth;

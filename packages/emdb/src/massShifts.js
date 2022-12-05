import Regression from 'ml-regression-theil-sen';
import { xMinValue, xMaxValue } from 'ml-spectra-processing';

/**
 * Calculates a function that allows post-calibration on mass spectra based on the error in assignment
 * @param {*} similarities
 * @param {object} [options={}]
 * @returns
 */
export function massShifts(similarities, options = {}) {
  const { minSimilarity = 0.95, minLength = 10 } = options;

  let results = [];
  if (!Array.isArray(similarities)) {
    for (let key of results) {
      for (let entry of results[key]) {
        results.push(entry);
      }
    }
  } else {
    results = similarities;
  }

  results = results.filter(
    (result) =>
      result.ms &&
      result.ms.similarity &&
      result.ms.similarity.value > minSimilarity,
  );

  if (results.length < minLength) {
    throw new Error(
      `X rescale can not be applied. We need at least ${minLength} peaks with over ${Math.round(
        minSimilarity * 100,
      )}% similarity`,
    );
  }

  const data = results
    .map((result) => {
      return {
        em: result.ms.em,
        delta: result.ms.delta,
      };
    })
    .sort((a, b) => a.em - b.em);

  let shifts = { x: [], y: [] };
  data.forEach((datum) => {
    shifts.x.push(Number(datum.em));
    shifts.y.push(Number(datum.delta));
  });

  const regression = new Regression(shifts.x, shifts.y);

  let minX = xMinValue(shifts.x);
  let maxX = xMaxValue(shifts.x);

  let shiftsPPM = { x: shifts.x, y: [] };
  data.forEach((datum) => {
    shiftsPPM.y.push(Number((datum.delta / datum.em) * 1e6));
  });

  let regressionChart = { x: [], y: [] };

  for (let i = minX; i < maxX; i += (maxX - minX) / 1000) {
    regressionChart.x.push(i);
    regressionChart.y.push(regression.predict(i));
  }

  return {
    shifts,
    shiftsPPM,
    fit: regressionChart,
    score: regression.score(shifts.x, shifts.y),

    predictFct: regression.predict.bind(regression),
    tex: regression.toLaTeX(3),
    slope: regression.slope,
    intercept: regression.intercept,
    predictFctString: `${regression.slope} * mass + ${regression.intercept}`,
  };
}

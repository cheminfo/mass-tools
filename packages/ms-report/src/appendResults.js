'use strict';

function appendResults(data, analysisResult, options = {}) {
  const numberResidues = data.residues.residues.length;
  const { merge = {} } = options;
  let results = JSON.parse(JSON.stringify(analysisResult));
  results = results.filter((result) => !result.type.match(/^-B[0-9]$/));
  // we calculate all the lines based on the results
  for (let result of results) {
    let parts = result.type.split(/:/);
    if (parts.length === 2) {
      result.internal = true;
      result.to = getNumber(parts[0]) - 1;
      result.from = numberResidues - 1 - getNumber(parts[1]);
    } else {
      if (parts[0].match(/^[abcd][1-9]/)) {
        result.fromBegin = true;
        result.position = getNumber(parts[0]) - 1;
      }
      if (parts[0].match(/^[wxyz][1-9]/)) {
        result.fromEnd = true;
        result.position = numberResidues - 1 - getNumber(parts[0]);
      }
    }

    if (result.fromEnd) result.color = 'red';
    if (result.fromBegin) result.color = 'blue';
    if (result.internal) {
      switch (result.type.substring(0, 1)) {
        case 'a':
          result.color = 'green';
          break;
        case 'b':
          result.color = 'orange';
          break;
        case 'c':
          result.color = 'cyan';
          break;
        default:
          result.color = 'green';
      }
    }
    if (result.similarity > 95) {
      result.textColor = 'black';
    } else if (result.similarity > 90) {
      result.textColor = '#333';
    } else if (result.similariy > 80) {
      result.textColor = '#666';
    } else {
      result.textColor = '#999';
    }
  }

  if (merge.charge) {
    const unique = {};
    for (let result of results) {
      if (!unique[result.type]) {
        unique[result.type] = [];
      }
      unique[result.type].push(result);
    }
    results = [];
    for (let key in unique) {
      let current = unique[key][0];
      current.similarity = unique[key].reduce(
        (previous, item) => previous + item.similarity,
        0,
      );
      current.similarity = Math.round(current.similarity / unique[key].length);
      results.push(current);
      current.charge = '';
    }
  }

  // sort by residue length
  results.sort((a, b) => a.length - b.length);
  data.results = results;
}

function getNumber(text) {
  return Number(text.replace(/^.([0-9]+).*$/, '$1'));
}

module.exports = appendResults;

'use strict';

function improveResults(analysisResult, numberResidues) {
  let results = JSON.parse(JSON.stringify(analysisResult));

  // we calculate all the lines based on the results
  for (let result of results) {
    let parts = result.type.split(/(?=[a-z])/);
    if (parts.length === 2) {
      result.internal = true;
      result.to = Number(parts[0].replace(/[^0-9]/g, '') - 1);
      result.from =
        numberResidues - 1 - Number(parts[1].replace(/[^0-9]/g, ''));
      console.log(result.from, result.to);
    }
    if ('abcd'.match(parts[0][0])) {
      result.fromBegin = true;
      result.position = Number(parts[0].replace(/[^0-9]/g, '') - 1);
    }
    if ('wxyz'.match(parts[0][0])) {
      result.fromEnd = true;
      result.position =
        numberResidues - 1 - Number(parts[0].replace(/[^0-9]/g, ''));
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
  // sort by residue length
  results.sort((a, b) => a.length - b.length);

  return results;
}

module.exports = improveResults;

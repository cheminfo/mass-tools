import { aminoAcids } from './aminoAcids';

// we will convert the data to an object to be much faster
let aaObject = {};
for (let i = 0; i < aminoAcids.length; i++) {
  aaObject[aminoAcids[i].aa3] = aminoAcids[i];
}

export function calculateCharge(aas, pH = 7) {
  let combined = combine(aas);
  if (!combined) return;
  let charge = calculateForPh(combined, pH);
  return Math.round(charge * 1000) / 1000;
}

// this methods required an array of aas

export function calculateIEP(aas) {
  let combined = combine(aas);
  if (!combined) return;
  let first = 0;
  let last = 14;
  let current = 14;
  let previous = 0;
  let currentCharge;
  while (Math.abs(current - previous) > 0.0001) {
    previous = current;
    current = (last + first) / 2;
    currentCharge = calculateForPh(combined, current);
    if (currentCharge > 0) {
      first = current;
    } else if (currentCharge < 0) {
      last = current;
    } else {
      previous = current;
    }
  }
  return Math.round(current * 1000) / 1000;
}

export function calculateChart(aas) {
  let combined = combine(aas);
  if (!combined) return;
  let y = [];
  let x = [];
  let yAbs = [];
  for (let i = 0; i <= 14; i = i + 0.01) {
    let charge = calculateForPh(combined, i);
    x.push(i);
    y.push(charge);
    yAbs.push(Math.abs(charge));
  }
  combined.x = x;
  combined.y = y;
  combined.yAbs = yAbs;

  return combined;
}

function calculateForPh(combined, pH) {
  let total = 0;
  total += 1 / (1 + 10 ** (pH - combined.first));
  total += -1 / (1 + 10 ** (combined.last - pH));
  for (let key in combined.acid) {
    total += -combined.acid[key] / (1 + 10 ** (aaObject[key].sc.pKa - pH));
  }
  for (let key in combined.basic) {
    total += combined.basic[key] / (1 + 10 ** (pH - aaObject[key].sc.pKa));
  }
  return total;
}

// we will combine the amino acids
function combine(aas) {
  let combined = {};
  if (aaObject[aas[0]]) {
    combined.first = aaObject[aas[0]].pKaN;
  } else {
    return;
  }
  if (aaObject[aas.at(-1)]) {
    combined.last = aaObject[aas.at(-1)].pKaC;
  } else {
    return;
  }
  combined.basic = {};
  combined.acid = {};
  for (let i = 0; i < aas.length; i++) {
    let currentAA = aas[i];
    if (!aaObject[currentAA]) return;
    if (aaObject[currentAA].sc && aaObject[currentAA].sc.type) {
      if (aaObject[currentAA].sc.type === 'positive') {
        if (!combined.basic[currentAA]) {
          combined.basic[currentAA] = 0;
        }
        combined.basic[currentAA]++;
      } else if (aaObject[currentAA].sc.type === 'negative') {
        if (!combined.acid[currentAA]) {
          combined.acid[currentAA] = 0;
        }
        combined.acid[currentAA]++;
      }
    }
  }
  return combined;
}

/*
 We can generate a color based on iep
 0 -> 7 means that at pH 7 it is charged negatively (blue)
 7 -> 14 means that at pH7 it is charged positively (red)
 */
export function getColor(iep) {
  if (iep < 7) {
    if (iep < 3) iep = 3;
    let white = Math.round(255 - (7 - iep) * (200 / 4));
    return `rgb(${white},${white},255)`;
  } else if (iep > 7) {
    if (iep > 11) iep = 11;
    let white = Math.round(255 - (iep - 7) * (200 / 4));
    return `rgb(255,${white},${white})`;
  }
  return 'rgb(255,255,255)';
}

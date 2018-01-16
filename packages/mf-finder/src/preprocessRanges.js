'use strict';

const MF = require('mf-parser').MF;

module.exports = function preprocessRanges(ranges) {
    var possibilities = [];
    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        let min = range.min === undefined ? 0 : range.min;
        let max = range.max === undefined ? 1 : range.max;
        let possibility = {
            mf: range.mf,
            originalMinCount: min, // value defined by the user
            originalMaxCount: max, // value defined by the user
            currentMinCount: min,
            currentMaxCount: max,
            currentCount: min,
            currentMonoisotopicMass: 0,
            currentCharge: 0,
            currentUnsaturation: 0,
            initialOrder: i,
            minInnerMass: 0,
            maxInnerMass: 0,
            minInnerCharge: 0,
            maxInnerCharge: 0,
            innerCharge: false
        };
        possibilities.push(possibility);
        let info = new MF(range.mf).getInfo();
        possibility.em = range.em || info.monoisotopicMass;
        possibility.charge = range.charge || info.charge;
        possibility.unsaturation = (range.unsaturation === undefined) ? (info.unsaturation - 1) * 2 : range.unsaturation;
        if (possibility.mf !== info.mf) possibility.isGroup = true;
    }
    possibilities = possibilities.filter((r) => r.originalMinCount !== 0 || r.originalMaxCount !== 0);
    // we will sort the way we analyse the data
    // 1. The one possibility parameter
    // 2. The charged part
    // 3. Decreasing em
    possibilities.sort((a, b) => {
        if (a.charge && b.charge) {
            if (Math.abs(a.charge) > Math.abs(b.charge)) return -1;
            if (Math.abs(a.charge) < Math.abs(b.charge)) return 1;
            return b.em - a.em;
        }
        if (a.charge) return -1;
        if (b.charge) return 1;
        return b.em - a.em;
    });

    // we calculate couple of fixed values

    for (let i = 0; i < possibilities.length; i++) {
        for (let j = i + 1; j < possibilities.length; j++) {
            let possibility = possibilities[j];
            if (possibility.em > 0) {
                possibilities[i].minInnerMass += possibility.em * possibility.originalMinCount;
                possibilities[i].maxInnerMass += possibility.em * possibility.originalMaxCount;
            } else {
                possibilities[i].minInnerMass += possibility.em * possibility.originalMaxCount;
                possibilities[i].maxInnerMass += possibility.em * possibility.originalMinCount;
            }
            if (possibility.charge > 0) {
                possibilities[i].minInnerCharge += possibility.charge * possibility.originalMinCount;
                possibilities[i].maxInnerCharge += possibility.charge * possibility.originalMaxCount;
            } else {
                possibilities[i].minInnerCharge += possibility.charge * possibility.originalMaxCount;
                possibilities[i].maxInnerCharge += possibility.charge * possibility.originalMinCount;
            }
        }
        if (possibilities[i].minInnerCharge || possibilities[i].maxInnerCharge) {
            possibilities[i].innerCharge = true;
        }
    }
    return possibilities;
};

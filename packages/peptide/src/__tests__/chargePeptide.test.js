'use strict';

var PEP = require('..');


describe('Checking charge peptide', () => {
    test('Check charge with default option', () => {
        var result=PEP.chargePeptide("HAlaGlyLysHisAspOH");
        expect(result).toEqual("H+HAlaGlyLys(H+)His(H+)AspOH");
    });

    test('Check charge with pH = 1', () => {
        var result=PEP.chargePeptide("HAlaGlyLysHisAspOH", {pH: 1});
        expect(result).toEqual("H+HAlaGlyLys(H+)His(H+)AspOH");
    });

    test('Check charge with pH = 7', () => {
        var result=PEP.chargePeptide("HAlaGlyLysHisAspOH", {pH: 7});
        expect(result).toEqual("H+HAlaGlyLys(H+)HisAsp(H-1-)O-");
    });

    test('Check charge with pH = 13', () => {
        var result=PEP.chargePeptide("HAlaGlyLysHisAspOH", {pH: 13});
        expect(result).toEqual("HAlaGlyLysHisAsp(H-1-)O-");
    });

    test('Charge an array of mfs', () => {
        var result=PEP.chargePeptide(["HAlaGlyLysHisAspOH","HLysHisAspOH"], {pH: 13});
        expect(result).toEqual(["HAlaGlyLysHisAsp(H-1-)O-","HLysHisAsp(H-1-)O-"]);
    });

});



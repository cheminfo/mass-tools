'use strict';

var PEP = require('..');


describe('Checking allow neutral loss of peptides', () => {
    test('Check neutral loss of AASTAARKAA', () => {
        var result=PEP.allowNeutralLoss("HAlaAlaSerThrAsp(H-1)GluArgLys(H+)AlaOH");
        expect(result).toEqual(
            "HAlaAlaSer(H-2O-1)0-1Thr(H-2O-1)0-1Asp(H-1)Glu(H-2O-1)0-1Arg(N-1H-3)0-1Lys(H+)AlaOH"
        );
    });
});



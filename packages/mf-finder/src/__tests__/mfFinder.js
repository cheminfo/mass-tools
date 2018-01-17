'use strict';

const findMFs = require('../');

describe('test mf-finder', () => {

    it('basic case', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
            ],
            precision: 1e5,
            allowNeutral: true
        });
        expect(result.mfs).toHaveLength(1);
    });

    it('simple combinations', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'H', min: 0, max: 1 },
            ],
            precision: 1e5,
            allowNeutral: true
        });
        expect(result.mfs).toHaveLength(2);
        expect(result.mfs[0].mf).toBe('C2');
        expect(result.mfs[1].mf).toBe('C2H');
    });

    it('simple combinations with optimisation', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
            ],
            precision: 1,
            allowNeutral: true
        });
        expect(result.info.numberMFEvaluated).toBe(7);
        expect(result.info.numberResults).toBe(1);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C2');
    });

    it('large combination', () => {
        let result = findMFs(1200.0000000001, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
                { mf: 'S', min: 0, max: 100 },
                { mf: 'N', min: 0, max: 100 },
                { mf: 'O', min: 0, max: 100 },
            ],
            precision: 0.00001,
            allowNeutral: true
        });
        expect(result.info.numberMFEvaluated).toBe(661599);
        expect(result.info.numberResults).toBe(1);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C100');
    });

    it('check brute force iteration', () => {

        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'H+', min: 0, max: 2 },
            ],
            precision: 1e5
        });

        //   console.log(result.mfs);
    });

    it('check one possibility 12', () => {
        let result = findMFs(12, {
            ranges: [
                { mf: 'C', min: 1, max: 1 },
            ]
        });
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C');
    });

    it('check one possibility 24', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
            ],
        });
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C2');
    });


    it('should yield to 3 results', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 3 },
                { mf: 'H', min: 0, max: 40 },
            ],
            precision: 10000
        });
        expect(result.mfs).toHaveLength(3);
    });


});

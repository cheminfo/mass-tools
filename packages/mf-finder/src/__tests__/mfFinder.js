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

    it('simple combinations with impossible', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'H', min: 0, max: 1 },
                { mf: 'S', min: 0, max: 100 },
            ],
            precision: 1e5,
            allowNeutral: true
        });
        expect(result.mfs).toHaveLength(2);
        expect(result.mfs[0].mf).toBe('C2');
        expect(result.mfs[1].mf).toBe('C2H');
    });

    it('simple combinations with optimisation for large values', () => {
        let result = findMFs(24.001, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
                { mf: 'S', min: 0, max: 100 },
            ],
            precision: 1000,
            allowNeutral: true
        });
        expect(result.info.numberResults).toBe(1);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C2');
    });

    it('simple combinations with 2 possibilities', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
                { mf: 'S', min: 0, max: 100 },
            ],
            precision: 10000,
            allowNeutral: true
        });
        expect(result.info.numberResults).toBe(3);
        expect(result.mfs).toHaveLength(3);
        expect(result.mfs[0].mf).toBe('C2');
        expect(result.mfs[1].mf).toBe('CH12');
        expect(result.mfs[2].mf).toBe('H24');
    });

    it('simple combinations with edge case', () => {
        let result = findMFs(1200.0001, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
            ],
            precision: 1,
            allowNeutral: true
        });
        expect(result.info.numberMFEvaluated).toBeLessThan(50);
        expect(result.info.numberResults).toBe(1);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C100');
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
            precision: 0.0001,
            allowNeutral: true
        });
        expect(result.info.numberMFEvaluated).toBeLessThan(500000);
        expect(result.info.numberResults).toBe(1);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C100');
    });

    it('check impossible charge', () => {

        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'H+', min: 0, max: 2 },
            ],
            precision: 1e4
        });
        expect(result.mfs).toHaveLength(0);
    });

    it('check charge', () => {

        let result = findMFs(12, {
            ranges: [
                { mf: 'C', min: 0, max: 2 },
                { mf: 'C+', min: 0, max: 2 },
            ],
            precision: 1e5
        });
        expect(result.mfs).toHaveLength(2);

        //      expect(result.mfs).toHaveLength(0);
    });

    it.only('check one possibility 12', () => {
        let result = findMFs(12, {
            ranges: [
                { mf: 'C', min: 1, max: 1 },
            ],
            allowNeutral: true
        });
        console.log(result);
        expect(result.mfs).toHaveLength(1);
        expect(result.mfs[0].mf).toBe('C');
    });

    it('check one possibility 24', () => {
        let result = findMFs(24, {
            ranges: [
                { mf: 'C', min: 0, max: 100 },
                { mf: 'H', min: 0, max: 100 },
            ],
            allowNeutral: true,
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
            precision: 10000,
            allowNeutral: true
        });
        expect(result.mfs).toHaveLength(3);
    });

    it('check one possibility 12 with charge', () => {
        let result = findMFs(12, {
            ranges: [
                { mf: 'C+', min: 1, max: 2 },
            ],
            allowNeutral: true
        });
        expect(result.mfs).toHaveLength(2);
        expect(result.mfs[0].mf).toBe('(C+)');
        expect(result.mfs[1].mf).toBe('(C+)2');
    });

});

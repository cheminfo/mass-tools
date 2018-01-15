'use strict';

const findMFs=require('../');

describe('test mf-finder', () => {
    it.only('check brute force iteration', () => {

        let result=findMFs(24, {
           ranges: [
                {mf:'C', min:0,max:2},
                {mf:'H+', min:0,max:2},
            ],
            precision: 1e5
        })

      //  console.log(result.mfs);
    });

    it('check one possibility 12', () => {
        let result=findMFs(12, {
           ranges: [
                {mf:'C', min:1,max:1},
            ]
        })
        expect(result.mfs.length).toBe(1);
        expect(result.mfs[0].mf).toBe('C');
    });

    it('check one possibility 24', () => {
        let result=findMFs(24, {
           ranges: [
                {mf:'C', min:0,max:100},
                {mf:'H', min:0,max:100},
            ],
        })
        expect(result.mfs.length).toBe(1);
        expect(result.mfs[0].mf).toBe('C2');
    });

   
    it('should yield to 3 results', () => {
        let result=findMFs(24, {
           ranges: [
                {mf:'C', min:0,max:3},
                {mf:'H', min:0,max:40},
            ],
            precision: 10000
        })
        expect(result.mfs.length).toBe(3);
    });


});

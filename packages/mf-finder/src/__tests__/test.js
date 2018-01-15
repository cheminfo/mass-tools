'use strict';

const findMFs=require('../');

describe('test mf-finder', () => {
    it('should return 42', () => {

        let results=findMFs(300, {
           ranges: [
                {
                    mf:'C',
                    min:0,
                    max:100
                },
                {
                    mf:'H+',
                    min:0,
                    max:5
                }
            ]
        })

    });
});

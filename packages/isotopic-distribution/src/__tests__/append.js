'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution append', () => {
    it('should append one distribution to another', () => {
        let dist1 = new Distribution();
        dist1.push(1, 2);
        dist1.push(2, 3);
        let dist2 = new Distribution();
        dist2.push(2, 4);
        dist2.push(3, 5);

        dist1.append(dist2);
        dist1.sortX();
        expect(dist1.array).toEqual([{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 5 }]);
    });
});

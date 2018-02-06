'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution multiply', () => {
    it('should yield the product', () => {
        let dist1 = new Distribution();
        dist1.push(1, 2);
        dist1.push(2, 3);
        let dist2 = new Distribution();
        dist2.push(1, 2);
        dist2.push(2, 3);
        let dist3 = dist1.multiply(dist2);
        dist3.sortX();
        expect(dist1.dist).toEqual([{ x: 2, y: 4 }, { x: 3, y: 12 }, { x: 4, y: 9 }]);
        expect(dist3.dist).toEqual([{ x: 2, y: 4 }, { x: 3, y: 12 }, { x: 4, y: 9 }]);
    });
});

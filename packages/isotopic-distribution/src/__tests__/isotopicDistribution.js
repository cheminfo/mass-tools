'use strict';

const IsotopicDistribution = require('../index.js');

describe('test isotopicDistribution', () => {

    it('create distribution of C1000', () => {
        let isotopicDistribution = new IsotopicDistribution('C1000');
        let distribution = isotopicDistribution.getDistribution();
        expect(distribution.array[0].x).toBe(12000);
    });

    it('create distribution of C10 and getXY', () => {
        let isotopicDistribution = new IsotopicDistribution('C10');
        let xy = isotopicDistribution.getXY();
        expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
        expect(xy.x[0]).toEqual(120);
        expect(xy.y[0]).toEqual(100);
    });

    it('create distribution of Ru5 and getXY', () => {
        let isotopicDistribution = new IsotopicDistribution('Ru5');
        let distribution = isotopicDistribution.getDistribution();
        expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
        distribution.maxToOne();
        let element = distribution.array[25];
        expect(element).toEqual({ x: 505.52516825500203, y: 1 });
    });

    it('create distribution of C1000H1000', () => {
        let isotopicDistribution = new IsotopicDistribution('C1000H1000');
        let distribution = isotopicDistribution.getDistribution();
        expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
        distribution.maxToOne();
        distribution.sortY();
        expect(distribution.array[0]).toEqual({ x: 13017.858890698088, y: 1 });

    });

    it('create distribution of C1000H1000N1000', () => {
        let isotopicDistribution = new IsotopicDistribution('C1000H1000N1000');
        let distribution = isotopicDistribution.getDistribution();
        expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
        distribution.maxToOne();
        distribution.sortY();
        expect(distribution.array[0]).toEqual({ x: 27024.926947823435, y: 1 });
    });

    it('create distribution of Ala1000', () => {
        let isotopicDistribution = new IsotopicDistribution('Ala1000');
        let distribution = isotopicDistribution.getDistribution();
        expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
        distribution.maxToOne();
        distribution.sortY();
        expect(distribution.array[0]).toEqual({ x: 71076.21791348715, y: 1 });
    });

});

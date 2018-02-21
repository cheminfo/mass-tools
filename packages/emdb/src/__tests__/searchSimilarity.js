'use strict';

const DBManager = require('..');

describe('test searchSimilarity', () => {
    it('should find one result with bad distribution', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120], y: [1] }, {
            precision: 1000,
            widthBottom: 0.05,
            widthTop: 0.01,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test).toMatchSnapshot();
        expect(results.test[0].ms.similarity.value).toBeCloseTo(0.898, 2);
    });

    it('should find one result with bad bad distribution, small window', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120, 121], y: [1, 1] }, {
            precision: 1000,
            from: 120 - 0.5,
            to: 120 + 0.5,
            widthBottom: 0.1,
            widthTop: 0.1,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test[0].ms.similarity.value).toBe(1);
    });

    it('should find one result with bad bad distribution, large window', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120], y: [1] }, {
            precision: 1000,
            from: 120 - 0.5,
            to: 120 + 2.5,
            widthBottom: 0.1,
            widthTop: 0.1,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test[0].ms.similarity.value).toBeCloseTo(0.895, 2);
    });

    it('should find one result with bad bad distribution, large window huge width ', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120], y: [1] }, {
            precision: 1000,
            from: 120 - 0.5,
            to: 120 + 2.5,
            widthBottom: 5,
            widthTop: 5,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test[0].ms.similarity.value).toBe(1);
    });

    it('should find one result with overlap', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120], y: [1] }, {
            precision: 1000,
            widthBottom: 0.05,
            widthTop: 0.01,
            from: 120 - 0.5,
            to: 120 + 2.5,
            common: 'first', // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test[0].ms.similarity.value).toBe(1);
    });

    it('should find one result with good distribution', () => {
        let dbManager = new DBManager();
        dbManager.loadTest();
        let results = dbManager.searchSimilarity(120, { x: [120, 121], y: [1, 0.11] }, {
            precision: 1000,
            widthBottom: 0.05,
            widthTop: 0.01,
            common: undefined, // 'first', 'second', 'both' (or true) or 'none' (or undefined)
        });
        expect(results.test[0].ms.similarity.value).toBeCloseTo(0.995, 2);
    });

});

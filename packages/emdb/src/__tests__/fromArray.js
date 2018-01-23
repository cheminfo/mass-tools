'use strict';

const DBManager = require('..');

test('test fromArray', () => {
    let dbManager = new DBManager();
    dbManager.fromArray(['C.N', 'N.O']);
    expect(dbManager.databases.generated).toHaveLength(4);
});

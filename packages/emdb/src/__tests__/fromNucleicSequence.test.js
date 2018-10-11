'use strict';

const DBManager = require('..');

test('test fromNucleicSequence', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AAA', {
    ionizations: 'H+,Na+',
    fragmentation: {
      a: true
    },
    info: {
      kind: 'dna'
    }
  });

  expect(dbManager.databases.nucleic).toHaveLength(6);
  expect(dbManager.databases.nucleic).toMatchSnapshot();
});

test('test fromNucleicSequence ds-DNA', () => {
  let dbManager = new DBManager();
  dbManager.fromNucleicSequence('AAA', {
    ionizations: 'H+,Na+',
    fragmentation: {
      a: true
    },
    info: {
      kind: 'dsdna'
    }
  });

  expect(dbManager.databases.nucleic).toHaveLength(12);
  expect(dbManager.databases.nucleic).toMatchSnapshot();
});

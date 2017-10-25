'use strict';

const toCsv = require('../src/unmerge/toCsv');

describe('unmerge.toTable', function() {
  it('Breaks a list of JSON objects into table form', function(done) {
    const items = [
      { foo: 1, bar: { baz: 3 } },
      { foo: 2, bar: { baz: 2 } },
      { foo: 3, bar: { baz: 1 } },
      { foo: 4, bar: { baz: 2 } },
      { foo: 5, bar: { baz: 3 } },
      { foo: 6, bar: { baz: 3 } },
      { foo: 7, bar: { baz: 3 } },
      { foo: 8, bar: { baz: 2 } },
      { foo: 9, bar: { baz: 2 } },
      { foo: 10, bar: { baz: 2 } },
      { foo: 11, bar: { baz: 3 } },
      { foo: 12, bar: { baz: 5 } },
      { foo: 13, bar: { baz: 5 } }
    ];

    toCsv([['foo'],['bar','baz']], items).then(csv => {
      expect(csv).toEqual(
        'foo,bar.baz\n' +
        '1,3\n' +
        '2,2\n' +
        '3,1\n' +
        '4,2\n' +
        '5,3\n' +
        '6,3\n' +
        '7,3\n' +
        '8,2\n' +
        '9,2\n' +
        '10,2\n' +
        '11,3\n' +
        '12,5\n' +
        '13,5\n');
    }).then(done).catch(done.fail);
  });
});

'use strict';

const toTable = require('../src/unmerge/toTable');

describe('unmerge.toTable', function() {
  it('Breaks a list of JSON objects into table form', function() {
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

    expect(toTable([['foo'],['bar','baz']], items)).toEqual(
      [['foo', 'bar.baz'],
        [1,3],
        [2,2],
        [3,1],
        [4,2],
        [5,3],
        [6,3],
        [7,3],
        [8,2],
        [9,2],
        [10,2],
        [11,3],
        [12,5],
        [13,5]]);
  });
});

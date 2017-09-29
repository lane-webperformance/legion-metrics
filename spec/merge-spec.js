'use strict';

Error.stackTraceLimit=Infinity;

require('jasmine-immutablejs-matchers');

const merge = require('../src/index').merge;

describe('The sum metrics operation', function() {
  it('can merge numerical values', function() {
    expect(merge.algorithm({$sum:5},{$sum:7})).toEqual({$sum:12});
    expect(merge.algorithm({$min:5},{$min:7})).toEqual({$min:5});
    expect(merge.algorithm({$max:5},{$max:7})).toEqual({$max:7});
    expect(merge.algorithm({$avg:merge.avg.singleton(5)},{$avg:merge.avg.singleton(7)})).toEqual({$avg:{avg:6,size:2}});
  });
});

describe('The merge metrics operations', function() {
  it('can merge homogenous objects', function() {
    const sample_1 = {
      '$min': 5,
      '$max': 5,
      '$avg': merge.avg.singleton(5),
      'total$sum': 5,
      'count$sum': 1 };

    const sample_2 = {
      '$min': 3,
      '$max': 3,
      '$avg': merge.avg.singleton(3),
      'total$sum': 3,
      'count$sum': 1 };

    const result = merge.algorithm(sample_1, sample_2);

    expect(result).toEqual({
      '$min': 3,
      '$max': 5,
      '$avg' : { avg: 4, size: 2 },
      'total$sum': 8,
      'count$sum': 2 });
  });

  it('can merge heterogenous objects', function() {
    const sample_1 = {
      'data': { '$min': 3, '$max': 5 },
      '$sum': -1 };

    const sample_2 = {
      'ok': { '$sum': 2 },
      '$sum': 1 };

    const sample_3 = {
      'data': { '$sum': 20 } };

    let result = merge.algorithm(sample_1, sample_2);
    result = merge.algorithm(result, sample_3);

    expect(result).toEqual({
      'data': { '$min': 3, '$max': 5, '$sum' : 20 },
      'ok': { '$sum': 2 },
      '$sum': 0});
  });

  it('can merge arbitrarily large arrays into randomly selected samples (known as a reservoir)', function() {
    function makeHugeArray() {
      const result = [];
      for( let i = 0; i < 10000; i++ )
        result.push(i);
      return result;
    }

    const sample_1 = { 'foo$reservoir': merge.reservoir.set(['foo','bar']) };
    const sample_2 = { 'foo$reservoir': merge.reservoir.singleton('baz') };
    const sample_3 = { 'foo$reservoir': merge.reservoir.set(makeHugeArray()) };

    console.log('This is an example of a reservoir: ' + JSON.stringify(sample_1)); // eslint-disable-line no-console
    console.log('This is an example of the result of merging two reservoirs: ' + JSON.stringify((merge.algorithm(sample_1,sample_2)))); // eslint-disable-line no-console
    expect(merge.algorithm(sample_1,sample_2).foo$reservoir.population_size).toEqual(3);
    expect(merge.reservoir.get(merge.algorithm(sample_1,sample_2).foo$reservoir).reserve.sort()).toEqual(['bar','baz','foo']);
    expect(merge.reservoir.get(merge.algorithm(sample_1,sample_2).foo$reservoir).population_size).toEqual(3);

    expect(merge.reservoir.get(merge.algorithm(null, sample_2).foo$reservoir)).toEqual({
      reserve: ['baz'],
      population_size: 1
    });

    // Checking that keys are actually sorted from largest to smallest, by checking what should be the largest of 10000 keys
    expect(merge.algorithm(sample_3, sample_3).foo$reservoir.reserve[0].key).toBeGreaterThan(0.9);

    expect(merge.reservoir.get(merge.algorithm(sample_1, sample_3)['foo$reservoir']).population_size).toEqual(10002);
    expect(merge.reservoir.get(merge.algorithm(sample_1, sample_3)['foo$reservoir']).reserve.length).toBeLessThan(200);
    expect(merge.reservoir.get(merge.algorithm(sample_1, sample_3)['foo$reservoir']).reserve.length).toBeGreaterThan(100);
  });

  it('can generally eliminate duplicates from reservoirs', function() {
    let result = null;

    for( let i = 0; i < 10000; i++ )
      result = merge.algorithm(result, { 'foo$reservoir': merge.reservoir.singleton(Math.random() < 0.1 ? 'foo' : 'bar') });

    expect(merge.reservoir.get(result['foo$reservoir']).population_size).toEqual(10000);
    expect(merge.reservoir.get(result['foo$reservoir']).reserve.length).toBe(2);
    expect(merge.reservoir.get(result.foo$reservoir).reserve.sort()).toEqual(['bar','foo']);
  });
});

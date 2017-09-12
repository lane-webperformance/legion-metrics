/* eslint-disable no-console */
'use strict';

const merge = require('../src/merge');

describe('The average merge operator', function() {
  it('accurately averages huge lists of numbers', function() {
    const list = [];

    for( let i = 0; i < 1000000; i++ ) {
      const x = Math.random();
      const y = 1-x;

      list.push(x);
      list.push(y);
    }

    let running_average = { avg$avg : merge.avg.singleton(list.pop()) };

    while( list.length > 0 )
      running_average = merge.algorithm(running_average, { avg$avg : merge.avg.singleton(list.pop())});

    expect(running_average.avg$avg.avg).toBeGreaterThan(0.499);
    expect(running_average.avg$avg.avg).toBeLessThan(0.501);
    expect(running_average.avg$avg.size).toBe(2000000);
  });
});

/* eslint-disable no-console */
'use strict';

const avg = require('../src/merge/avg');

describe('The average merge operator', function() {
  it('accurately averages huge lists of numbers', function() {
    const list = [];

    for( let i = 0; i < 1000000; i++ ) {
      const x = Math.random();
      const y = 1-x;

      list.push(x);
      list.push(y);

      if( i % 10000 === 0 )
        console.log(2*i);
    }

    let running_average = avg.singleton(list.pop());

    while( list.length > 0 ) {
      running_average = avg(running_average, avg.singleton(list.pop()));
      if( list.length % 10000 === 0 )
        console.log(list.length);
    }

    expect(running_average.avg).toBeGreaterThan(0.499);
    expect(running_average.avg).toBeLessThan(0.501);
    expect(running_average.size).toBe(2000000);
  });
});

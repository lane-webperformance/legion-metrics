'use strict';

Error.stackTraceLimit=Infinity;

const metrics = require('../src/index');

describe('The merge operation', function() {
  it('can merge the summarized output of various samples', function() {

    const s1 = metrics.sample({
      foo : {
        value: 10,
        unit: 'foo/second',
        interpretation: 'number of foos per second'
      }
    });
      
    const s2 = metrics.sample({
      foo : {
        value: 30,
        unit: 'foo/second',
        interpretation: 'number of foos per second'
      }
    });

    const s3 = metrics.sample({
      foo : {
        value: 20,
        unit: 'foo/second',
        interpretation: 'number of foos per second'
      }
    });

    const p1 = metrics.problem(new Error('example problem'));
    const p2 = metrics.problem(new Error('another example problem'));

    let result = s1.summarize();
    result = metrics.merge.algorithm(result, s2.summarize());
    result = metrics.merge.algorithm(result, s3.summarize());
    result = metrics.merge.algorithm(result, p1.summarize());
    result = metrics.merge.algorithm(result, p2.summarize());

    expect(result.values.foo.$min).toEqual(10);
    expect(result.values.foo.$max).toEqual(30);
    expect(result.values.foo.$avg.avg).toEqual(20);
    expect(metrics.merge.reservoir.get(result.values.foo.unit$reservoir).reserve).toEqual(['foo/second']);
    expect(metrics.merge.reservoir.get(result.problems.problems$reservoir).reserve.length).toEqual(2);
  });
});

'use strict';

const sample = require('../src/index').sample;

describe('The sample function', function() {
  it('can report a sample summary', function() {
    const s = sample( {
      myValue : {
        value : 5, 
        unit : 'seconds',
        interpretation : 'myValue in seconds'
      },
      kittens : {
        value : 2,
        unit : 'felines',
        interpretation : 'number of kittens in household'
      },
      timestamp: sample.timestamp(1000000)
    });

    expect(s.summarize().values.myValue.$min).toEqual(5);
    expect(s.summarize().values.myValue.$max).toEqual(5);
    expect(s.summarize().values.myValue.$avg.avg).toEqual(5);
    expect(s.summarize().values.myValue.$avg.size).toEqual(1);
    expect(s.summarize().values.kittens.$min).toEqual(2);
    expect(s.summarize().values.kittens.$max).toEqual(2);
    expect(s.summarize().values.kittens.$avg.avg).toEqual(2);
    expect(s.summarize().values.kittens.$avg.size).toEqual(1);
    expect(s.summarize().values.timestamp.$min).toBe(1000000);
    expect(s.summarize().values.timestamp.$max).toBe(1000000);

    expect(s.summarize().values.kittens.unit$reservoir.reserve[0].value).toEqual('felines');
    expect(s.summarize().values.kittens.interpretation$reservoir.reserve[0].value).toEqual('number of kittens in household');
  });

  it('returns a sample event', function() {
    const s = sample( {
      duration: sample.duration(5),
      timestamp: sample.timestamp()
    });

    expect(s.type).toEqual('sample');
    expect(s.values.duration.value).toEqual(5);
    expect(s.values.timestamp.value).not.toBeGreaterThan(Date.now());
    expect(s.values.timestamp.value).toBeGreaterThan(Date.now()-100);
  });

  it('does not accept various bogus values', function() {
    expect(() => sample('foo')).toThrow();
    expect(() => sample(5)).toThrow();
    expect(() => sample({ foo: {}})).toThrow();
    expect(() => sample({ foo: { value: 'foo' }})).toThrow();
  });
});

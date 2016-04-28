
var sample = require('../src/index').sample;

describe('The sample function', function() {
  it('can report a sample summary', function() {
    expect(sample(5).summarize().value$min).toEqual(5);
    expect(sample(5).summarize().value$max).toEqual(5);
    expect(sample(5).summarize().total$sum).toEqual(5);
    expect(sample(5).summarize().count$sum).toEqual(1);
    expect(sample(5).summarize().time$min).not.toBeGreaterThan(Date.now());
    expect(sample(5).summarize().time$min).toBeGreaterThan(Date.now()-100);
    expect(sample(5).summarize().time$max).not.toBeGreaterThan(Date.now());
    expect(sample(5).summarize().time$max).toBeGreaterThan(Date.now()-100);
  });

  it('returns a sample event', function() {
    expect(sample(2).type).toEqual('sample');
    expect(sample(2).value).toEqual(2);
    expect(sample(2).time).not.toBeGreaterThan(Date.now());
    expect(sample(2).time).toBeGreaterThan(Date.now()-100);
  });

  it('does not try to summarize a non-numerical value', function() {
    expect(sample('foo').summarize()).toEqual({});
  });
});

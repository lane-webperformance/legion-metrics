'use strict';

const MetricsTarget = require('../src/index').Target;

const merge = {
  'root' : function(a,b) {
    if( a === null )
      return b;
    if( typeof a === 'number' )
      return Math.max(a,b);
    if( Array.isArray(a) )
      return [].concat(a,b);
  }
};

describe('The MetricsTarget object', function() {
  it('can identify whether or not something is a MetricsTarget', function() {
    expect(MetricsTarget.isTarget(MetricsTarget.create(merge))).toBe(true);
    expect(MetricsTarget.isTarget(MetricsTarget.create(merge).receiver())).toBe(false);
    expect(MetricsTarget.isTarget({ 'foo' : 'bar' })).toBe(false);
  });

  it('can identify whether or not something is a MetricsReceiver', function() {
    expect(MetricsTarget.isReceiver(MetricsTarget.create(merge))).toBe(false);
    expect(MetricsTarget.isReceiver(MetricsTarget.create(merge).receiver())).toBe(true);
    expect(MetricsTarget.isReceiver({ 'foo' : 'bar' })).toBe(false);
  });

  it('supports a create() operation', function() {
    expect(MetricsTarget.create(merge)).toBeDefined();
    expect(function() { return MetricsTarget.create(); }).toThrow();
  });

  it('supports creating MetricsReceivers', function() {
    expect(MetricsTarget.create(merge).receiver()).toBeDefined();
  });

  it('supports merging one metrics object via a MetricsReceiver', function() {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return [x]; });

    receiver.receive(1);

    expect(target.get()).toEqual([1]);
  });

  it('supports a summarize() method on each sample and intersectional summaries', function() {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(_x,x_summary) { return x_summary; });

    receiver.receive({ summarize: function() { return 2; } });
    receiver.receive({ summarize: function() { return 1; } });

    expect(target.get()).toEqual(2);
  });

  it('supports clearing and returning its current value', function() {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return [x]; });

    receiver.receive(1);

    const value = target.clear();

    expect(value).toEqual([1]);
    expect(target.get()).toBe(null);
  });

  it('supports chaining a tagged MetricsReceiver', function() {
    const target = MetricsTarget.create(merge);

    const tag_identity = function(x) { return [x]; };
    const tag_upper = function(x) { return [x.toUpperCase()]; };

    target.receiver().tag(tag_identity).receive('foo');
    target.receiver().tag(tag_upper).receive('bar');
    target.receiver().tag(tag_identity, tag_upper).receive('baz');

    expect(target.get()[0]).toEqual('foo');
    expect(target.get()[1]).toEqual('BAR');
    //iteration order is undefined . . .
    expect(target.get()[2] === 'BAZ' || target.get()[3] === 'BAZ').toBe(true);
    expect(target.get()[2] === 'baz' || target.get()[3] === 'baz').toBe(true);
  });

  it('can merge a lot of stuff', function() {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return x; });

    const start_time = Date.now();
    for( let i = 0; i < 100000; i++ ) {
      receiver.receive(Math.random());
    }
    const stop_time = Date.now();

    expect(target.get()).toBeGreaterThan(0.9);
    expect(target.get()).toBeLessThan(1.0);
    expect(stop_time - start_time).toBeLessThan(1000*60);
  });
});

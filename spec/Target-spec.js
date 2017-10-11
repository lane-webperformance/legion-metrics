'use strict';

const MetricsTarget = require('../src/index').Target;

const merge = {
  'algorithm' : function(a,b) {
    if( a === null )
      return b;
    if( typeof a === 'number' )
      return Math.max(a,b);
    if( Array.isArray(a) )
      return [].concat(a,b);
    throw new Error('unhandled case');
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
    expect(MetricsTarget.create(merge.algorithm)).toBeDefined();
    expect(function() { return MetricsTarget.create(); }).toThrow();
  });

  it('supports default callback that is equivalent to just calling get()', function(done) {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(x => [x]);

    for( let i = 0; i < 10; i++ )
      receiver.receive(i); //this actually queues up 10 callbacks that should all fire at once . . .

    target.get()
      .then(x => expect(x).toEqual([0,1,2,3,4,5,6,7,8,9]))
      .then(() => target.flush())
      .then(x => expect(x).toEqual([0,1,2,3,4,5,6,7,8,9]))
      .then(done).catch(done.fail);
  });

  it('supports callbacks', function(done) {
    let n = 0;
    const callback = t => {
      expect(MetricsTarget.isTarget(t)).toBe(true);
      n++;
      return 'hello, world';
    };
    const target = MetricsTarget.create(merge,callback);
    const receiver = target.receiver().tag(x => [x]);

    for( let i = 0; i < 10; i++ )
      receiver.receive(i);

    target.get()
      .then(x => expect(x).toEqual([0,1,2,3,4,5,6,7,8,9]))
      .then(() => target.flush())
      .then(x => expect(x).toBe('hello, world'))
      .then(() => expect(n).toBe(11))
      .then(done).catch(done.fail);
  });

  it('supports creating MetricsReceivers', function() {
    expect(MetricsTarget.create(merge).receiver()).toBeDefined();
  });

  it('supports merging one metrics object via a MetricsReceiver', function(done) {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return [x]; });

    receiver.receive(1);

    target.get().then(x => expect(x).toEqual([1])).then(done).catch(done.fail);
  });

  it('supports a summarize() method on each sample and intersectional summaries', function(done) {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(_x,x_summary) { return x_summary; });

    receiver.receive({ summarize: function() { return 2; } });
    receiver.receive({ summarize: function() { return 1; } });

    target.get().then(x => expect(x).toEqual(2)).then(done).catch(done.fail);
  });

  it('supports a summarize() method on each sample and intersectional summaries (initializing with merge.algorithm instead of merge)', function(done) {
    const target = MetricsTarget.create(merge.algorithm);
    const receiver = target.receiver().tag(function(_x,x_summary) { return x_summary; });

    receiver.receive({ summarize: function() { return 2; } });
    receiver.receive({ summarize: function() { return 1; } });

    target.get().then(x => expect(x).toEqual(2)).then(done).catch(done.fail);
  });

  it('supports clearing and returning its current value', function(done) {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return [x]; });

    receiver.receive(1);

    target.clear()
      .then(x => expect(x).toEqual([1]))
      .then(() => target.get())
      .then(x => expect(x).toBe(null))
      .then(done).catch(done.fail);
  });

  it('supports chaining a tagged MetricsReceiver', function(done) {
    const target = MetricsTarget.create(merge);

    const tag_identity = function(x) { return [x]; };
    const tag_upper = function(x) { return [x.toUpperCase()]; };

    target.receiver().tag(tag_identity).receive('foo');
    target.receiver().tag(tag_upper).receive('bar');
    target.receiver().tag([tag_identity, tag_upper]).receive('baz');

    target.get().then(x => {
      expect(x[0]).toEqual('foo');
      expect(x[1]).toEqual('BAR');
      //iteration order is undefined . . .
      expect(x[2] === 'BAZ' || x[3] === 'BAZ').toBe(true);
      expect(x[2] === 'baz' || x[3] === 'baz').toBe(true);
    }).then(done).catch(done.fail);
  });

  it('rejects attempts to call tag() with multiple arguments (historically, this could be done, but is no longer supported and I want to fail-fast if it happens)', function(done) {
    const target = MetricsTarget.create(merge);

    const tag_identity = function(x) { return [x]; };
    const tag_upper = function(x) { return [x.toUpperCase()]; };

    expect(() => target.receiver().tag(tag_identity, tag_upper).receive('baz')).toThrow();

    target.get().then(x => expect(x).toEqual(null)).then(done).catch(done.fail);
  });


  it('can merge a lot of stuff quickly', function(done) {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return x; });

    const start_time = Date.now();
    for( let i = 0; i < 10000; i++ ) {
      receiver.receive(Math.random());
    }

    target.get().then(x => {
      const stop_time = Date.now();
      expect(x).toBeGreaterThan(0.9);
      expect(x).toBeLessThan(1.0);
      expect(stop_time - start_time).toBeLessThan(1000*60);
    }).then(done).catch(done.fail);
  });

  it('maintains a problem counter', function() {
    const target = MetricsTarget.create(merge);
    const receiver = target.receiver().tag(function(x) { return x; });

    receiver.receive(Math.random());
    receiver.receive(Math.random());
    receiver.receive(Math.random());
    receiver.incrementProblems();
    receiver.incrementProblems();
    receiver.receive(Math.random());
    receiver.incrementProblems();

    expect(target.getProblemCount()).toBe(3);
  });
});

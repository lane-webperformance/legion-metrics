'use strict';

const summary = require('../src/index').summary;

describe('The sample.summary function', function() {
  it('can provide the encapsulated summary', function() {
    expect(summary({ foo:  2 }).summarize()).toEqual({ foo: 2 });
  });

  it('returns a summary wrapper', function() {
    expect(summary({ foo: 2 }).type).toEqual('summary');
  });
});

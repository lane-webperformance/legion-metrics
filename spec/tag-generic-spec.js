'use strict';

const sample = require('../src/index').sample;
const tags = require('../src/index').tags;

describe('Generic tagging', function() {
  it('can tag a sample by outcome', function() {
    const x = sample({ foo: { value: 7 }});

    const tagged_x = tags.outcome.success(x, x.summarize());

    expect(tagged_x.tags.outcome.success.values.foo.$avg.avg).toBe(7);
    expect(tagged_x.tags.outcome.success.values.foo.$min).toBe(7);
  });

  it('resists applying the same tag twice', function() {
    const x = sample({ foo: { value: 7 }});

    const smry = x.summarize();
    tags.outcome.success(x, smry);
    
    expect(function() { tags.outcome.success(x, smry); }).toThrow();
  });

  it('leaves a trace on the sample', function() {
    const x = sample({ foo: { value: 7 }});

    const smry = x.summarize();
    tags.outcome.success(x, smry);

    expect( x.tags.outcome ).toEqual(['success']);
    expect( JSON.parse(JSON.stringify(x)).tags.outcome ).toEqual(['success']);
  });

  it('leaves a trace on the summary', function() {
    const x = sample({ foo: { value: 7 }});

    const smry = x.summarize();
    tags.outcome.success(x, smry);

    expect( smry.tags.outcome.success.values.foo.$max ).toEqual( 7 );
  });
});

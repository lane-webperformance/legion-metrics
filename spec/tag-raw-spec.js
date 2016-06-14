'use strict';

const sample = require('../src/index').sample;
const tags = require('../src/index').tags;

describe('Raw tagging', function() {
  it('can collect individual samples into a collection', function() {
    const x = sample({ foo: { value: 7 }});

    const tagged_x = tags.raw(x, x.summarize());

    expect(tagged_x.raw$events.length).toBe(1);
  });
});

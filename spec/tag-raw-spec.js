
var sample = require('../src/index').sample;
var tags = require('../src/index').tags;

describe('Raw tagging', function() {
  it('can collect individual samples into a collection', function() {
    var x = sample(7);

    var tagged_x = tags.raw(x, x.summarize());

    expect(tagged_x.raw$events.length).toBe(1);
  });
});

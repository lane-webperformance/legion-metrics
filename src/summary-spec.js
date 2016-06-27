'use strict';

const metrics = require('../src/index');

describe('The summary object', function() {
  it('serves as a raw container for summaries', function() {
    const x = metrics.sample({ duration: { value: 5 } });

    const x_summary = metrics.summary(x.summarize());
    
    expect(x_summary.summarize()).toEqual(x.summarize());
  });
});

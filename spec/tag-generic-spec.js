
var sample = require('../src/index').sample;
var tags = require('../src/index').tags;

describe('Generic tagging', function() {
  it('can tag a sample by outcome', function() {
    var x = sample(7);

    var tagged_x = tags.outcome.success(x, x.summarize());

    expect(tagged_x.tags.outcome.success.total$sum).toBe(7);
    expect(tagged_x.tags.outcome.success.value$min).toBe(7);
  });

  it('resists applying the same tag twice', function() {
    var x = sample(7);

    var smry = x.summarize();
    tags.outcome.success(x, smry);
    
    expect(function() { tags.outcome.success(x, smry); }).toThrow();
  });

  it('leaves a trace on the sample', function() {
    var x = sample(7);

    var smry = x.summarize();
    tags.outcome.success(x, smry);

    expect( x.tags.outcome ).toEqual(['success']);
  });

  it('leaves a trace on the summary', function() {
    var x = sample(7);

    var smry = x.summarize();
    tags.outcome.success(x, smry);

    expect( smry.tags.outcome.success.total$sum ).toEqual( 7 );
  });
});

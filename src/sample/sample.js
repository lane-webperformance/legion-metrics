
var Sample = {};

Sample.summarize = function() {
  if( typeof this.value === 'number' ) {
    return {
      value$max: this.value,
      value$min: this.value,
      time$max: this.time,
      time$min: this.time,
      total$sum: this.value,
      count$sum: 1 };
  }

  return {};
};

module.exports = function(value, details) {
  return Object.assign(
    Object.create(Sample),{
      type:  'sample',
      value: value,
      time:  Date.now()},
    details);
};

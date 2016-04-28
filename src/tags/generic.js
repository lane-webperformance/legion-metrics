
var R = require('ramda');

module.exports = function(axis,tag) {
  return function(sample,summary) {
    sample.tags = sample.tags || [];
    sample.tags[axis] = sample.tags[axis] || [];
    sample.tags[axis].push(tag);

    summary.tags = summary.tags || {};
    summary.tags[axis] = summary.tags[axis] || {};
    if( typeof summary.tags[axis][tag] !== 'undefined' )
      throw new Error('Tag already defined for sample summary: ' + axis+'.'+tag + ' ');
    summary.tags[axis][tag] = sample.summarize();

    var result = { tags: {} };
    result.tags[axis] = {};
    result.tags[axis][tag] = summary;
    return result;
  };
};

module.exports = R.curry(module.exports);

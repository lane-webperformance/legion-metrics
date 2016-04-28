var merge = {};

merge.sum = require('./sum');
merge.max = require('./max');
merge.min = require('./min');
merge.set = require('./set');
merge.events = merge.set;
merge.object = require('./object');
merge.root = function(a,b) {
  a = a || {};
  b = b || {};

  if( typeof a === 'object' )
    return merge.object(a,b);

  throw new Error('Not sure what to do with ' + typeof a + ' (' + a + ')');
};

module.exports = merge;

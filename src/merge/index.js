'use strict';

const merge = {};

merge.avg = require('./avg');
merge.events = require('./set');
merge.max = require('./max');
merge.min = require('./min');
merge.object = require('./object');
merge.set = require('./set');
merge.sum = require('./sum');

merge.root = function(a,b) {
  a = a || {};
  b = b || {};

  if( typeof a === 'object' )
    return merge.object(a,b);

  throw new Error('Not sure what to do with ' + typeof a + ' (' + a + ')');
};

module.exports = merge;

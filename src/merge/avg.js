'use strict';

module.exports = function(a,b) {
  return {
    avg : (a.avg*a.size + b.avg*b.size)/(a.size+b.size),
    size : a.size + b.size
  };
};

module.exports.singleton = function(value) {
  if( typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) )
    throw new Error('not a number');

  return {
    avg : value,
    size : 1
  };
};

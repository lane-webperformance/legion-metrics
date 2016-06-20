'use strict';

function assertNumber(value) {
  if( typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) )
    throw new Error('not a number');

  return value;
}

function assertAvg(o) {
  try {
    assertNumber(o.avg);
    assertNumber(o.size);
  } catch(e) {
    throw new Error('not a valid average object: ' + o);
  }

  return o;
}

module.exports = function(a,b) {
  assertAvg(a);
  assertAvg(b);

  return assertAvg({
    avg : (a.avg*a.size + b.avg*b.size)/(a.size+b.size),
    size : a.size + b.size
  });
};

module.exports.singleton = function(value) {
  assertNumber(value);

  return {
    avg : value,
    size : 1
  };
};

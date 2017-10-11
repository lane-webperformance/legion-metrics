'use strict';

const reservoir = require('../merge/reservoir');

const Problem = {};

Problem.summarize = function() {
  return {
    problems : {
      problems$sum : 1,
      problems$reservoir : reservoir.singleton(JSON.parse(JSON.stringify(this))),
      time$min : this.time,
      time$max : this.time
      //TODO: hash problems by stack trace?
    }
  };
};

module.exports = function(err, details) {
  try {
    return Object.assign(
      Object.create(Problem), {
        type: 'problem',
        name: err.name ? err.name : 'name unknown',
        message: err.message ? err.message : (typeof err === 'string' ? err : 'message unknown'),
        stack : err.stack ? err.stack : 'stack trace unknown',
        time : Date.now()},
      details);
  } catch(_) {
    return Object.assign(
      Object.create(Problem), {
        type: 'problem',
        name: 'unhandled exception',
        message: 'I would try to provide more details about this error, but the error handler also threw an exception.',
        stack : 'stack trace unknown',
        time : Date.now() },
      details);
  }
};

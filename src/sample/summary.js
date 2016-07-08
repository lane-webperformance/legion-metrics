'use strict';

const Summary = {};

Summary.summarize = function() {
  return this.summary;
};

module.exports = function(summary) {
  return Object.assign(Object.create(Summary), {
    type : 'summary',
    summary : summary
  });
};

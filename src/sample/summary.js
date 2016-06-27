'use strict';

const Summary = {};

Summary.summarize = function() {
  return this.summary;
};

module.exports = function(summary) {
  return {
    type : 'summary',
    summary : summary
  };
};

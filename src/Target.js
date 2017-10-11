'use strict';

const immutable = require('immutable');
const throttle = require('./throttle');

const MetricsTarget = {
  _callback : target => target.get(),
  _metrics : Promise.resolve(null),
  _problems : 0,
  _merge : function() { throw new Error('MetricsTarget._merge: not defined'); },
  _type : 'legion-metrics/MetricsTarget'
};

MetricsTarget.receiver = function() {
  return Object.assign(Object.create(MetricsReceiver), {
    _target : this
  });
};

MetricsTarget.get = function() {
  return this._metrics;
};

MetricsTarget.flush = function() {
  return Promise.resolve(this).then(this._callback).catch(ex => {
    console.error('buggy callback attached to metrics target: ' + ex); //eslint-disable-line no-console
    throw ex;
  });
};

MetricsTarget.clear = function() {
  const result = this._metrics;
  this._metrics = this._metrics.then(() => MetricsTarget._metrics);

  if( this._problems )
    console.error('MetricsTarget.clear(): cleared ' + this._problems + ' problems.'); //eslint-disable-line no-console
  this._problems = MetricsTarget._problems;

  return result;
};

MetricsTarget.getProblemCount = function() {
  return this._problems;
};

const MetricsReceiver = {
  _target : undefined,
  _tags : immutable.Set(),
  _type : 'legion-metrics/MetricsReceiver'
};

MetricsReceiver.incrementProblems = function() {
  this._target._problems++;
};

MetricsReceiver.receive = function(sample) {
  this._target._metrics = this._target._metrics.then(throttle).then(m => {
    const sample_summary = sample.summarize ? sample.summarize() : {};
    const tagged_metrics = this._tags.map(function(tag) {
      return tag(sample, sample_summary);
    });

    m = Promise.resolve(m);

    tagged_metrics.forEach((item_to_merge) => {
      m = m.then(throttle).then(m => this._target._merge(m, item_to_merge));
    });

    return m;
  });

  this._target.flush();

  return this;
};

MetricsReceiver.tag = function(tag_or_tags) {
  if( arguments.length !== 1 )
    throw new Error('MatricsReceiver.tag() accepts one argument (tag or array of tags)');

  return Object.assign(Object.create(MetricsReceiver), {
    _target : this._target,
    _tags : this._tags.union(Array.isArray(tag_or_tags) ? tag_or_tags : [tag_or_tags])
  });
};

module.exports.create = function(algorithm, callback) {
  if( algorithm.algorithm )
    algorithm = algorithm.algorithm.bind(algorithm);

  if( typeof algorithm !== 'function' )
    throw new Error('MetricsTarget.create(merge): must provide a metrics merge algorithm (usually require("legion-metrics").merge.algorithm');

  if( callback && typeof callback !== 'function' )
    throw new Error('MetricsTarget.create(merge,callback): callback must be a function');

  return Object.assign(Object.create(MetricsTarget), {
    _callback : callback ? callback : MetricsTarget._callback,
    _metrics : MetricsTarget._metrics,
    _merge : algorithm
  });
};

module.exports.isTarget = function(target) {
  return target && target._type === MetricsTarget._type;
};

module.exports.isReceiver = function(receiver) {
  return receiver && receiver._type === MetricsReceiver._type;
};

module.exports.MetricsTarget = MetricsTarget;
module.exports.MetricsReceiver = MetricsReceiver;


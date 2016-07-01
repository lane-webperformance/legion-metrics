'use strict';

const immutable = require('immutable');

const MetricsTarget = {
  _callback : () => undefined,
  _metrics : null,
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

MetricsTarget.clear = function() {
  const result = this._metrics;

  this._metrics = null;

  return result;
};

const MetricsReceiver = {
  _target : undefined,
  _tags : immutable.Set(),
  _type : 'legion-metrics/MetricsReceiver'
};

MetricsReceiver.receive = function(sample) {
  const sample_summary = sample.summarize ? sample.summarize() : {};
  const tagged_metrics = this._tags.map(function(tag) {
    return tag(sample, sample_summary);
  });

  tagged_metrics.forEach((item_to_merge) => {
    this._target._metrics = this._target._merge(this._target._metrics, item_to_merge);
  });

  Promise.resolve(this._target) //asynchronous callback to protect us from buggy users
    .then(this._target._callback)
    .catch(err => console.error('buggy callback attached to metrics target: ' + err)); //eslint-disable-line no-console

  return this;
};

MetricsReceiver.tag = function() {
  return Object.assign(Object.create(MetricsReceiver),
                       { _target : this._target,
                         _tags : this._tags.union(Array.from(arguments)) });
};

module.exports.create = function(merge, callback) {
  if( typeof merge !== 'object' )
    throw new Error('MetricsTarget.create(merge): merge must be a merging rule table');

  if( callback && typeof callback !== 'function' )
    throw new Error('MetricsTarget.create(merge,callback): callback must be a function');

  return Object.assign(Object.create(MetricsTarget), {
    _callback : callback ? callback : () => undefined,
    _metrics : null,
    _merge : merge.root.bind(merge)
  });
};

module.exports.isTarget = function(target) {
  return target._type === MetricsTarget._type;
};

module.exports.isReceiver = function(receiver) {
  return receiver._type === MetricsReceiver._type;
};

module.exports.MetricsTarget = MetricsTarget;
module.exports.MetricsReceiver = MetricsReceiver;


var immutable = require('immutable');

var MetricsTarget = {
  _metrics : null,
  _merge : function() { throw new Error('MetricsTarget._merge: not defined'); }
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
  var result = this._metrics;

  this._metrics = null;

  return result;
};

var MetricsReceiver = {
  _target : undefined,
  _tags : immutable.Set()
};

MetricsReceiver.receive = function(sample) {
  var sample_summary = sample.summarize ? sample.summarize() : {};
  var tagged_metrics = this._tags.map(function(tag) {
    return tag(sample, sample_summary);
  });

  var this_target = this._target;
  tagged_metrics.forEach(function(item_to_merge) {
    this_target._metrics = this_target._merge(this_target._metrics, item_to_merge);
  });

  return this;
};

MetricsReceiver.tag = function() {
  return Object.assign(Object.create(MetricsReceiver),
                       { _target : this._target,
                         _tags : this._tags.union(Array.from(arguments)) });
};

module.exports.create = function(merge) {
  if( typeof merge !== 'object' )
    throw new Error('MetricsTarget.create(merge): merge must be a merging rule table');

  return Object.assign(Object.create(MetricsTarget), {
    _metrics : null,
    _merge : merge.root.bind(merge)
  });
};

module.exports.isTarget = function(target) {
  return Object.getPrototypeOf(target) === MetricsTarget;
};

module.exports.isReceiver = function(receiver) {
  return Object.getPrototypeOf(receiver) === MetricsReceiver;
};



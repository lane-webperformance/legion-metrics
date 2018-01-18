'use strict';

const reservoir = require('../merge/reservoir');
const AbstractQuery = require('./AbstractQuery');
const MeasurementQuery = require('./MeasurementQuery');

class ValueQuery extends AbstractQuery {
  constructor(root_blob, path, query_parent) {
    super(root_blob, path, query_parent);
  }

  axisName() {
    return this.path()[this.path().length-4];
  }

  tagName() {
    return this.path()[this.path().length-3];
  }

  valueName() {
    return this.path()[this.path().length-1];
  }

  clone() {
    return new ValueQuery(this._root_blob, this._path, this._parent);
  }

  toString() {
    return this.valueName();
  }

  average() {
    return new MeasurementQuery(this.rootBlob(), this.path().concat('$avg'), this, 'average', blob => blob.avg);
  }

  size() {
    return new MeasurementQuery(this.rootBlob(), this.path().concat('$avg'), this, 'size', blob => blob.size);
  }

  minimum() {
    return new MeasurementQuery(this.rootBlob(), this.path().concat('$min'), this, 'size', blob => blob);
  }

  maximum() {
    return new MeasurementQuery(this.rootBlob(), this.path().concat('$max'), this, 'size', blob => blob);
  }

  unit() {
    return new MeasurementQuery(this.rootBlob(),
                                this.path().concat('unit$reservoir'),
                                this,
                                'unit',
                                blob => reservoir.get(blob));
  }

  interpretation() {
    return new MeasurementQuery(this.rootBlob(),
                                this.path().concat('interpretation$reservoir'),
                                this,
                                'unit',
                                blob => reservoir.get(blob));
  }
}

module.exports = ValueQuery;


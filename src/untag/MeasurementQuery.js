'use strict';

const AbstractQuery = require('./AbstractQuery');

class MeasurementQuery extends AbstractQuery {
  constructor(root_blob, path, query_parent, name, getMeasurement) {
    super(root_blob, path, query_parent);
    this._measurement_name = name;
    this._getMeasurement = getMeasurement;
  }

  axisName() {
    return this.pop().axisName();
  }

  tagName() {
    return this.pop().tagName();
  }

  valueName() {
    return this.pop().valueName();
  }

  measurementName() {
    return this._measurement_name;
  }

  measurement() {
    return this._getMeasurement(this.blob());
  }

  clone() {
    return new MeasurementQuery(this._root_blob, this._path, this._parent, this._measurement_name, this._getMeasurement);
  }

  toString() {
    return this._measurement_name;
  }
}

module.exports = MeasurementQuery;


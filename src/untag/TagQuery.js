'use strict';

const AbstractQuery = require('./AbstractQuery');
const ValueQuery = require('./ValueQuery');

class TagQuery extends AbstractQuery {
  constructor(root_blob, path, query_parent) {
    super(root_blob, path, query_parent);
  }

  axisName() {
    return this.pop().axisName();
  }

  tagName() {
    return this.path()[this.path().length-1];
  }

  clone() {
    return new TagQuery(this._root_blob, this._path, this._parent);
  }

  toString() {
    return this.axisName() + ':' + this.tagName();
  }

  axisNames() {
    return Object.keys(this.blob().tags).sort();
  }
  
  axes() {
    return this.axisNames().map(axis_name => this.axis(axis_name));
  }
  
  tagNames() {
    return this.tags().map(t => t.tagName());
  }

  tags() {
    return this.axes().map(axis => axis.tags()).reduce((xs,xss) => { xss.push(...xs); return xss; },[]);
  }

  axis(axis_name) {
    // TODO: fix yucky circular dependency
    const AxisQuery = require('./AxisQuery');
    return new AxisQuery(this._root_blob, this._path.concat('tags', axis_name), this);
  }

  valueNames() {
    return Object.keys(this.blob().values).sort();
  }

  values() {
    return this.valueNames().map(v => this.value(v));
  }

  value(value_name) {
    return new ValueQuery(this.rootBlob(), this.path().concat('values',value_name), this);
  }
}

module.exports = TagQuery;


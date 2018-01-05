'use strict';

const R = require('ramda');
const values = require('./values');

module.exports = function(root_blob, prefix_path) {
  prefix_path = prefix_path || [];

  const blob = R.path(prefix_path, root_blob);

  if( !blob.tags )
    throw new Error('not a tags object (no blob.tags field)');

  const query = {
    axisNames: () => Object.keys(blob.tags),
    axis: (axis_name) => Object.assign({
      axisName: function() {
        return axis_name;
      },
      path: function() {
        return prefix_path.concat('tags', axis_name);
      },
      tags: function() {
        return this.tagNames().map(tag_name => this.tag(tag_name));
      },
      tagNames: function() {
        return Object.keys(blob.tags[axis_name]);
      },
      tag: (tag_name) => Object.assign({
        toString: function() {
          return axis_name + ':' + tag_name;
        },
        axisName: function() {
          return axis_name;
        },
        tagName: function() {
          return tag_name;
        },
        path: function() {
          return prefix_path.concat('tags', axis_name, tag_name);
        },
        blob: function() {
          return blob.tags[axis_name][tag_name];
        },
        valueQuery: function() {
          return values(root_blob, this.path());
        },
        values: function() {
          return this.valueQuery().values();
        },
        valueNames: function() {
          return this.valueQuery().valueNames();
        },
        value: function(value_name) {
          return this.valueQuery().value(value_name);
        },
        subtagsQuery: function() {
          return module.exports(root_blob, this.path());
        },
        axes: function() {
          return this.subtagsQuery().axes();
        },
        tags: function() {
          return this.subtagsQuery().tags();
        },
        axisNames: function() {
          return this.subtagsQuery().axisNames();
        },
        axis: function(x) {
          return this.subtagsQuery().axis(x);
        }
      })
    }),
    axes: () => query.axisNames().map(axis_name => query.axis(axis_name)),
    tags: () => query.axes().map(axis => axis.tags())
      .reduce((xs,xss) => { xss.push(...xs); return xss; },[])
  };

  return query;
};


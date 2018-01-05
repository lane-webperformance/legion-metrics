'use strict';

const values = require('./values');

module.exports = function(blob) {
  if( !blob.tags )
    throw new Error('not a tags object (no blob.tags field)');

  const searches = {
    axisNames: () => Object.keys(blob.tags),
    axis: (axis_name) => Object.assign({
      axisName: () => axis_name,
      tags: () => searches.axis(axis_name).tagNames().map(tag_name => searches.axis(axis_name).tag(tag_name)),
      tagNames: () => Object.keys(blob.tags[axis_name]),
      tag: (tag_name) => Object.assign({
        toString: () => axis_name + ':' + tag_name,
        axisName: () => axis_name,
        tagName: () => tag_name,
        blob: () => blob.tags[axis_name][tag_name],
        values: () => values(blob.tags[axis_name][tag_name]).values(),
        valueNames: () => values(blob.tags[axis_name][tag_name]).valueNames(),
        value: (value_name) => values(blob.tags[axis_name][tag_name]).value(value_name),
        axes: () => module.exports(blob.tags[axis_name][tag_name]).axes(),
        tags: () => module.exports(blob.tags[axis_name][tag_name])
      })
    }),
    axes: () => searches.axisNames().map(axis_name => searches.axis(axis_name)),
    tags: () => searches.axes().map(axis => axis.tags())
      .reduce((xs,xss) => { xss.push(...xs); return xss; },[])
  };

  return searches;
};

'use strict';

const untag = require('../src/untag');

describe('unmerge.tags', function() {
  it('breaks down axis and tag names', function() {
    const summary = {
      tags: {
        outcome: {
          success: {
            yay$sum: 1
          },
          failure: {
            boo$sum: 2
          }
        },
        protocol: {
          http: {
            connections$sum: 2
          },
          ssh: {
            connections$sum: 1
          }
        }
      }
    };

    expect(untag(summary).axisNames()).toEqual(['outcome','protocol']);
    expect(untag(summary).axis('outcome').tagNames()).toEqual(['success','failure']);
    expect(untag(summary).axis('protocol').tagNames()).toEqual(['http','ssh']);
    expect(untag(summary).axis('protocol').tag('http').path()).toEqual(['tags','protocol','http']);
  });
});

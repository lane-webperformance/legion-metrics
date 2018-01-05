'use strict';

const unmerge = require('../src/unmerge');

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

    expect(unmerge.tags(summary).axisNames()).toEqual(['outcome','protocol']);
    expect(unmerge.tags(summary).axis('outcome').tagNames()).toEqual(['success','failure']);
    expect(unmerge.tags(summary).axis('protocol').tagNames()).toEqual(['http','ssh']);
  });
});

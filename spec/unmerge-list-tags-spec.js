'use strict';

const listTags = require('../src/unmerge/listTags');

describe('unmerge.listTags', function() {
  it('Breaks down blobs of summary metrics into a table of tags', function() {
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

    expect(listTags(summary).foo).not.toBeDefined();
    expect(listTags(summary).outcome).toEqual(new Set(['success','failure']));
    expect(listTags(summary).protocol).toEqual(new Set(['http','ssh']));
  });
});

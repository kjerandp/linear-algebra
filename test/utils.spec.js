import expect from 'expect';
import {
  flattenList,
  rowsToColumns,
} from '../src/utils';
import { vec2, vec3, vec4 } from '../src/vector';

describe('utils.js', () => {
  it('should be able to transpose rows to columns where 2d data are stored in 1d arrays', () => {
    expect(rowsToColumns([1, 2, 3, 4, 5, 6], 2)).toEqual([1, 3, 5, 2, 4, 6]);
    expect(rowsToColumns([1, 7, 2, 8, 3, 9], 2)).toEqual([1, 2, 3, 7, 8, 9]);
  });

  it('should be able to flatten a list, that may contain nested arrays, of arguments into a 1d array', () => {
    expect(flattenList([1, [2, [3], 4], [5, 6]])).toEqual([1, 2, 3, 4, 5, 6]);
    expect(flattenList([1, [2, [3], 4], [5, 6]], [], 4)).toEqual([1, 2, 3, 4]);
    expect(flattenList(vec4(vec3(vec2(1, 2), 3), 4))).toEqual([1, 2, 3, 4]);
  });
});

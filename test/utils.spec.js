import expect from 'expect';
import { standardizeArgument } from '../src/utils';
import { vec3 } from '../src/vector';
import { mat2 } from '../src/matrix';

describe('Utils functions', () => {
  it('Can standardize arguments', () => {
    expect(standardizeArgument(1)).toEqual([1]);
    expect(standardizeArgument(1, true)).toEqual([[1]]);
    expect(standardizeArgument(0)).toEqual([0]);
    expect(standardizeArgument(0, true)).toEqual([[0]]);
    expect(standardizeArgument([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(standardizeArgument([1, 2, 3, 4], true)).toEqual([[1], [2], [3], [4]]);
    expect(standardizeArgument(vec3(1, 2, 3))).toEqual([1, 2, 3]);
    expect(standardizeArgument(vec3(1, 2, 3), true)).toEqual([[1], [2], [3]]);
    expect(standardizeArgument(mat2(1, 2, 3, 4))).toEqual([1, 2, 3, 4]);
    expect(standardizeArgument(mat2(1, 2, 3, 4), true)).toEqual([[1, 2], [3, 4]]);
  });
});

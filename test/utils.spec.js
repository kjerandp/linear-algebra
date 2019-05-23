import expect from 'expect';
import { argumentsToList } from '../src/utils';
import { vec2, vec4 } from '../src/vector';

describe('Utils functions', () => {

  it('Can convert arguments to component array', () => {
    expect(argumentsToList([1, 2, 3])).toEqual([1, 2, 3]);
    expect(argumentsToList([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(argumentsToList([1, vec2(2, 3)])).toEqual([1, 2, 3]);
    expect(argumentsToList(vec4(1, 2, 3, 4))).toEqual([1, 2, 3, 4]);
  });
});

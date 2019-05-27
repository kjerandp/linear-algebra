import expect from 'expect';
import {
  argumentsToList,
  constantIterator,
  combinedIterator,
  arrayIterator,
} from '../src/utils';
import { vec2, vec4 } from '../src/vector';

describe('Utils functions', () => {

  it('Can convert arguments to component array', () => {
    expect(argumentsToList([1, 2, 3])).toEqual([1, 2, 3]);
    expect(argumentsToList([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(argumentsToList([1, vec2(2, 3)])).toEqual([1, 2, 3]);
    expect(argumentsToList(vec4(1, 2, 3, 4))).toEqual([1, 2, 3, 4]);
  });

  it('Can create iterator out of constants', () => {
    const a = 5;
    const itr = constantIterator(a, 5);

    let current = itr.next();
    expect(current.value).toBe(a);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(a);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(a);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(a);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(a);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
  });

  it('Can create iterator out of arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    const itr = arrayIterator(arr);

    let current = itr.next();
    expect(current.value).toBe(1);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(2);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(3);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(4);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(5);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
  });

  it('Can create iterator out of 2d arrays', () => {
    const arr = [[1, 2], [3, 4], [5]];
    const itr = arrayIterator(arr);

    let current = itr.next();
    expect(current.value).toBe(1);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(2);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(3);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(4);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.value).toBe(5);
    expect(current.done).toBeFalsy();
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
    current = itr.next();
    expect(current.done).toBeTruthy();
    expect(current.value).toBeUndefined;
  });

  it('Can combine and traverse multiple iterators', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const b = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const t = 3;

    const itr = combinedIterator(
      arrayIterator(a),
      arrayIterator(b),
      constantIterator(t),
    );
    let i = 1;
    let current = itr.next();
    while (!current.done) {
      expect(current.value).toEqual([i, i, 3]);
      current = itr.next();
      i++;
    }
    expect(i).toBe(10);
  });
});

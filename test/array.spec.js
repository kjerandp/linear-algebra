import expect from 'expect';
import {
  createArray1d,
  createArray2d,
  subArrayFrom,
  nrows,
  ncols,
  flatten,
} from '../src/array';

describe('Array utils class', () => {
  it('Should be able to create 1d and 2d arrays', () => {
    expect(createArray1d([4, 2])).toEqual([4, 2]);
    expect(createArray1d([4, 2, 1], 2)).toEqual([4, 2]);
    expect(createArray1d(null, 4, 0)).toEqual([0, 0, 0, 0]);

    const a = createArray2d(2, 2);
    expect(nrows(a)).toBe(2);
    expect(ncols(a)).toBe(2);
    expect(a).toEqual([[undefined, undefined], [undefined, undefined]]);
  });

  it('Should be able to return a copy of a subset of the array', () => {
    const m = createArray2d([
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ], 3);

    expect(nrows(m)).toBe(3);
    expect(ncols(m)).toBe(3);

    expect(flatten(subArrayFrom(m, 1, 2, 2, 2))).toEqual([2, 3, 5, 6]);

  });
});

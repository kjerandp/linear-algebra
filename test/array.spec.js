import expect from 'expect';
import {
  createArray1d,
  createArray2d,
  subArrayFrom,
  rows,
  cols,
  flatten,
} from '../src/array';

describe('Array utils class', () => {
  it('Should be able to create 1d and 2d arrays', () => {
    expect(createArray1d([4, 2])).toEqual([4, 2]);
    expect(createArray1d([4, 2, 1], 2)).toEqual([4, 2]);
    expect(createArray1d(null, 4, 0)).toEqual([0, 0, 0, 0]);

    const a = createArray2d(2, 2);
    expect(rows(a)).toBe(2);
    expect(cols(a)).toBe(2);
    expect(a).toEqual([[undefined, undefined], [undefined, undefined]]);
  });

  // it('Should be able to calculate dot products', () => {
  //   const m1 = new Array2d([
  //     1,  0,  1,
  //     0,  2,  0,
  //     0,  0, 1.5,
  //   ], 3);

  //   const m2 = new Array2d([
  //     3,  1,  2,
  //     2,  4,  2,
  //    -5, -2, -1,
  //   ], 3);

  //   const v1 = new Array2d([2, -2, 1]);
  //   const v2 = new Array2d([-3.5, 1.5, -3]);

  //   expect(v1.rows).toBe(1);
  //   expect(v1.cols).toBe(3);
  //   // dot product of two vectors
  //   expect(v1.dotProduct(v2.transpose())).toEqual(-13);

  //   // dot product of matrix vector and vector matrix
  //   expect((m1.dotProduct(v1.transpose()).toArray())).toEqual([3, -4, 1.5]);

  //   expect(v1.dotProduct(m1).toArray()).toEqual([2, -4, 3.5]);
  //   expect(m1.dotProduct(v2.transpose()).toArray()).toEqual([-6.5, 3, -4.5]);
  //   expect(v2.dotProduct(m1).toArray()).toEqual([-3.5, 3, -8]);

  //   // dot product of two matrices
  //   expect(m1.dotProduct(m2).toArray()).toEqual([
  //     -2,   -1,   1,
  //     4,    8,    4,
  //     -7.5, -3,   -1.5,
  //   ]);

  //   expect(m2.dotProduct(m1).toArray()).toEqual([
  //     3,    2,   6,
  //     2,    8,   5,
  //     -5,   -4,  -6.5,
  //   ]);

  //   expect(m1.dotProduct(m1).toArray()).toEqual([
  //     1,  0,  2.5,
  //     0,  4,  0,
  //     0,  0,  2.25,
  //   ]);

  //   const m3 = new Array2d([
  //     [1, 0],
  //     [0, 2],
  //     [0, 0],
  //   ]);

  //   const m4 = new Array2d([
  //     [3, 1, 2],
  //     [2, 4, 2],
  //   ]);

  //   const dp1 = m3.dotProduct(m4);
  //   expect(dp1.toArray()).toEqual([
  //     3,  1,  2,
  //     4,  8,  4,
  //     0,  0,  0,
  //   ]);
  //   expect(dp1.size).toEqual([3, 3]);

  //   const dp2 = m4.dotProduct(m3);
  //   expect(dp2.toArray()).toEqual([
  //     3,  2,
  //     2,  8,
  //   ]);
  //   expect(dp2.size).toEqual([2, 2]);
  //   expect(m2.dotProduct(v1.transpose()).toArray()).toEqual([6, -2, -7]);
  //   expect(v1.dotProduct(m2).toArray()).toEqual([-3, -8, -1]);
  //   expect(m4.dotProduct(v1.transpose()).toArray()).toEqual([6, -2]);
  //   expect(m2.dotProduct(v2.transpose()).toArray()).toEqual([-15, -7, 17.5]);
  //   expect(m4.dotProduct(v2.transpose()).toArray()).toEqual([-15, -7]);

  //   expect(() => m3.dotProduct(v1)).toThrow();
  //   expect(() => m3.dotProduct(v2)).toThrow();
  // });


  it('Should be able to return a copy of a subset of the array', () => {
    const m = createArray2d([
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ], 3);

    expect(rows(m)).toBe(3);
    expect(cols(m)).toBe(3);

    expect(flatten(subArrayFrom(m, 1, 2, 2, 2))).toEqual([2, 3, 5, 6]);

  });
});

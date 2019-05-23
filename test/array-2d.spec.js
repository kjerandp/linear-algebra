import expect from 'expect';
import Array2d from '../src/array-2d';

describe('Array2d class', () => {
  it('Should be able to initialize with values and retrieve values using get', () => {
    expect(new Array2d(4)).toBeInstanceOf(Array2d);

    const a = new Array2d([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Array2d([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);

    expect(a.getValueAt(2)).toBe(3);
    expect(a.getValueAt(3, 2)).toBeUndefined();
    expect(b.getValueAt(0, 0)).toBe(1);
    expect(b.getValueAt(1, 0)).toBe(2);
    expect(b.getValueAt(2, 0)).toBe(3);
    expect(b.getValueAt(0, 1)).toBe(4);
    expect(b.getValueAt(1, 1)).toBe(5);
    expect(b.getValueAt(2, 1)).toBe(6);
    expect(b.getValueAt(0, 2)).toBe(7);
    expect(b.getValueAt(1, 2)).toBe(8);
    expect(b.getValueAt(2, 2)).toBe(9);
    expect(b.getValueAt(7)).toBeUndefined();
    expect(a.getValueAt(10)).toBeUndefined();
    expect(b.getValueAt(1, -2)).toBeUndefined();

    const c = new Array2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);

    expect(c.cols).toBe(4);
    expect(c.rows).toBe(2);
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

  it('Should be able to convert to plain js 1D and 2D arrays', () => {
    const c = new Array2d([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
    expect(c.toArray(2)).toEqual([[1, 2, 3, 4], [5, 6, 7, 8]]);
    expect(c.toArray(1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    expect(c.toArray(1, false)).toEqual([1, 5, 2, 6, 3, 7, 4, 8]);
    expect(c.toArray(2, false)).toEqual([[1, 5], [2, 6], [3, 7], [4, 8]]);
  });

  it('Should be able to return a copy of a subset of the array', () => {
    const m = new Array2d([
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ], 3);

    expect(m.rows).toBe(3);
    expect(m.cols).toBe(3);
    expect(m.isSquare).toBeTruthy();

    expect(m.copy(0, 0)).toEqual(m);
    expect(m.copy(2, 1, 2, 2).toArray()).toEqual([2, 3, 5, 6]);

  });
});

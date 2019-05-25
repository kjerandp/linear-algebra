import expect from 'expect';
import {
  Matrix,
  mat2,
  mat3,
  mat4,
  col2,
  col4,
  row2,
  row4,
} from '../src/matrix';
import { vec3, vec4 } from '../src/vector';
import { range } from '../src/utils';
import op from '../src/math';
// import { timer } from './timer';


describe('Matrix class tests', () => {
  it('Can create matrices using constructor and helper functions', () => {
    expect(new Matrix(1).size).toEqual([1, 1]);
    expect(new Matrix(2).size).toEqual([2, 2]);
    expect(new Matrix(3).size).toEqual([3, 3]);
    expect(new Matrix(2, 4).size).toEqual([2, 4]);
    expect(new Matrix()).toEqual(mat4());
    expect(new Matrix(2)).toEqual(mat2());
    expect(new Matrix(3)).toEqual(mat3());
    expect(new Matrix(1, 4)).toEqual(row4());
    expect(new Matrix(4, 1)).toEqual(col4());

    let m = mat2(1, 1);
    expect(m.rows).toBe(2);
    expect(m.cols).toBe(2);
    expect(m.toArray(1)).toEqual([1, 1, 0, 0]);

    m = mat2(1, 2, 3, 4);
    expect(m.toArray()).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(m.rows).toBe(2);
    expect(m.cols).toBe(2);
    expect(m.size).toEqual([2, 2]);

    const clone = m.clone();

    expect(clone).toEqual(m);
    clone.a12 = 7;
    expect(clone).not.toEqual(m);

    const identity = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    expect(Matrix.identity().toArray()).toEqual(identity);
    expect(new Matrix().toArray()).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  it('Can use accessors to get/set values', () => {
    const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

    expect(m.get(1, 1)).toBe(1);
    expect(m.get(2, 2)).toBe(5);
    expect(m.get(3, 2)).toBe(8);
    expect(m.get(3, 3)).toBe(9);

    expect(() => m.get(0, 2)).toThrow();
    expect(m.get(2, 8)).toBeUndefined();

    m.set(2, 2, -7);
    expect(m.get(2, 2)).toBe(-7);

    expect(m.get(1, 1)).toBe(m.a11);
    expect(m.get(2, 2)).toBe(m.a22);
    expect(m.get(3, 2)).toBe(m.a32);
    expect(m.get(3, 3)).toBe(m.a33);

    m.a12 = 0;
    expect(m.get(1, 2)).toBe(0);
  });

  it('Can do basic matrix arithmetics', () => {
    expect(mat2(1, 2, 3, 4).add(mat2(1, 1)).toArray()).toEqual([
      [2, 3],
      [3, 4],
    ]);

    expect(mat2(1, 2, 3, 4).sub(mat2(1, 1)).toArray()).toEqual([
      [0, 1],
      [3, 4],
    ]);

    expect(mat2(1, 2, 3, 4).scale(3).toArray()).toEqual([
      [3, 6],
      [9, 12],
    ]);

    expect(mat2(1, 2, 3, 4).scale(0.5).toArray()).toEqual([
      [0.5, 1],
      [1.5, 2],
    ]);

    const c = col4(1, 2, 3, 4).add(col4(1));
    expect(c.toArray()).toEqual([[2], [3], [4], [5]]);
    expect(c.size).toEqual([4, 1]);

    const r = row4(1, 2, 3, 4).add(row4(1));
    expect(r.toArray()).toEqual([[2, 3, 4, 5]]);
    expect(r.size).toEqual([1, 4]);

    expect(r.transpose().toArray()).toEqual(c.toArray());

    expect(() => mat2(1, 2, 3, 4).add(col2(1))).toThrow('Matrices must be of same size!');
  });

  it('Can find matrix determinant', () => {
    expect(() => col4().det()).toThrow('Matrix must be square!');
    expect(mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1).det()).toBe(6);
    expect(Matrix.identity(10).det()).toBe(1);
    expect(Matrix.identity(9).det()).toBe(1);
  });

  it('Can invert matrices', () => {
    expect(() => col4().invert()).toThrow('Matrix cannot be inverted!');
    expect(mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1).invert()).toBeInstanceOf(Matrix);

    let actual = mat2(4, 7, 2, 6).invert().toArray(1);
    let expected = [0.6, -0.7, -0.2, 0.4];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));

    actual = mat2(3, 3.5, 3.2, 3.6).invert().toArray(1);
    expected = [-9, 8.75, 8, -7.5];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));
  });

  /*
  it('Can optimise matrix determinant calculations', () => {
    const runs = 500;
    let timeA = 0;
    let timeB = 0;
    for (let i = 0; i < runs; i++) {
      const m1 = mat3();
      m1._values.assign(() => Math.random());
      const m2 = m1.clone();
      expect(m1.toArray()).toEqual(m2.toArray());
      m2._optimise = false;
      const a = timer(() => m1.det());
      const b = timer(() => m2.det());
      expect(a[0]).toBeCloseTo(b[0], 10);
      timeA += a[1];
      timeB += b[1];
    }
    expect(timeA).toBeLessThanOrEqual(timeB);

    timeA = 0;
    timeB = 0;
    for (let i = 0; i < runs; i++) {
      const m1 = mat4();
      m1._values.assign(() => Math.random());
      const m2 = m1.clone();
      m2._optimise = false;
      const a = timer(() => m1.det());
      const b = timer(() => m2.det());
      expect(a[0]).toBeCloseTo(b[0], 10);
      timeA += a[1];
      timeB += b[1];
    }
    expect(timeA).toBeLessThanOrEqual(timeB);
  });
  */

  it('Can transpose matrices', () => {
    expect(row2(1, 2).transpose()).toEqual(col2(1, 2));
    expect(mat2(
      1, 2,
      3, 4,
    ).transpose()).toEqual(mat2(
      1, 3,
      2, 4,
    ));
    expect(new Matrix([
      [1, 2],
      [3, 4],
      [5, 6],
    ]).transpose()).toEqual(new Matrix([
      [1, 3, 5],
      [2, 4, 6],
    ]));
    expect(new Matrix([
      [1, -2, 0, 0],
      [0, 3, 0, 0],
      [1, 2, 0, -4],
    ]).transpose()).toEqual(new Matrix([
      [1, 0, 1],
      [-2, 3, 2],
      [0, 0, 0],
      [0, 0, -4],
    ]));
  });

  it('Can extract rows and columns', () => {
    const m = mat3(
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    );

    expect(m.submatrix(1, 2, 2, 2)).toEqual(mat2(2, 3, 5, 6));

    expect(m.row(1)).toEqual([1, 2, 3]);
    expect(m.row(2)).toEqual([4, 5, 6]);
    expect(m.row(3)).toEqual([7, 8, 9]);
    expect(() => m.row(4)).toThrow();
    expect(() => m.row(0)).toThrow();

    expect(m.col(1)).toEqual([1, 4, 7]);
    expect(m.col(2)).toEqual([2, 5, 8]);
    expect(m.col(3)).toEqual([3, 6, 9]);
    expect(() => m.col(4)).toThrow();
    expect(() => m.col(0)).toThrow();

    // diagonal
    expect(m.diagonal(1)).toEqual([1, 5, 9]); // 45
    expect(m.diagonal(2)).toEqual([2, 6, 7]); // 84
    expect(m.diagonal(3)).toEqual([3, 4, 8]); // 96

    // diagonal reverse
    expect(m.diagonal(3, true)).toEqual([3, 5, 7]);
    expect(m.diagonal(2, true)).toEqual([2, 4, 9]);
    expect(m.diagonal(1, true)).toEqual([1, 6, 8]);

    expect(() => m.diagonal(4)).toThrow();
    expect(() => m.diagonal(0)).toThrow();

    let det = 0;
    range(m.cols, 1).forEach((j) => {
      det += op.product(m.diagonal(j)) - op.product(m.digonalReverse(j));
    });
    expect(det).toEqual(m.det());

    const m2 = mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1);
    det = 0;
    range(m2.cols, 1).forEach((j) => {
      det += op.product(m2.diagonal(j)) - op.product(m2.digonalReverse(j));
    });
    expect(det).toEqual(m2.det());
  });

  it('Can extract submatrices and remove rows and columns', () => {
    const m = mat3(
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    );

    expect(m.submatrix(1, 2, 2, 2)).toEqual(mat2(2, 3, 5, 6));
    expect(m.submatrix(2, 1, 2, 2)).toEqual(mat2(4, 5, 7, 8));

    expect(m.clone().remove(1, 2)).toEqual(mat2(4, 6, 7, 9));
    expect(m.clone().remove(3, 2)).toEqual(mat2(1, 3, 4, 6));
  });

  it('Should be possible to create matrix from one or more vectors', () => {
    const m1 = Matrix.fromVectors(vec3(1));
    expect(m1).toBeInstanceOf(Matrix);
    expect(m1.size).toEqual([3, 1]);
    expect(m1.toArray()).toEqual([[1], [1], [1]]);

    const m2 = Matrix.fromVectors(vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1));
    expect(m2).toBeInstanceOf(Matrix);
    expect(m2.size).toEqual([3, 3]);
    expect(m2.toArray()).toEqual(Matrix.identity(3).toArray());

    expect(() => Matrix.fromVectors(vec4(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1))).toThrowError();
    expect(() => Matrix.fromVectors([1, 2, 3, 4])).toThrowError();
  });
});

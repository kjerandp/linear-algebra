/* eslint-disable comma-spacing */
import expect from 'expect';
import { Matrix, mat2, mat3, mat4 } from '../src/matrix';
import { Vector } from '../src/vector';


describe('matrix', () => {
  it('should be possible to instantiate and assign values using factory functions', () => {
    expect(new Matrix().length).toBe(16);
    expect(new Matrix(2).length).toBe(4);
    expect(new Matrix(3).length).toBe(9);
    expect(new Matrix(4).length).toBe(16);

    let m = new Matrix(4, 2);
    expect(m.length).toBe(8);
    expect(m.columns).toBe(2);
    expect(m.rows).toBe(4);
    expect(m.isSquare).toBeFalsy();

    m.copyFrom([
      1, 2,
      3, 4,
      5, 6,
      7, 8,
    ]);

    expect(m.toArray()).toEqual([1, 3, 5, 7, 2, 4, 6, 8]);

    m = new Matrix(2, 2, [1, 0, 0, 1]);

    expect(m).toEqual(Matrix.identity(2));

    expect(mat2(1, 2, 3, 4, 5, 6, 7).toArray()).toEqual([1, 3, 2, 4]);

    m = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    expect(m.length).toBe(16);
    expect(m.rows).toBe(4);
    expect(m.columns).toBe(4);

    expect(m.toArray()).toEqual([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);

    // values should be stored internally in columns-first order
    // elements can be accessed (up to 4d) using the property
    // syntax: a{row}{column}
    expect(m.a11).toBe(m[0]);
    expect(m.a21).toBe(m[1]);
    expect(m.a31).toBe(m[2]);
    expect(m.a41).toBe(m[3]);
    expect(m.a12).toBe(m[4]);
    expect(m.a22).toBe(m[5]);
    expect(m.a32).toBe(m[6]);
    expect(m.a42).toBe(m[7]);
    expect(m.a13).toBe(m[8]);
    expect(m.a23).toBe(m[9]);
    expect(m.a33).toBe(m[10]);
    expect(m.a43).toBe(m[11]);
    expect(m.a14).toBe(m[12]);
    expect(m.a24).toBe(m[13]);
    expect(m.a34).toBe(m[14]);
    expect(m.a44).toBe(m[15]);

    // assign new value to row 3 column 2
    m.a32 = 20;
    expect(m[6]).toBe(20);
    // asign new value to row 2 column 3
    m[9] = 14;
    expect(m.a23).toBe(14);
  });

  it('should be possible to instantiate matrices from existing arrays', () => {
    // identity matrix
    const I = Matrix.identity(3);

    expect(I.isSquare).toBeTruthy();
    expect(I.toArray()).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    // from existing array
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(Matrix.fromArray(arr, 2).toArray2d(true)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);

    expect(Matrix.fromArray(arr, 3).toArray2d(true)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    // mutates input arr by reducing its size to fit the matrix
    expect(Matrix.fromArray(arr, 4, true, true).toArray2d(true)).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
    expect(arr.length).toBe(8);
  });

  it('should be possible to instantiate matrices from vectors', () => {
    const i = [1, 0, 0.5];
    const j = [0, 1, 0];
    const k = [0, 0, 1];

    expect(Matrix.fromVectors(i, j, k).toArray(true)).toEqual([
      1, 0, 0,
      0, 1, 0,
      0.5, 0, 1,
    ]);
  });

  it('should be able to extract values or subsets of values', () => {
    const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

    // columns first (as stored internally)
    const columnsFirst = m.toArray();
    expect(columnsFirst).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    expect(columnsFirst).not.toBe(m);
    expect(m.columnsFirst()).toEqual(columnsFirst);

    // rows first
    const rowsFirst = m.toArray(true);
    expect(rowsFirst).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(rowsFirst).not.toBeInstanceOf(Matrix);
    expect(m.rowsFirst()).toEqual(rowsFirst);

    /* Transform to 2d array */

    // columns first
    expect(m.toArray2d()).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    // rows first
    expect(m.toArray2d(true)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

    /* Columns and rows */
    expect(m.col(0)).toEqual([1, 4, 7]);
    expect(m.col(1)).toEqual([2, 5, 8]);
    expect(m.col(2)).toEqual([3, 6, 9]);

    expect(m.row(0)).toEqual([1, 2, 3]);
    expect(m.row(1)).toEqual([4, 5, 6]);
    expect(m.row(2)).toEqual([7, 8, 9]);

    /* sub-matrix */
    let sm = m.submatrix(1, 0, 2, 1);
    expect(sm.rows).toBe(2);
    expect(sm.columns).toBe(1);
    expect(sm.toArray(true)).toEqual([4, 7]);

    sm = m.submatrix(1, 1, 2, 2);
    expect(sm.rows).toBe(2);
    expect(sm.columns).toBe(2);
    expect(sm.toArray(true)).toEqual([5, 6, 8, 9]);
  });

  it('should be possible to transpose a matrix', () => {
    let m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

    let transposed = m.transpose();
    expect(m).toBe(transposed);
    expect(m.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // immutable
    transposed = m.transpose(new Matrix());
    expect(m).not.toBe(transposed);
    expect(m.toArray()).not.toEqual(transposed.toArray());

    m = new Matrix(3, 2, [
      1, 2,
      3, 4,
      5, 6,
    ]);

    expect(m.rows).toBe(3);
    expect(m.columns).toBe(2);

    transposed = m.transpose(new Matrix());
    expect(transposed.rows).toBe(2);
    expect(transposed.columns).toBe(3);
    expect(transposed.toArray2d(true)).toEqual([ // rows first
      [1, 3, 5],
      [2, 4, 6],
    ]);

  });

  it('should be possible to remove rows/colums from a matrix', () => {
    let m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    m.remove(1);
    expect(m.rows).toBe(2);
    expect(m.columns).toBe(3);
    expect(m.toArray(true)).toEqual([
      1, 2, 3,
      7, 8, 9,
    ]);

    m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    m.remove(null, 1);
    expect(m.rows).toBe(3);
    expect(m.columns).toBe(2);
    expect(m.toArray(true)).toEqual([
      1, 3,
      4, 6,
      7, 9,
    ]);

    m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

    m.remove(2, 1);
    expect(m.rows).toBe(2);
    expect(m.columns).toBe(2);
    expect(m.toArray(true)).toEqual([
      1, 3,
      4, 6,
    ]);

    // immutable
    m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const m2 = m.remove(1, 1, new Matrix());
    expect(m.rows).toBe(3);
    expect(m.columns).toBe(3);
    expect(m2.rows).toBe(2);
    expect(m2.columns).toBe(2);
    expect(m2.toArray(true)).toEqual([
      1, 3,
      7, 9,
    ]);
  });

  it('should be possible to calculate the product between two matrices as well as matrix and vector/array', () => {
    const S = mat3(
      2, 0, 0,
      0, 2, 0,
      0, 0, 1,
    );

    const T = mat3(
      1, 0, 2,
      0, 1,-3,
      0, 0, 1,
    );

    const v = new Vector(2, -1.5);

    const a = S.dot(T, mat3());
    const b = S.dot(v, new Vector(2));
    const c = S.dot([-3, 2]);

    expect(a).toBeInstanceOf(Matrix);
    expect(a.rowsFirst()).toEqual([
      2, 0, 4,
      0, 2, -6,
      0, 0, 1,
    ]);

    expect(b).toBeInstanceOf(Vector);
    expect(b).toEqual([4, -3]);

    expect(c).toBeInstanceOf(Array);
    expect(c).toEqual([-6, 4]);

  });

  it('should be able to find the inverse of a (square) matrix', () => {
    expect(() => new Matrix(3, 2).inverse()).toThrow();
    expect(() => Matrix.identity().inverse()).not.toThrow();
    expect(Matrix.identity(4).inverse()).toEqual(Matrix.identity(4));

    let actual = mat2(3, 3.5, 3.2, 3.6).inverse();
    let expected = [-9, 8.75, 8, -7.5];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));

    actual = mat2(4, 7, 2, 6).inverse();
    expected = [0.6, -0.7, -0.2, 0.4];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));

    // imutable
    const m = mat4(
      2, 0, 0, 0,
      0, 1.5, 0, 0,
      0, 0, 3, 0,
      0, 0, 0, 1,
    );
    actual = m.inverse(new Matrix());
    expect(m).not.toBe(actual);
    expect(m.toArray(true)).toEqual([
      2, 0, 0, 0,
      0, 1.5, 0, 0,
      0, 0, 3, 0,
      0, 0, 0, 1,
    ]);
    expected = [0.5, 0, 0, 0, 0, 0.666667, 0, 0, 0, 0, 0.333333, 0, 0, 0, 0, 1];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));
  });

  it('should be able to calculate its determinant', () => {
    expect(() => new Matrix(3, 2).determinant()).toThrow();
    expect(Matrix.identity().determinant()).toBe(1);
    expect(mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1).determinant()).toBe(6);
    expect(mat4(1, 2, 3, -4, -5, -6, 7, 8, 9, 10, 11, 12, -13, 14, 15, 16).determinant()).toBe(25344);
  });
});

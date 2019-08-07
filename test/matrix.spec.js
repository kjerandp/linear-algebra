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
});

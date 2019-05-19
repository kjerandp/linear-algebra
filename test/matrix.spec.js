import expect from 'expect';
import Matrix, {
  mat2,
  mat3,
  mat4,
  col2,
  col4,
  row2,
  row4,
} from '../src/matrix';
import { product } from '../src/functions';
// import timer from './timer';


describe('Matrix class tests', () => {
  it('Can create matrices using constructor and helper functions', () => {
    const identity = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    expect(Matrix.identity().value).toEqual(identity);
    expect(new Matrix().value).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    expect(new Matrix(1).size).toEqual([1, 1]);
    expect(new Matrix(2).size).toEqual([2, 2]);
    expect(new Matrix(3).size).toEqual([3, 3]);
    expect(new Matrix(2, 4).size).toEqual([2, 4]);
    expect(new Matrix()).toEqual(mat4());
    expect(new Matrix(2)).toEqual(mat2());
    expect(new Matrix(3)).toEqual(mat3());
    expect(new Matrix(1, 4)).toEqual(row4());
    expect(new Matrix(4, 1)).toEqual(col4());

    const m = mat2(1, 2, 3, 4);
    expect(m.value).toEqual([
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
  });

  it('Can use accessors to get/set values', () => {
    const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

    expect(m.get(1, 1)).toBe(1);
    expect(m.get(2, 2)).toBe(5);
    expect(m.get(3, 2)).toBe(8);
    expect(m.get(3, 3)).toBe(9);

    expect(() => m.get(0, 2)).toThrow();
    expect(() => m.get(2, 8)).toThrow();

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
    expect(mat2(1, 2, 3, 4).add(mat2(1)).value).toEqual([
      [2, 3],
      [4, 5],
    ]);

    expect(mat2(1, 2, 3, 4).sub(mat2(1)).value).toEqual([
      [0, 1],
      [2, 3],
    ]);

    expect(mat2(1, 2, 3, 4).scale(3).value).toEqual([
      [3, 6],
      [9, 12],
    ]);

    expect(mat2(1, 2, 3, 4).scale(0.5).value).toEqual([
      [0.5, 1],
      [1.5, 2],
    ]);

    const c = col4(1, 2, 3, 4).add(col4(1));
    expect(c.value).toEqual([[2], [3], [4], [5]]);
    expect(c.size).toEqual([4, 1]);

    const r = row4(1, 2, 3, 4).add(row4(1));
    expect(r.value).toEqual([[2, 3, 4, 5]]);
    expect(r.size).toEqual([1, 4]);

    expect(r.transpose()).toEqual(c);

    expect(() => mat2(1, 2, 3, 4).add(col2(1))).toThrow('Incompatible matrices!');
  });

  it('Can find matrix determinant', () => {
    expect(() => col4().det()).toThrow('Matrix must be square!');
    expect(mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1).det()).toBe(6);
  });

  it('Can invert matrices', () => {
    expect(() => col4().invert()).toThrow('Matrix cannot be inverted!');
    expect(mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1).invert()).toBeInstanceOf(Matrix);

    let actual = mat2(4, 7, 2, 6).invert().flatten();
    let expected = [0.6, -0.7, -0.2, 0.4];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));

    actual = mat2(3, 3.5, 3.2, 3.6).invert().flatten();
    expected = [-9, 8.75, 8, -7.5];
    actual.every((a, i) => expect(a).toBeCloseTo(expected[i], 5));
  });
  /*
  it('Can optimise matrix determinant calculations', () => {
    const runs = 5000;
    let timeA = 0;
    let timeB = 0;
    for (let i = 0; i < runs; i++) {
      const m1 = mat3().assign(() => Math.random());
      const m2 = m1.clone();
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
      const m1 = mat4().assign(() => Math.random());
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
    m.columns.each((j) => {
      det += product(m.diagonal(j)) - product(m.antiDiagonal(j, true));
    });
    expect(det).toEqual(m.det());

    const m2 = mat3(-2, 2, 3, -1, 1, 3, 2, 0, -1);
    det = 0;
    m2.columns.each((j) => {
      det += product(m2.diagonal(j)) - product(m2.antiDiagonal(j));
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

    expect(m.remove(1, 2)).toEqual(mat2(4, 6, 7, 9));
    expect(m.remove(3, 2)).toEqual(mat2(1, 3, 4, 6));
  });
});

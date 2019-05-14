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

});

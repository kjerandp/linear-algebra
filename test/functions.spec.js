/* eslint-disable no-multi-spaces */

import expect from 'expect';
import Matrix, { mat2, mat3 } from '../src/Matrix';
import { vec3 } from '../src/Vector';
import { dot } from '../src/functions';

describe('Functions tests', () => {
  it('Can do matrix vector multiplications (dot product)', () => {
    const m1 = mat3(
      1,  0,  1,
      0,  2,  0,
      0,  0,  1.5,
    );

    const m2 = mat3(
      3,  1,  2,
      2,  4,  2,
      -5,  -2,  -1,
    );

    const v1 = vec3(2, -2, 1);
    const v2 = vec3(-3.5, 1.5, -3);

    expect(dot(v1, v2)).toEqual(-13);
    expect(dot(m1, v1)).toEqual(vec3(3, -4, 1.5));
    expect(dot(v1, m1)).toEqual(vec3(2, -4, 3.5));
    expect(dot(m1, v2)).toEqual(vec3(-6.5, 3, -4.5));
    expect(dot(v2, m1)).toEqual(vec3(-3.5, 3, -8));
    expect(dot(m1, m2)).toEqual(mat3(
      -2,   -1,   1,
      4,    8,    4,
      -7.5, -3,   -1.5,
    ));

    expect(dot(m2, m1)).toEqual(mat3(
      3,    2,   6,
      2,    8,   5,
      -5,   -4,  -6.5,
    ));

    expect(dot(m1, m1)).toEqual(mat3(
      1,  0,  2.5,
      0,  4,  0,
      0,  0,  2.25,
    ));

    const m3 = new Matrix([
      [1, 0],
      [0, 2],
      [0, 0],
    ]);

    const m4 = new Matrix([
      [3, 1, 2],
      [2, 4, 2],
    ]);

    expect(dot(m3, m4)).toEqual(mat3(
      3,  1,  2,
      4,  8,  4,
      0,  0,  0,
    ));

    expect(dot(m4, m3)).toEqual(mat2(
      3,  2,
      2,  8,
    ));

    expect(dot(m2, v1)).toEqual(vec3(6, -2, -7));
    expect(() => dot(m3, v1)).toThrow();
    expect(dot(m4, v1)).toEqual(vec3(6, -2, 0));
    expect(dot(m2, v2)).toEqual(vec3(-15, -7, 17.5));
    expect(() => dot(m3, v2)).toThrow();
    expect(dot(m4, v2)).toEqual(vec3(-15, -7, 0));
  });
});

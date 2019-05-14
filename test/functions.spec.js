/* eslint-disable no-multi-spaces */

import expect from 'expect';
import Matrix, { mat2, mat3 } from '../src/Matrix';
import { vec3, vec4 } from '../src/Vector';
import { dot, mix, clamp } from '../src/functions';

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

  it('Can mix vectors and values', () => {
    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);
    expect(mix(v1, v2, 0)).toEqual(v1);
    expect(mix(v1, v2, 1)).toEqual(v2);
    expect(mix(v1, v2, 0.25)).toEqual(vec4(2.25, 0.5, 2.25, 3.5));
    expect(mix(v1, v2, 0.5)).toEqual(vec4(3.5, -1, 1.5, 3));
    expect(mix(v1, v2, 0.75)).toEqual(vec4(4.75, -2.5, 0.75, 2.5));
    expect(mix(v1, v2, vec4(0, 0.25, 0.5, 0.75))).toEqual(vec4(1, 0.5, 1.5, 2.5));

    expect(mix(10, 20, 0.5)).toBe(15);
  });

  it('Can clamp vectors and values', () => {
    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);
    expect(clamp(v1, 1.25, 3.5)).toEqual(vec4(1.25, 2, 3, 3.5));
    expect(clamp(v2, 1.25, 3.5)).toEqual(vec4(3.5, 1.25, 1.25, 2));

    expect(clamp(-1)).toBe(0);
    expect(clamp(-1, 1)).toBe(0);
    expect(clamp(1.25)).toBe(1);
  });
});

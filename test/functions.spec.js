/* eslint-disable no-multi-spaces */

import expect from 'expect';
import Matrix, { mat2, mat3, mat4 } from '../src/matrix';
import { vec3, vec4 } from '../src/vector';
import { PI, TAU, SPI, QPI } from '../src/constants';
import {
  dot,
  cross,
  det,
  inv,
  triple,
  norm,
  mix,
  clamp,
  step,
  smoothstep,
  standardizeArgument,
  sum,
  avg,
  product,
  deg,
  rad,
  nrmRad,
} from '../src/functions';

describe('Functions tests', () => {
  it('Can standardize arguments', () => {
    expect(standardizeArgument(1)).toEqual([1]);
    expect(standardizeArgument(1, true)).toEqual([[1]]);
    expect(standardizeArgument(0)).toEqual([0]);
    expect(standardizeArgument(0, true)).toEqual([[0]]);
    expect(standardizeArgument([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(standardizeArgument([1, 2, 3, 4], true)).toEqual([[1], [2], [3], [4]]);
    expect(standardizeArgument(vec3(1, 2, 3))).toEqual([1, 2, 3]);
    expect(standardizeArgument(vec3(1, 2, 3), true)).toEqual([[1], [2], [3]]);
    expect(standardizeArgument(mat2(1, 2, 3, 4))).toEqual([1, 2, 3, 4]);
    expect(standardizeArgument(mat2(1, 2, 3, 4), true)).toEqual([[1, 2], [3, 4]]);
  });

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

  it('Can do use convenience functions for matrix determinant and inverse', () => {
    const m = mat4(1, 2, 3, -4, -5, -6, 7, 8, 9, 10, 11, 12, -13, 14, 15, 16);

    expect(m.det()).toBe(25344);
    expect(det(m)).toBe(m.det());
    const im = m.invert();
    expect(im).toBe(m);
    expect(inv(m)).not.toBe(m);
  });

  it('Can do use convenience functions for vector cross and triple product and vector normalization', () => {
    const i = vec3(1, 0, 0);
    const j = vec3(0, 1, 0);
    const k = vec3(0, 0, 1);
    expect(i.cross(j)).toEqual(k);
    expect(k.cross(i)).toEqual(j);
    expect(j.cross(k)).toEqual(i);

    expect(cross(i, j)).toEqual(i.cross(j));
    expect(cross(k, i)).toEqual(k.cross(i));
    expect(cross(j, k)).toEqual(j.cross(k));

    expect(triple(i, j, k)).toBe(1);
    expect(triple(k, i, j)).toBe(k.dot(i.cross(j)));
    const v = vec3(7, 0, 0);
    expect(norm(v)).toEqual(i);
    expect(norm(v).length).toBe(1);
    expect(v.length).toBe(7);
  });

  it('Can mix vectors, matrices and values', () => {
    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);
    expect(mix(v1, v2, 0)).toEqual(v1);
    expect(mix(v1, v2, 1)).toEqual(v2);
    expect(mix(v1, v2, 0.25)).toEqual(vec4(2.25, 0.5, 2.25, 3.5));
    expect(mix(v1, v2, 0.5)).toEqual(vec4(3.5, -1, 1.5, 3));
    expect(mix(v1, v2, 0.75)).toEqual(vec4(4.75, -2.5, 0.75, 2.5));
    expect(mix(v1, v2, vec4(0, 0.25, 0.5, 0.75))).toEqual(vec4(1, 0.5, 1.5, 2.5));

    const m = mat2(-7, 2, 0, 2);
    expect(mix(m, Matrix.identity(2), 0.5)).toEqual(mat2(-3, 1, 0, 1.5));

    expect(mix(10, 20, 0.5)).toBe(15);
  });

  it('Can clamp vectors and values', () => {
    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);

    expect(clamp(v1, 1.25, 3.5)).toEqual(vec4(1.25, 2, 3, 3.5));
    expect(clamp(v2, 1.25, 3.5)).toEqual(vec4(3.5, 1.25, 1.25, 2));
    expect(clamp(
      mat3(
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ),
      2.5,
      8.2,
    )).toEqual(mat3(
      2.5, 2.5, 3,
      4, 5, 6,
      7, 8, 8.2,
    ));
    expect(clamp(-1)).toBe(0);
    expect(clamp(-1, 1)).toBe(0);
    expect(clamp(1.25)).toBe(1);
  });

  it('Can generate threshold values with step and smoothstep functions (as in GLSL)', () => {
    expect(step(0.5, 0.4)).toBe(0);
    expect(step(0.5, 0.5)).toBe(1);
    expect(step(0.5, 0.6)).toBe(1);

    expect(step(vec3(1, 0.5, 2), vec3(2, 0.2, 1))).toEqual(vec3(1, 0, 0));

    expect(smoothstep(0.2, 0.6, 0.1)).toBe(0);
    expect(smoothstep(0.2, 0.6, 0.2)).toBe(0);
    expect(smoothstep(0.2, 0.6, 0.21)).toBeGreaterThan(0);
    expect(smoothstep(0.2, 0.6, 0.4)).toBeCloseTo(0.5);
    expect(smoothstep(0.2, 0.6, 0.6)).toBe(1);
    expect(smoothstep(0.2, 0.6, 0.7)).toBe(1);
  });

  it('Can aggregate array data using sum, avg, product', () => {
    const arr1 = [4, 2, 6, 4.5, 2, 1, -2, 1.7];
    const arr2 = [4, 2, -6, 0, 2, 1, -2, 1.7];

    expect(sum(arr1)).toBe(19.2);
    expect(sum(arr2)).toBe(2.7);
    expect(sum([])).toBe(null);
    expect(sum(['x'])).toBe(null);
    expect(sum('x')).toBe(null);
    expect(avg(arr1)).toBe(2.4);
    expect(avg(arr2)).toBe(0.3375);
    expect(avg([])).toBeUndefined();
    expect(avg(['x'])).toBeUndefined();
    expect(product(arr1)).toBe(-1468.8);
    expect(product(arr2)).toBe(0);
  });

  it('Can covert between degrees and radians', () => {
    expect(deg(0)).toBe(0);
    expect(deg(PI)).toBe(180);
    expect(deg(-PI)).toBe(-180);
    expect(deg(SPI)).toBe(90);
    expect(deg(-SPI)).toBe(-90);
    expect(deg(QPI)).toBe(45);
    expect(deg(-QPI)).toBe(-45);
    expect(deg(TAU)).toBe(360);
    expect(deg(-TAU)).toBe(-360);

    expect(rad(0)).toBe(0);
    expect(rad(180)).toBe(PI);
    expect(rad(-180)).toBe(-PI);
    expect(rad(90)).toBe(SPI);
    expect(rad(-90)).toBe(-SPI);
    expect(rad(45)).toBe(QPI);
    expect(rad(-45)).toBe(-QPI);
    expect(rad(360)).toBe(TAU);
    expect(rad(-360)).toBe(-TAU);

    expect(nrmRad(-QPI)).toBe(TAU - QPI);
    expect(nrmRad(-SPI)).toBe(TAU - SPI);
    expect(nrmRad(-TAU)).toBe(-0);
    expect(nrmRad(-TAU - SPI)).toBe(TAU - SPI);
  });
});

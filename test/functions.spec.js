import expect from 'expect';
import {
  vec,
  add,
  sub,
  sumsqr,
  scalar,
  norm,
  scale,
  dist,
  dir,
  orth2,
  descr,
  angle2,
  angle,
  dot,
  cross,
  cross2,
  triple,
  clamp,
  step,
  smoothstep,
  mix,
  round,
  lerp,
  deg,
  rad,
  nrad,
} from '../src/functions';
import { PI, TAU, SPI, QPI } from '../src/const';
import { Vector, vec2, vec3, vec4 } from '../src/vector';
import { Matrix, mat2 } from '../src/matrix';

describe('functions.js', () => {
  it('should be able to create a vector from two points', () => {
    const p1 = [-1, 0, 2];
    const p2 = [2, -3, 1];

    expect(vec(p1, p2)).toEqual([3, -3, -1]);
    // supply empty array as target
    expect(vec(p1, p2, [])).toEqual([3, -3, -1]);
    // supply array with a specific length
    expect(vec(p1, p2, new Array(2))).toEqual([3, -3]);
    // supply vector as target
    expect(vec(p1, p2, new Vector(3))).toBeInstanceOf(Vector);
  });

  it('should be able to add and subtract vectors/arrays', () => {
    const vectors = [
      vec2(1, -1),
      vec2(3, 2),
      vec2(-6, 0.5),
      vec2(-3.7, 4.3),
    ];

    const arrays = [
      [1, -1],
      [3, 2],
      [-6, 0.5],
      [-3.7, 4.3],
    ];

    // Adds all values to the first first argument.
    // Pass a null-vector first if you want to avoid
    // mutating any of the input arguments like below
    let res = add(vec2(), ...vectors);
    expect(res).toBeInstanceOf(Vector);
    expect(res).toEqual([-5.7, 5.8]);

    expect(vectors[0]).toEqual([1, -1]);

    // this will mutate the first vector in vectors
    res = add(...vectors);
    expect(vectors[0]).toEqual([-5.7, 5.8]);

    // vectors can also be plain arrays.
    res = add(vec2(), ...arrays);
    expect(res).toBeInstanceOf(Vector);
    expect(res).toEqual([-5.7, 5.8]);

    // return result as plain array
    res = add([0, 0], ...arrays);
    expect(res).toBeInstanceOf(Array);
    expect(res).toEqual([-5.7, 5.8]);

    // or allow the first array to be mutated
    res = add(...arrays);
    expect(res).toBeInstanceOf(Array);
    expect(res).toBe(arrays[0]);
    expect(res).toEqual([-5.7, 5.8]);

    // subtracts all following vectors/arrays from the first parameter
    res = sub([5, 6], [3, -1], [0, 5]);
    expect(res).toBeInstanceOf(Array);
    expect(res).toEqual([2, 2]);

    res = sub(vec2(5, 6), [3, -1], [0, 5]);
    expect(res).toBeInstanceOf(Vector);
    expect(res).toEqual([2, 2]);
  });

  it('can calculate the sum of squares', () => {
    expect(sumsqr([1, 3, 4])).toBe(26);
    expect(sumsqr(vec3(-3, -3, 2))).toBe(22);
  });

  it('can calculate the scalar of a vector/array', () => {
    expect(scalar([1, 3, 4])).toBeCloseTo(Math.sqrt(26));
    expect(scalar(vec3(-3, -3, 2))).toBeCloseTo(Math.sqrt(22));
  });

  it('can normalize a vector/array', () => {
    const vector = [2, 3.4, -2];
    const expected = [0.4522156, 0.76876657, -0.4522156];
    let actual = norm(vector, new Vector()); // immutable

    expect(actual).not.toBe(vector);
    expect(actual).toBeInstanceOf(Vector);
    actual.forEach((d, i) => expect(d).toBeCloseTo(expected[i]));

    actual = norm(vector); // mutate vector

    expect(actual).toBe(vector);
    expect(actual).toBeInstanceOf(Array);
    actual.forEach((d, i) => expect(d).toBeCloseTo(expected[i]));
  });

  it('can scale a vector/array by a factor', () => {
    expect(scale([1, 2, 3], 3)).toEqual([3, 6, 9]); // mutating
    expect(scale([1, 2, 3], -1, [])).toEqual([-1, -2, -3]); // immutable
  });

  it('should find the distance between two points', () => {
    expect(dist([10, 0], [-10, 0])).toBe(20);
    expect(dist(vec3(10, 2, -5), [-3, 0, 2])).toBeCloseTo(14.899664);
  });

  it('should find the directional unit vector between two points', () => {
    expect(dir([10, 0], [-10, 0])).toEqual([-1, 0]);

    let expected = [-0.872503, -0.134231, 0.469809];
    dir(vec3(10, 2, -5), [-3, 0, 2]).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));

    expected = [0.707107, -0.707107];
    dir([0, 3], [3, 0]).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));

    // immutable
    dir([0, 3], [3, 0], []).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));
  });

  it('should describe relationships between two points', () => {
    let res = descr([10, -3], [8, 2]);
    expect(res.vector).toBeInstanceOf(Array);
    expect(res.unit).toBeInstanceOf(Array);
    expect(res.vector).toEqual([-2, 5]);
    expect(res.sqr).toBe(29);
    expect(res.dist).toBeCloseTo(5.3851648);
    const expected = [-0.37139068, 0.9284767];
    res.unit.forEach((d, i) => expect(d).toBeCloseTo(expected[i]));

    res = descr([10, -3, 1], [8, 2, 0], new Vector());
    expect(res.vector).toBeInstanceOf(Vector);
    expect(res.unit).toBeInstanceOf(Vector);
    expect(res.vector.x).toBe(-2);
    expect(res.vector.y).toBe(5);
    expect(res.vector.z).toBe(-1);
    expect(res.sqr).toBe(30);
    expect(res.dist).toBeCloseTo(5.4772256);
  });

  it('should find the an orthogonal unit vector', () => {
    expect(orth2([0, 1])).toEqual([-1, 0]);
    expect(orth2([1, 0])).toEqual([-0, 1]);

    let expected = [-1 / Math.sqrt(2), 1 / Math.sqrt(2)];
    orth2([1, 1]).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));

    expected = [-2 / Math.sqrt(20), 4 / Math.sqrt(20)];
    orth2([4, 2]).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));

    expected = [0.049938, -0.99875];

    const vector = vec([10, 2], [-10, 1]);
    orth2(vector).forEach((v, i) => expect(v).toBeCloseTo(expected[i]));
  });

  it('should be able to calculate the vector dot product', () => {
    expect(dot([2, -2, 1], [-3.5, 1.5, -3])).toBe(-13);
    expect(dot([1, 2, 2, 0], [3, -4, 0, -1])).toBe(-5);
    expect(dot([0.1, 2, -1.4, 2], [2, 0.2, 2, 2.83])).toBeCloseTo(3.46, 5);
  });

  it('should be able to calculate the psudo cross product of 2d vectors', () => {
    expect(cross2(vec2(1, 2), vec2(1, 0))).toBe(-2);
    expect(cross2(vec2(1, 2), [-5, 2])).toBe(12);
    expect(cross2([1, 0], vec2(0, 1))).toBe(1);
    expect(cross2([2, 0], [1, 0])).toBe(0);
  });

  it('should be able to find the cross and triple product of 3d vectors', () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);

    const i = vec3(1, 0, 0);
    const j = vec3(0, 1, 0);
    const k = vec3(0, 0, 1);

    const res = vec3();
    expect(cross(i, j, res)).toEqual(k);
    expect(cross(k, i, res)).toEqual(j);
    expect(cross(j, k, res)).toEqual(i);

    expect(triple(i, j, k)).toBe(1);
    expect(triple(k, i, j)).toBe(k.dot(i.cross(j)));
  });

  it('Can find angles of 2d vectors', () => {
    expect(angle2(vec2(1, 0))).toBe(0);
    expect(angle2(vec2(1, 1))).toBe(Math.PI / 4);
    expect(angle2(vec2(0, 1))).toBe(Math.PI / 2);
    expect(angle2(vec2(-1, 0))).toBe(Math.PI);
    expect(angle2(vec2(-1, -1))).toBe(-0.75 * Math.PI);
    expect(angle2(vec2(0, -1))).toBe(-0.5 * Math.PI);
    expect(angle2(vec2(0, 0))).toBe(0);
  });

  it('Can find angles of 3d vectors', () => {
    const v = new Vector(2, 1, 2, 0);

    expect(angle(v)).toBe(angle(v, 0));
    expect(angle(v)).toBeCloseTo(0.841069, 5);
    expect(angle(v, 1)).toBeCloseTo(1.23096, 5);
    expect(angle(v, 2)).toBeCloseTo(0.84107, 5);
    expect(angle(v, 3)).toBeUndefined();
    expect(angle(v, -1)).toBeUndefined();
  });

  it('should be able to clamp values and vectors/arrays', () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(2, 0, 1)).toBe(1);
    expect(clamp(2, 0, 3)).toBe(2);

    expect(clamp([0.32, 6.2, 3.7], 0.4, 5.8)).toEqual([0.4, 5.8, 3.7]);
    expect(clamp(vec3(0.32, 6.2, 3.7), 0.2, 6)).toEqual([0.32, 6, 3.7]);

    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);

    expect(clamp(v1, 1.25, 3.5)).toEqual(vec4(1.25, 2, 3, 3.5));
    expect(clamp(v2, 1.25, 3.5)).toEqual(vec4(3.5, 1.25, 1.25, 2));
    expect(clamp(
      [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
      ],
      2.5,
      8.2,
    )).toEqual([
      2.5, 2.5, 3,
      4, 5, 6,
      7, 8, 8.2,
    ]);
    expect(clamp(-1)).toBe(0);
    expect(clamp(-1, 1)).toBe(1);
    expect(clamp(1.25)).toBe(1);
    expect(clamp(1.25, 0, 0.9)).toBe(0.9);
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

  it('Can mix vectors, matrices and values', () => {
    // mix works on arrays, meaning also vectors and matrices
    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(6, -4, 0, 2);
    const res = new Vector(4);
    expect(mix(v1, v2, 0, res)).toEqual(v1);
    expect(mix(v1, v2, 1, res)).toEqual(v2);
    expect(mix(v1, v2, 0.25, res)).toEqual(vec4(2.25, 0.5, 2.25, 3.5));
    expect(mix(v1, v2, 0.5, res)).toEqual(vec4(3.5, -1, 1.5, 3));
    expect(mix(v1, v2, 0.75, res)).toEqual(vec4(4.75, -2.5, 0.75, 2.5));
    expect(mix(v1, v2, vec4(0, 0.25, 0.5, 0.75), res)).toEqual(vec4(1, 0.5, 1.5, 2.5));

    const m = mat2(-7, 2, 0, 2);
    expect(mix(m, Matrix.identity(2), 0.5)).toEqual(mat2(-3, 1, 0, 1.5));

    // lerp is for mixing primitive numbers
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it('Can round vectors and values', () => {
    expect(round(1.2253455, 2)).toBe(1.23);
    expect(round(1.2253455, 1)).toBe(1.2);
    expect(round(1.2253455, 6)).toBe(1.225346);
    const v = vec4(1.12345, 2.23321, 3.321, 4.033);
    expect(round(v, 1)).toEqual(vec4(1.1, 2.2, 3.3, 4));
  });

  it('Can convert between degrees and radians', () => {
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

    expect(nrad(-QPI)).toBe(TAU - QPI);
    expect(nrad(-SPI)).toBe(TAU - SPI);
    expect(nrad(-TAU)).toBe(-0);
    expect(nrad(-TAU - SPI)).toBe(TAU - SPI);
  });
});


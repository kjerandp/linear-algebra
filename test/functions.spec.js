import expect from 'expect';
import {
  add,
  sub,
  sumsqr,
  scalar,
  norm,
  scale,
  dist,
  dir,
  orth,
  descr,
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
import { Vector, vec2, vec3 } from '../src/vector';

describe('functions.js', () => {
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
    const vec = [2, 3.4, -2];
    const expected = [0.4522156, 0.76876657, -0.4522156];
    let actual = norm(vec, new Vector()); // immutable

    expect(actual).not.toBe(vec);
    expect(actual).toBeInstanceOf(Vector);
    actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i]));

    actual = norm(vec); // mutate vec

    expect(actual).toBe(vec);
    expect(actual).toBeInstanceOf(Array);
    actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i]));
  });

  it('can scale a vector/array by a factor', () => {
    expect(scale([1, 2, 3], 3)).toEqual([3, 6, 9]); // mutating
    expect(scale([1, 2, 3], -1, [])).toEqual([-1, -2, -3]); // immutable
  });
});


import expect from 'expect';
import Vector, { vec2, vec3, vec4 } from '../src/vector';

describe('Vector class tests', () => {
  it('Can create convert arguments to component array', () => {
    expect(Vector.argsToComponents([1, 2, 3])).toEqual([1, 2, 3]);
    expect(Vector.argsToComponents([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(Vector.argsToComponents([1, vec2(2, 3)])).toEqual([1, 2, 3]);
    expect(Vector.argsToComponents(vec4(1, 2, 3, 4))).toEqual([1, 2, 3, 4]);
  });

  it('Can create vectors using constructor and helper functions', () => {
    expect(() => new Vector()).toThrow();
    expect(() => new Vector(1)).toThrow();
    expect(() => new Vector(5)).toThrow();

    let v = new Vector(4);
    expect(v.dim).toEqual(4);
    expect(v.value).toEqual([0, 0, 0, 0]);

    v = new Vector([1, 2, 3]);
    expect(v.dim).toEqual(3);
    expect(v.value).toEqual([1, 2, 3]);
    expect(v.get(0)).toBe(1);
    expect(v.get(1)).toBe(2);
    expect(v.get(2)).toBe(3);

    v = new Vector(1, 2, 3);
    v.dim = 4;
    expect(v.dim).toBe(4);
    expect(v.value).toEqual([1, 2, 3, 0]);

    v = new Vector(4).fill([1, 2, 3, 4]);
    expect(v.value).toEqual([1, 2, 3, 4]);

    v = new Vector(3).fill(1, 2, 3, 4);
    expect(v.value).toEqual([1, 2, 3]);

    v = new Vector(2).fill(vec2(1, 2).swizzle('yx'));
    expect(v.value).toEqual([2, 1]);

    v = new Vector(vec2(1, 2, 3));
    expect(v.dim).toEqual(2);
    expect(v.value).toEqual([1, 2]);

    v = new Vector(1, [2, 3]);
    expect(v.dim).toBe(3);
    expect(v.value).toEqual([1, 2, 3]);

    v = vec2();
    expect(v.dim).toBe(2);
    expect(v.value).toEqual([0, 0]);

    v = vec2(1);
    expect(v.value).toEqual([1, 1]);

    v = vec2(1, 2);
    expect(v.value).toEqual([1, 2]);

    v = vec3();
    expect(v.dim).toBe(3);
    expect(v.value).toEqual([0, 0, 0]);

    v = vec3(1);
    expect(v.value).toEqual([1, 1, 1]);

    v = vec3(1, 0);
    expect(v.value).toEqual([1, 0, 0]);

    v = vec3(1, 2);
    expect(v.value).toEqual([1, 2, 0]);

    v = vec4(1, 2, 3, 4);
    expect(v.dim).toBe(4);
    expect(v.value).toEqual([1, 2, 3, 4]);
  });

  it('Can clone/copy vectors', () => {
    const v = vec4(1, 2, 3, 4);

    const clone = v.clone();

    expect(clone).toEqual(v);
    clone.y = -5;
    expect(clone).not.toEqual(v);

    expect(v.copy()).toEqual(v);
    expect(v.copy('xxww').value).toEqual([1, 1, 4, 4]);
  });

  it('Can get/set vector components using accessors', () => {
    const v = new Vector(4);

    expect(v.value).toEqual([0, 0, 0, 0]);

    v.x = 1;
    v.y = 2;
    v.z = 3;
    v.w = 4;

    expect(v.value).toEqual([1, 2, 3, 4]);

    v.r = 2;
    v.g = 3;
    v.b = 4;
    v.a = 5;

    expect(v.value).toEqual([2, 3, 4, 5]);

    v.dim = 3;

    expect(v.value).toEqual([2, 3, 4]);

    v.fill([1, 2, 3, 4]);
    expect(v.value).toEqual([1, 2, 3]);

    const u = vec4(1, 2, 3, 4);
    expect(u.x).toBe(1);
    expect(u.y).toBe(2);
    expect(u.z).toBe(3);
    expect(u.w).toBe(4);
    expect(u.x).toBe(u.r);
    expect(u.y).toBe(u.g);
    expect(u.z).toBe(u.b);
    expect(u.w).toBe(u.a);
    expect(u.x).toBe(u.i);
    expect(u.y).toBe(u.j);
    expect(u.z).toBe(u.k);
    expect(u.w).toBe(u.l);
    expect(u.x).toBe(u.s);
    expect(u.y).toBe(u.t);
    expect(u.z).toBe(u.u);
    expect(u.w).toBe(u.v);

  });

  it('Can use swizzle to extract/change vector values', () => {
    const v = new Vector(2, 4, 6, 8);

    expect(v.value).toEqual([2, 4, 6, 8]);
    expect(v.swizzle('xxxx')).toEqual([2, 2, 2, 2]);
    expect(v.swizzle('zwyx')).toEqual([6, 8, 4, 2]);
    expect(v.swizzle('abgrgba')).toEqual([8, 6, 4, 2, 4, 6, 8]);
    expect(v.swizzle('yz')).toEqual([4, 6]);
    expect(v.swizzle('uv')).toEqual([6, 8]);
    expect(v.swizzle('ijkl')).toEqual([2, 4, 6, 8]);
    expect(() => v.swizzle('yzp')).toThrow('Invalid arguments!');
    expect(vec4(1, 2, 3, 4).swap('wyzx').value).toEqual([4, 2, 3, 1]);
  });

  it('Can calculate vector lengths', () => {
    const v = new Vector(2, 1, 2, 0);

    expect(v.length).toEqual(3);
    v.z = 4;
    expect(v.length).toBeCloseTo(4.582575, 5);
    v.z = 2;
    expect(v.length).toEqual(3);
    v.scale(0.5);
    expect(v.length).toEqual(1.5);
  });

  it('Can calculate vector angles', () => {
    const v = new Vector(2, 1, 2, 0);

    expect(v.angle()).toBe(v.angle(0));
    expect(v.angle()).toBeCloseTo(0.841069, 5);
    expect(v.angle(1)).toBeCloseTo(1.23096, 5);
    expect(v.angle(2)).toBeCloseTo(0.84107, 5);
    expect(v.angle(3)).toBeUndefined();
    expect(v.angle(-1)).toBeUndefined();

    expect(vec2(1, 0).angle()).toBe(0);
    expect(vec2(1, 1).angle()).toBe(Math.PI / 4);
    expect(vec2(0, 1).angle()).toBe(Math.PI / 2);
    expect(vec2(-1, 0).angle()).toBe(Math.PI);
    expect(vec2(-1, -1).angle()).toBe(-0.75 * Math.PI);
    expect(vec2(0, -1).angle()).toBe(-0.5 * Math.PI);
    expect(vec2(0, 0).angle()).toBe(0);

  });

  it('Can normalize vectors', () => {
    expect(vec3(1, 0, 0).normalize().value).toEqual([1, 0, 0]);

    const actual = vec3(4, 2, 1).normalize().value;
    const expected = [0.87287, 0.43644, 0.21822];
    actual.every((x, i) => expect(x).toBeCloseTo(expected[i], 5));

    const v = new Vector(2, 1, 2, 0);
    expect(v.unitVector()).not.toBe(v);
    expect(v.normalize()).toBe(v);
  });

  it('Can do vector arithmetic', () => {
    expect(
      vec4(1, 2, 2).add(
        vec4(3, -4, 0, -1),
      ).value).toEqual([4, -2, 2, -1]);

    expect(
      vec2(1, 2, 2).add(
        vec4(3, -4, 0, -1),
      ).value).toEqual([4, -2]);

    expect(
      vec4(1, 2, 2).add(
        vec2(3, -4, 0, -1),
      ).value).toEqual([4, -2, 2, 0]);

    expect(
      vec4(1, 2, 2).sub(
        vec4(3, -4, 0, -1),
      ).value).toEqual([-2, 6, 2, 1]);

    expect(
      vec4(1, 2, 2.3).sub(
        vec4(3, -4, 0.2, -1),
      ).z).toBeCloseTo(2.1, 5);

    const v = vec4(1, 2, 3, 4);
    expect(v.scale()).toBe(v);
    expect(v.scale(0.5).value).toEqual([0.5, 1, 1.5, 2]);
    expect(vec4(1, 2, 2.3).scale(2).value).toEqual([2, 4, 4.6, 0]);
    expect(vec4(1, 2, 3, 4).scale(vec4(2, 4, 0, 1)).value).toEqual([2, 8, 0, 4]);
    expect(vec4(1, 2, 3, 4).scale(vec2(2, 4)).value).toEqual([2, 8, 0, 0]);
    expect(vec4(1, 2, 3, 4).scale(vec2(2, 4), 2, 3).value).toEqual([2, 8, 6, 12]);
    expect(vec4(1, 2, 3, 4).scale(2, 2, 1, 0).value).toEqual([2, 4, 3, 0]);

    expect(
      vec4(1, 2, 2).dot(
        vec4(3, -4, 0, -1),
      )).toEqual(-5);

    expect(
      vec4(0.1, 2, -1.4, 2).dot(
        vec4(2, 0.2, 2, 2.83),
      )).toBeCloseTo(3.46, 5);

    const v1 = vec4(1, 2, 3, 4);
    const v2 = vec4(1, 0, 1, 0);
    const v3 = v1.add(v2);

    expect(v1).not.toBe(v3);

    const v4 = v1.addFrom(v2);

    expect(v1).toBe(v4);

    expect(vec2(1, 2).cross(vec2(1, 0))).toBe(-2);
    expect(vec2(1, 2).cross(vec2(-5, 2))).toBe(12);
    expect(vec2(1, 0).cross(vec2(0, 1))).toBe(1);
    expect(vec2(2, 0).cross(vec2(1, 0))).toBe(0);

    expect(vec3(1, 0, 0).cross(vec3(0, 1, 0))).toEqual(vec3(0, 0, 1));
  });

  it('Can clamp vectors', () => {
    expect(vec4(1, 2, 3, 4).clamp(1.7, 3).value).toEqual([1.7, 2, 3, 3]);
    expect(vec3(1, 2, 3).clamp(1.7, 2.5).value).toEqual([1.7, 2, 2.5]);
    expect(vec2(1, 2).clamp(1, 2).value).toEqual([1, 2]);
  });
});

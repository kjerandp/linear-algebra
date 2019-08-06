import expect from 'expect';
import { Vector, vec, nvec, vec2, vec3, vec4 } from '../src/vector';


describe('vector', () => {
  it('should be possible to instantiate and assign values using factory functions', () => {
    expect(vec3()).toEqual([0, 0, 0]);
    expect(vec4(1)).toEqual([1, 1, 1, 1]);
    expect(vec3(vec2(1, 2), 3)).toEqual([1, 2, 3]);
    expect(nvec(10)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const vectorFromArray = vec([1, 2, 3, 4]);
    expect(vectorFromArray).toEqual([1, 2, 3, 4]);
    expect(vectorFromArray).toBeInstanceOf(Vector);
    expect(vectorFromArray).toBeInstanceOf(Array);
    expect(new Vector(4)).toEqual(new Array(4));
  });

  it('should be able to use array getters/setters and extended/added vector getter/setters', () => {
    const v = vec4(1, 2, 3, 4);

    expect(v[0]).toBe(1);
    expect(v[1]).toBe(2);
    expect(v[2]).toBe(3);
    expect(v[3]).toBe(4);

    expect(v.length).toBe(4);

    // coordinates
    expect(v.x).toBe(v[0]);
    expect(v.y).toBe(v[1]);
    expect(v.z).toBe(v[2]);
    expect(v.w).toBe(v[3]);

    // rgba
    expect(v.r).toBe(v[0]);
    expect(v.g).toBe(v[1]);
    expect(v.b).toBe(v[2]);
    expect(v.a).toBe(v[3]);

    // ijkl
    expect(v.i).toBe(v[0]);
    expect(v.j).toBe(v[1]);
    expect(v.k).toBe(v[2]);
    expect(v.l).toBe(v[3]);

    // stuv
    expect(v.s).toBe(v[0]);
    expect(v.t).toBe(v[1]);
    expect(v.u).toBe(v[2]);
    expect(v.v).toBe(v[3]);

    v[1] = 6;
    expect(v.y).toBe(6);

    // "swizzle"
    const swizzled = v.swizzle('xxzy');
    expect(swizzled).toEqual([1, 1, 3, 6]);
  });

  it('should be possible to clone vector', () => {
    const v = vec2(-3, 2);
    const clone = v.clone();
    expect(clone).toEqual(v);
    expect(clone).not.toBe(v);
    v.x = 0;
    expect(v).toEqual([0, 2]);
    expect(clone).toEqual([-3, 2]);
  });

  it('should be mappable to float32 array', () => {
    const v = vec4(1.002, 2.3245, -3.6612, 4.3);
    const f = new Float32Array(v);
    expect(f).toBeInstanceOf(Float32Array);
    expect(f[0]).toBeCloseTo(1.002);
    expect(f[1]).toBeCloseTo(2.3245);
    expect(f[2]).toBeCloseTo(-3.6612);
    expect(f[3]).toBeCloseTo(4.3);
  });

  it('should be possible to add/subtract multiple vectors', () => {
    const vectors = [
      vec2(1, 4),
      vec2(-2, 0),
      vec2(7, -3),
    ];

    const v1 = vec2(-3, 2);
    expect(v1.add(...vectors)).toEqual([3, 3]);

    const v2 = vec2(-3, 2);
    expect(v2.sub(...vectors)).toEqual([-9, 1]);
  });

  it('should calculate the vector scalar (length)', () => {
    const v = vec2(-3, 2);
    expect(v.scalar()).toBeCloseTo(Math.sqrt(13));
  });
});

import expect from 'expect';
import { Matrix } from '../src/matrix';
import { vec2, vec3, Vector } from '../src/vector';

describe('some example use cases', () => {
  it('Can transform from one dimension to another', () => {
    // 3d to 2d
    let m = new Matrix(2, 3, [
      2, 0, 0,
      0, 3, 0,
    ]);
    let v = vec3(2, -2, 4);

    let t = m.dot(v);
    expect(t.length).toBe(2);
    expect(t).toEqual([4, -6]);

    // 3d to 1d
    m = new Matrix(1, 3, [2, 0, 0]);
    v = vec3(2, -2, 4);

    t = m.dot(v);
    expect(t).toEqual([4]);

    // 2d to 3d
    m = new Matrix(3, 2, [
      1, 0,
      0, 1,
      1, 1,
    ]);

    v = vec2(2, -5);

    t = m.dot(v, new Vector(3));
    expect(t.length).toBe(3);
    expect(t).toEqual([2, -5, -3]);
  });
});

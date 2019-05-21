import expect from 'expect';
import NumArray from '../src/num-array';

describe('NumArray class', () => {
  it('Should be able to initialize with values and retrieve values using get', () => {
    expect(new NumArray()).toBeInstanceOf(Array);

    const a = new NumArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new NumArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);

    expect(a.get(3)).toBe(3);
    expect(a.get(3, 2)).toBeUndefined();
    expect(b.get(1, 1)).toBe(1);
    expect(b.get(1, 2)).toBe(2);
    expect(b.get(1, 3)).toBe(3);
    expect(b.get(2, 1)).toBe(4);
    expect(b.get(2, 2)).toBe(5);
    expect(b.get(2, 3)).toBe(6);
    expect(b.get(3, 1)).toBe(7);
    expect(b.get(3, 2)).toBe(8);
    expect(b.get(3, 3)).toBe(9);
    expect(b.get(7)).toBeUndefined();
    expect(a.get(10)).toBeUndefined();
    expect(b.get(1, -2)).toBeUndefined();
  });

  it('Should be able to set values after initialization', () => {
    // 1d array
    let a = new NumArray([1, 2, 3, 4]);
    expect(a.length).toBe(4);
    expect(a.set(1, 2, 3).value).toEqual([1, 2, 3]);
    expect(a.length).toBe(3);

    a.value = [3, 4, 5, 6];
    expect(a.value).toEqual([3, 4, 5, 6]);
    expect(a.length).toBe(4);

    a = new NumArray();
    expect(a.length).toBe(0);
    expect(a.set(1, 2).value).toEqual([1, 2]);
    expect(a.length).toBe(2);
    expect(a.set().value).toEqual([]);
    expect(a.length).toBe(0);

    // 2d array
    a = new NumArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    a.cell(2, 2).value = 9;
    expect(a.value).toEqual([1, 2, 3, 4, 9, 6, 7, 8, 9]);
    expect(a.set([1, 2, 3]).value).toEqual([1, 2, 3]);
    expect(a.set(1, 2).value).toEqual([1, 2]);
    expect(a.set([1, 2], [3, 4, 5], 6).value).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('Can re-assign its values by using the assign method (callback)', () => {
    const a = new NumArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    a.assign((cv, i, j, n) => {
      expect(cv).toBe(a[n]);
      expect(i).toBe(Math.floor(n / 3) + 1);
      expect(j).toBe((n % 3) + 1);
      return cv * 2;
    });
    expect(a.value).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });
});

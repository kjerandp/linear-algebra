import expect from 'expect';
import Table from '../src/table';

describe('Table class', () => {
  it('Should be able to initialize with values and retrieve values using get', () => {
    expect(new Table(4)).toBeInstanceOf(Array);

    const a = new Table([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = new Table(3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

    expect(a.get(2)).toBe(3);
    expect(a.get(3, 2)).toBeUndefined();
    expect(b.get(0, 0)).toBe(1);
    expect(b.get(1, 0)).toBe(2);
    expect(b.get(2, 0)).toBe(3);
    expect(b.get(0, 1)).toBe(4);
    expect(b.get(1, 1)).toBe(5);
    expect(b.get(2, 1)).toBe(6);
    expect(b.get(0, 2)).toBe(7);
    expect(b.get(1, 2)).toBe(8);
    expect(b.get(2, 2)).toBe(9);
    expect(b.get(7)).toBeUndefined();
    expect(a.get(10)).toBeUndefined();
    expect(b.get(1, -2)).toBeUndefined();

    const c = new Table([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);

    expect(c.cols).toBe(4);
    expect(c.rows).toBe(2);
  });

  it('Should be able to set values after initialization', () => {
    // 1d array
    let a = new Table([1, 2, 3, 4]);
    expect(a.length).toBe(4);
    expect(a.set(1, 0, 3).value).toEqual([1, 3, 3, 4]);
    expect(a.length).toBe(4);
    a.value = [1, 2, 3];
    expect(a.length).toBe(3);

    a.value = [3, 4, 5, 6];
    expect(a.value).toEqual([3, 4, 5, 6]);
    expect(a.length).toBe(4);

    a = new Table(3);
    expect(a.length).toBe(0);
    expect(a.cols).toBe(3);
    a.value = [1, 2];
    expect(a.value).toEqual([1, 2]);
    expect(a.length).toBe(2);
    a.value = [1, 2, 3, 4];
    expect(a.cols).toBe(3);
    expect(a.rows).toBe(2);
    expect(a.length).toBe(4);

    // 2d array
    a = new Table(3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    a[a.index(1, 1)] = 9;
    expect(a.value).toEqual([1, 2, 3, 4, 9, 6, 7, 8, 9]);
    expect(a.set([1, 2, 3]).value).toEqual([1, 2, 3]);
    expect(a.set([1, 2]).value).toEqual([1, 2]);
    expect(a.set([1, 2], [3, 4, 5], 6).value).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('Can re-assign its values by using the assign method (callback)', () => {
    const a = new Table([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    a.assign((cv, c, r, n) => {
      expect(cv).toBe(a[n]);
      expect(r).toBe(Math.floor(n / 3));
      expect(c).toBe((n % 3));
      return cv * 2;
    });
    expect(a.value).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });

  it('Should support other datatypes than numbers', () => {
    const t = new Table(2, 'abcd');

    expect(t.value).toEqual(['a', 'b', 'c', 'd']);
    expect(t.get(0, 1)).toBe('c');
    t.set(1, 1, 3);
    expect(t.value).toEqual(['a', 'b', 'c', 3]);
  });

  it('Can clamp numeric values', () => {
    const t = new Table([-2, 257, 300, 127]);
    expect(t.clamp(0, 255).value).toEqual([0, 255, 255, 127]);
  });

  it('Can negate numeric values', () => {
    const t = new Table([-2, 257, 300, 127, 0]);
    expect(t.negate().value).toEqual([2, -257, -300, -127, -0]);
  });

  it('Can add from other tables', () => {
    const t = new Table([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    expect(t.add([1, 0, -1]).value).toEqual([2, 2, 2, 4, 5, 6]);
    expect(t.add([1], [1, 2, 3], new Table([1, 2, 3, 4])).value).toEqual([5, 6, 8, 8, 5, 6]);
  });

  it('Can return values by row major and column major', () => {
    const t = new Table([
      [1, 2, 3],
      [4, 5, 6],
    ]);

    expect(t.value).toEqual([1, 2, 3, 4, 5, 6]);
    expect(t.valueColumnMajor).toEqual([1, 4, 2, 5, 3, 6]);
  });
});

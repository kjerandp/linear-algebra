import expect from 'expect';
import factory from '../src/value-operations';


const c = factory();

describe('Value operations', () => {
  it('Should be able to do basic arithmetic operations', () => {
    expect(c.product(1, 2, 3)).toBe(6);
    expect(c.product(1, 2, 3, 4, 5, 6, 7, 8)).toBe(40320);
    expect(c.clamp(-1)).toBe(0);
    expect(c.clamp(2)).toBe(1);
    expect(c.clamp(2, 0, 3)).toBe(2);
    expect(c.sum(1, 2, 3)).toBe(6);
    expect(c.sum(1, 2, 3, 4, 5, 6, 7, 8)).toBe(36);
    expect(c.sum()).toBe(0);
  });
});

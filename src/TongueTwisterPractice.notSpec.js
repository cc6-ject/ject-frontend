const { randomArrayIndex } = require('.');

describe('random tongue twisters', () => {
  it('should not have the same tongue twister in a row', () => {
    for (let i = 0; i < 200; i + 1) {
      expect(randomArrayIndex(0)).not.toBe(0);
    }
  });
  it('should not select a number longer than array.length-1', () => {
    for (let i = 0; i < 200; i + 1) {
      expect(randomArrayIndex(0)).toBeLessThan(randomArrayIndex.length);
    }
  });
});

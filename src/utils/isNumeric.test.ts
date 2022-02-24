// write unit test for isNumeric function

import { isNumeric } from './isNumeric';

describe('isNumeric', () => {
    it('should return true for numeric strings', () => {
        expect(isNumeric('123')).toBe(true);
        expect(isNumeric('0')).toBe(true);
        expect(isNumeric('-123')).toBe(true);
        expect(isNumeric('0.5')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
        expect(isNumeric('abc')).toBe(false);
        expect(isNumeric('1.2.3')).toBe(false);
        expect(isNumeric('0,5')).toBe(false);
        expect(isNumeric('-123-')).toBe(false);
        expect(isNumeric('0.x5')).toBe(false);
        expect(isNumeric('')).toBe(false);
        expect(isNumeric(' ')).toBe(false);
        expect(isNumeric('  ')).toBe(false);
        expect(isNumeric('\t')).toBe(false);
        expect(isNumeric('\n')).toBe(false);
        expect(isNumeric('\r')).toBe(false);
        expect(isNumeric('\r\n')).toBe(false);
        expect(isNumeric('\n\r')).toBe(false);
    });
});

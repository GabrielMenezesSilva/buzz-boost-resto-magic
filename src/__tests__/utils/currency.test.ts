import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCHF } from '@/utils/currency';

describe('formatCurrency', () => {
    it('formats zero correctly', () => {
        const result = formatCurrency(0);
        expect(result).toContain('0');
        expect(result).toContain('CHF');
    });

    it('formats a positive integer', () => {
        const result = formatCurrency(100);
        expect(result).toContain('100');
        expect(result).toContain('CHF');
    });

    it('formats a decimal value', () => {
        const result = formatCurrency(12.5);
        expect(result).toContain('12');
        expect(result).toContain('CHF');
    });

    it('formats a large amount', () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain('CHF');
        // fr-CH locale formats 1234.56 — value must be present
        expect(result).toMatch(/1[\s\u202f']?234/);
    });

    it('formats a negative amount', () => {
        const result = formatCurrency(-50);
        expect(result).toContain('CHF');
        expect(result).toContain('50');
    });

    it('returns a string', () => {
        expect(typeof formatCurrency(42)).toBe('string');
    });
});

describe('formatCHF', () => {
    it('is an alias of formatCurrency', () => {
        expect(formatCHF).toBe(formatCurrency);
    });

    it('produces the same output as formatCurrency', () => {
        const values = [0, 1, 9.99, 100, 1234.56, -5];
        values.forEach(v => {
            expect(formatCHF(v)).toBe(formatCurrency(v));
        });
    });

    it('always includes the CHF currency symbol or code', () => {
        [0, 50, 999.99].forEach(v => {
            expect(formatCHF(v)).toContain('CHF');
        });
    });
});

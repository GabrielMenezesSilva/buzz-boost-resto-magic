import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            const result = cn('text-red-500', 'bg-blue-500', undefined, null, false);
            expect(result).toBe('text-red-500 bg-blue-500');
        });

        it('should handle tailwind conflicts using tailwind-merge', () => {
            const result = cn('px-2 py-1', 'p-4');
            // p-4 overrides px-2 and py-1
            expect(result).toBe('p-4');
        });

        it('should handle conditional classes using clsx', () => {
            const isActive = true;
            const isPending = false;
            const result = cn('base-class', { 'active': isActive, 'pending': isPending });
            expect(result).toBe('base-class active');
        });
    });
});

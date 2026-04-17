/**
 * Tests for the PublicForm Zod validation schema.
 *
 * The schema is extracted here so it can be tested without mounting the full
 * React component (which requires Supabase, Router, i18n contexts, etc.).
 *
 * Rules:
 *  - name   ≥ 2 characters
 *  - phone  valid Swiss (+41) or international
 *  - email  required & valid format
 *  - privacyConsent  must be true
 */
import { describe, it, expect } from 'vitest';
import * as z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

// ─── Re-declare schema (mirrors PublicForm.tsx exactly) ────────────────────
const formSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phone: z.string().min(7, 'Numéro de téléphone invalide').refine(
        (val) => {
            const withPlus = val.startsWith('+') ? val : `+${val}`;
            return (
                isValidPhoneNumber(withPlus) ||
                isValidPhoneNumber(val, 'CH') ||
                isValidPhoneNumber(val, 'BR')
            );
        },
        'Format de téléphone invalide (accepte Suisse, Brésil et formats internationaux)'
    ),
    email: z.string().min(1, "L'email est obligatoire").email('Email invalide'),
    notes: z.string().optional(),
    privacyConsent: z.boolean().refine(val => val === true, { message: 'Required' }),
});

type FormData = z.infer<typeof formSchema>;

const validData: FormData = {
    name: 'Marie Dupont',
    phone: '+41791234567',
    email: 'marie@example.com',
    privacyConsent: true,
};

const parse = (data: Partial<FormData>) =>
    formSchema.safeParse({ ...validData, ...data });

// ─── name ─────────────────────────────────────────────────────────────────────
describe('name validation', () => {
    it('accepts a name with 2+ characters', () => {
        expect(parse({ name: 'Al' }).success).toBe(true);
    });

    it('rejects a name with fewer than 2 characters', () => {
        const r = parse({ name: 'A' });
        expect(r.success).toBe(false);
        if (!r.success) {
            expect(r.error.issues[0].message).toContain('2 caractères');
        }
    });

    it('rejects an empty name', () => {
        expect(parse({ name: '' }).success).toBe(false);
    });

    it('accepts names with spaces and accents', () => {
        expect(parse({ name: 'Jean-François Müller' }).success).toBe(true);
    });
});

// ─── phone ────────────────────────────────────────────────────────────────────
describe('phone validation', () => {
    it('accepts a valid Swiss number with +41 prefix', () => {
        expect(parse({ phone: '+41791234567' }).success).toBe(true);
    });

    it('accepts a valid Swiss number without +41 prefix (local format)', () => {
        expect(parse({ phone: '0791234567' }).success).toBe(true);
    });

    it('accepts a valid Brazilian number', () => {
        expect(parse({ phone: '+5511987654321' }).success).toBe(true);
    });

    it('accepts a valid French number', () => {
        expect(parse({ phone: '+33612345678' }).success).toBe(true);
    });

    it('rejects a too-short number', () => {
        expect(parse({ phone: '123' }).success).toBe(false);
    });

    it('rejects a clearly invalid number', () => {
        // 12345678 — 8 digits, not a real Swiss/BR number
        const r = parse({ phone: '00000000000' });
        expect(r.success).toBe(false);
    });
});

// ─── email ────────────────────────────────────────────────────────────────────
describe('email validation', () => {
    it('accepts a valid email', () => {
        expect(parse({ email: 'test@example.ch' }).success).toBe(true);
    });

    it('rejects an empty email', () => {
        expect(parse({ email: '' }).success).toBe(false);
    });

    it('rejects an email without @', () => {
        expect(parse({ email: 'notanemail' }).success).toBe(false);
    });

    it('rejects an email without domain', () => {
        expect(parse({ email: 'test@' }).success).toBe(false);
    });

    it('accepts subdomains', () => {
        expect(parse({ email: 'user@mail.restaurant.ch' }).success).toBe(true);
    });
});

// ─── notes ────────────────────────────────────────────────────────────────────
describe('notes validation', () => {
    it('is optional — accepts undefined', () => {
        const data = { ...validData };
        // notes not set at all
        expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('accepts an empty string', () => {
        expect(parse({ notes: '' }).success).toBe(true);
    });

    it('accepts a non-empty string', () => {
        expect(parse({ notes: 'Allergie aux noix' }).success).toBe(true);
    });
});

// ─── privacyConsent ───────────────────────────────────────────────────────────
describe('privacyConsent validation', () => {
    it('accepts true', () => {
        expect(parse({ privacyConsent: true }).success).toBe(true);
    });

    it('rejects false', () => {
        const r = parse({ privacyConsent: false });
        expect(r.success).toBe(false);
        if (!r.success) {
            expect(r.error.issues[0].message).toBe('Required');
        }
    });
});

// ─── full form ────────────────────────────────────────────────────────────────
describe('full form validation', () => {
    it('passes with all valid fields', () => {
        expect(formSchema.safeParse(validData).success).toBe(true);
    });

    it('fails when multiple fields are invalid', () => {
        const r = formSchema.safeParse({
            name: 'A',
            phone: '123',
            email: 'bad',
            privacyConsent: false,
        });
        expect(r.success).toBe(false);
        if (!r.success) {
            expect(r.error.issues.length).toBeGreaterThan(1);
        }
    });

    it('infers the correct TypeScript shape', () => {
        const parsed = formSchema.safeParse(validData);
        if (parsed.success) {
            // Type assertion — if this compiles, the shape is correct
            const _data: FormData = parsed.data;
            expect(_data.name).toBe(validData.name);
        }
    });
});

/**
 * Tests for useCampaigns business logic.
 *
 * Strategy: test the pure stats-computation logic and the CRUD functions
 * by mocking Supabase and useAuth.  No real network calls are made.
 */
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: vi.fn(),
        functions: { invoke: vi.fn() },
        auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) },
        channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
        removeChannel: vi.fn(),
    },
}));

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({
        user: { id: 'user-test-1' },
        profile: null,
        loading: false,
    })),
}));

vi.mock('@/contexts/LanguageContext', () => ({
    useLanguage: vi.fn(() => ({
        t: (key: string) => key,
        language: 'fr',
    })),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { supabase } from '@/integrations/supabase/client';

const mockFrom = supabase.from as Mock;

/** Returns a chainable Supabase query builder mock that resolves to `result`. */
const chainOf = (result: unknown) => {
    const chain: Record<string, unknown> = {};
    const methods = ['select', 'insert', 'update', 'delete', 'eq', 'order', 'single', 'ilike', 'limit', 'maybeSingle'];
    methods.forEach(m => { chain[m] = vi.fn(() => chain); });
    // The final await resolves to result
    (chain as Record<string, unknown> & { then: unknown }).then = (resolve: (v: unknown) => void) =>
        Promise.resolve(result).then(resolve);
    return chain;
};

const makeCampaign = (overrides: Record<string, unknown> = {}) => ({
    id: 'camp-1',
    name: 'Promo été',
    message: 'Bonjour {nom}!',
    campaign_type: 'whatsapp',
    status: 'draft',
    total_recipients: 50,
    successful_sends: 45,
    failed_sends: 5,
    scheduled_at: null,
    sent_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
});

// ─── Wrapper ──────────────────────────────────────────────────────────────────

const createWrapper = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: qc }, children);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useCampaigns — stats computation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: fetchCampaigns returns two campaigns
        const campaigns = [
            makeCampaign({ id: 'c1', status: 'sent', total_recipients: 100, successful_sends: 90 }),
            makeCampaign({ id: 'c2', status: 'sending', total_recipients: 50, successful_sends: 50 }),
        ];
        mockFrom.mockReturnValue(chainOf({ data: campaigns, error: null }));
    });

    it('counts active + sending campaigns', async () => {
        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const activeStat = result.current.stats.find(s => s.title === 'campaigns.stats.activeCampaigns');
        // c2 is 'sending' → count = 1
        expect(activeStat?.value).toBe('1');
    });

    it('sums total_recipients for messagesSent stat', async () => {
        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const sentStat = result.current.stats.find(s => s.title === 'campaigns.stats.messagesSent');
        expect(sentStat?.value).toBe('150'); // 100 + 50
    });

    it('calculates successRate as a percentage string', async () => {
        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const rateStat = result.current.stats.find(s => s.title === 'campaigns.stats.successRate');
        // (90 + 50) / (100 + 50) = 140/150 ≈ 93%
        expect(rateStat?.value).toBe('93%');
    });

    it('returns 0% success rate when no campaigns', async () => {
        mockFrom.mockReturnValue(chainOf({ data: [], error: null }));

        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const rateStat = result.current.stats.find(s => s.title === 'campaigns.stats.successRate');
        expect(rateStat?.value).toBe('0%');
    });

    it('totalCampaigns stat reflects campaign count', async () => {
        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        const totalStat = result.current.stats.find(s => s.title === 'campaigns.stats.totalCampaigns');
        expect(totalStat?.value).toBe('2');
    });
});

describe('useCampaigns — createCampaign', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFrom.mockReturnValue(chainOf({ data: [], error: null }));
    });

    it('throws when user is not authenticated', async () => {
        const { useAuth } = await import('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: null });

        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await expect(
            act(() =>
                result.current.createCampaign({
                    name: 'Test',
                    message: 'Hello',
                    campaign_type: 'whatsapp',
                })
            )
        ).rejects.toThrow('User not authenticated');
    });
});

describe('useCampaigns — deleteCampaign', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        const { useAuth } = require('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: { id: 'user-test-1' } });
        mockFrom.mockReturnValue(chainOf({ data: [], error: null }));
    });

    it('throws when user is not authenticated', async () => {
        const { useAuth } = await import('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: null });

        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await expect(
            act(() => result.current.deleteCampaign('camp-1'))
        ).rejects.toThrow('User not authenticated');
    });
});

describe('useCampaigns — sendCampaign', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        const { useAuth } = require('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: { id: 'user-test-1' } });
        mockFrom.mockReturnValue(chainOf({ data: [], error: null }));
    });

    it('invokes the send-campaign edge function with campaignId', async () => {
        (supabase.functions.invoke as Mock).mockResolvedValue({ data: { sent: 10 }, error: null });

        const { useAuth } = await import('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: { id: 'user-test-1' } });

        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        let response: unknown;
        await act(async () => {
            response = await result.current.sendCampaign('camp-abc');
        });

        expect(supabase.functions.invoke).toHaveBeenCalledWith('send-campaign', {
            body: { campaignId: 'camp-abc' },
        });
        expect(response).toEqual({ sent: 10 });
    });

    it('throws when the edge function returns an error', async () => {
        (supabase.functions.invoke as Mock).mockResolvedValue({
            data: null,
            error: new Error('Edge function error'),
        });

        const { useAuth } = await import('@/hooks/useAuth');
        (useAuth as Mock).mockReturnValue({ user: { id: 'user-test-1' } });

        const { useCampaigns } = await import('@/hooks/useCampaigns');
        const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await expect(
            act(() => result.current.sendCampaign('camp-bad'))
        ).rejects.toThrow('Edge function error');
    });
});

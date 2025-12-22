import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboardService } from '../useDashboard.service';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    queryOptions: vi.fn((options) => options),
}));

vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    in: vi.fn(() => ({
                        data: [],
                        error: null,
                    })),
                    gte: vi.fn(() => ({
                        lte: vi.fn(() => ({
                            order: vi.fn(() => ({
                                data: [],
                                error: null,
                            })),
                        })),
                    })),
                    order: vi.fn(() => ({
                        data: [],
                        error: null,
                    })),
                })),
                data: [],
                error: null,
            })),
        })),
    },
}));

// Import mocked useQuery to set implementation in tests
import { useQuery } from '@tanstack/react-query';

describe('useDashboardService', () => {
    const mockFamilyId = 'family-123';
    const mockUser = { id: 'user-123' } as any;
    const mockPeriod = '1m';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns combined dashboard data', () => {
        const mockTransactions = [{ id: 'tx-1' }];
        const mockBalance = 1000;
        const mockSubs = [{ id: 'sub-1' }];
        const mockProposals = [{ id: 'prop-1' }];
        const mockHistory = [{ date: '2025-01-01', balance: 1000 }];

        (useQuery as any).mockImplementation((options: any) => {
            const key = options.queryKey;
            if (key[0] === 'transactions') return { data: mockTransactions, isLoading: false };
            if (key[0] === 'balance' && key[1] !== 'history') return { data: mockBalance, isLoading: false };
            if (key[0] === 'subscriptions' && key[1] === 'upcoming') return { data: mockSubs, isLoading: false };
            if (key[0] === 'proposals' && key[1] === 'pending') return { data: mockProposals, isLoading: false };
            if (key[0] === 'balance' && key[1] === 'history') return { data: mockHistory, isLoading: false };
            return { data: null, isLoading: false };
        });

        const { result } = renderHook(() => useDashboardService(mockFamilyId, mockUser, mockPeriod));

        expect(result.current.transactions).toEqual(mockTransactions);
        expect(result.current.balance).toBe(mockBalance);
        expect(result.current.upcomingSubs).toEqual(mockSubs);
        expect(result.current.pendingProposals).toEqual(mockProposals);
        expect(result.current.historyData).toEqual(mockHistory);
    });
});

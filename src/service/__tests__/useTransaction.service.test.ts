import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTransactionService } from '../useTransaction.service';
import type { TransactionFormValues } from '../../lib/schemas';

// Mock dependencies
const mockMutate = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
        isPending: false,
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn(),
    })),
    queryOptions: vi.fn((options) => options),
}));

vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
            update: vi.fn(() => ({
                eq: vi.fn(() => ({
                    select: vi.fn(() => ({
                        data: [],
                        error: null,
                    })),
                })),
            })),
            delete: vi.fn(() => ({
                eq: vi.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
        })),
    },
}));

// Import mocked useQuery to set implementation in tests
import { useQuery } from '@tanstack/react-query';

describe('useTransactionService', () => {
    const mockFamilyId = 'family-123';
    const mockUser = { id: 'user-123' } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns transactions and balance data', () => {
        const mockTransactions = [{ id: 'tx-1', amount: '100.00' }];
        const mockBalance = 500.00;

        (useQuery as any).mockImplementation((options: any) => {
            if (options.queryKey[0] === 'transactions') {
                return { data: mockTransactions, isLoading: false };
            }
            if (options.queryKey[0] === 'balance') {
                return { data: mockBalance, isLoading: false };
            }
            return { data: null, isLoading: false };
        });

        const { result } = renderHook(() => useTransactionService(mockFamilyId, mockUser));

        expect(result.current.transactions).toEqual(mockTransactions);
        expect(result.current.balance).toBe(mockBalance);
    });

    describe('Actions', () => {
        it('calls addTransactionAsync with correct data', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useTransactionService(mockFamilyId, mockUser));

            const newTx: TransactionFormValues = {
                amount: '50.00',
                type: 'expense' as const,
                category: 'Food',
                date: '2025-01-01',
                description: 'Groceries',
                is_recurring: false,
                status: 'completed'
            };

            await result.current.addTransactionAsync(newTx);

            expect(mockMutateAsync).toHaveBeenCalledWith(newTx);
        });

        it('calls deleteTransactionAsync with correct id', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useTransactionService(mockFamilyId, mockUser));

            await result.current.deleteTransactionAsync('tx-123');

            expect(mockMutateAsync).toHaveBeenCalledWith('tx-123');
        });
    });
});

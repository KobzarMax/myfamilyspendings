import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProposalService } from '../useProposal.service';
import type { ProposalFormValues } from '../../lib/schemas';

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
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    order: vi.fn(() => ({
                        data: [],
                        error: null,
                    })),
                    data: [],
                    error: null,
                    single: vi.fn(() => ({ data: null, error: null }))
                })),
                data: [],
                error: null,
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
            update: vi.fn(() => ({
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

describe('useProposalService', () => {
    const mockFamilyId = 'family-123';
    const mockUser = { id: 'user-123' } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns proposals, approvals and family members data', () => {
        const mockProposals = [{ id: 'prop-1', description: 'Test Proposal' }];
        const mockApprovals = [{ id: 'app-1', status: 'approved' }];
        const mockMembers = [{ id: 'user-123' }, { id: 'user-456' }];

        (useQuery as any).mockImplementation((options: any) => {
            if (options.queryKey[0] === 'proposals') {
                return { data: mockProposals, isLoading: false };
            }
            if (options.queryKey[0] === 'approvals') {
                return { data: mockApprovals, isLoading: false };
            }
            if (options.queryKey[0] === 'family-members') {
                return { data: mockMembers, isLoading: false };
            }
            return { data: null, isLoading: false };
        });

        const { result } = renderHook(() => useProposalService(mockFamilyId, mockUser));

        expect(result.current.proposals).toEqual(mockProposals);
        expect(result.current.approvals).toEqual(mockApprovals);
        expect(result.current.familyMembers).toEqual(mockMembers);
    });

    describe('Actions', () => {
        it('calls createProposalAsync with correct data', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useProposalService(mockFamilyId, mockUser));

            const newProposal: ProposalFormValues = {
                type: 'spending' as const,
                amount: '100.00',
                description: 'Buy new monitor',
                target_date: ''
            };

            await result.current.createProposalAsync(newProposal);

            expect(mockMutateAsync).toHaveBeenCalledWith(newProposal);
        });

        it('calls voteProposalAsync with correct data', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useProposalService(mockFamilyId, mockUser));

            await result.current.voteProposalAsync({ proposalId: 'prop-1', voteStatus: 'approved' });

            expect(mockMutateAsync).toHaveBeenCalledWith({ proposalId: 'prop-1', voteStatus: 'approved' });
        });
    });
});

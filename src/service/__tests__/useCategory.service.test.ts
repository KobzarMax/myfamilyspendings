import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCategoryService } from '../useCategory.service';

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

describe('useCategoryService', () => {
    const mockFamilyId = 'family-123';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Derived State', () => {
        it('correctly filters income and expense categories', () => {
            const mockCategories = [
                { id: '1', name: 'Salary', type: 'income' },
                { id: '2', name: 'Rent', type: 'expense' },
                { id: '3', name: 'Refund', type: 'both' },
            ];

            (useQuery as any).mockReturnValue({
                data: mockCategories,
                isLoading: false,
            });

            const { result } = renderHook(() => useCategoryService(mockFamilyId));

            expect(result.current.incomeCategories).toHaveLength(2);
            expect(result.current.incomeCategories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Salary' }),
                    expect.objectContaining({ name: 'Refund' }),
                ])
            );

            expect(result.current.expenseCategories).toHaveLength(2);
            expect(result.current.expenseCategories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Rent' }),
                    expect.objectContaining({ name: 'Refund' }),
                ])
            );
        });

        it('handles null categories data gracefully', () => {
            (useQuery as any).mockReturnValue({
                data: null,
                isLoading: false,
            });

            const { result } = renderHook(() => useCategoryService(mockFamilyId));

            expect(result.current.categories).toBeNull();
            expect(result.current.incomeCategories).toEqual([]);
            expect(result.current.expenseCategories).toEqual([]);
        });
    });

    describe('saveCategory', () => {
        it('calls updateCategory when id is present', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useCategoryService(mockFamilyId));

            const updateData = {
                id: 'cat-123',
                name: 'Updated Name',
                type: 'income' as const,
                icon: '💰',
                color: '#000000'
            };

            await result.current.saveCategory(updateData);

            expect(mockMutateAsync).toHaveBeenCalledWith({
                id: 'cat-123',
                updates: updateData,
            });
        });

        it('calls createCategory when id is missing', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useCategoryService(mockFamilyId));

            const createData = {
                name: 'New Category',
                type: 'expense' as const,
                icon: '🛒',
                color: '#ff0000'
            };

            await result.current.saveCategory(createData);

            expect(mockMutateAsync).toHaveBeenCalledWith({
                family_id: mockFamilyId,
                ...createData,
            });
        });

        it('throws error when saving new category without familyId', async () => {
            (useQuery as any).mockReturnValue({ data: [], isLoading: false });
            const { result } = renderHook(() => useCategoryService(null));

            const createData = {
                name: 'New Category',
                type: 'expense' as const,
                icon: '🛒',
                color: '#ff0000'
            };

            await expect(result.current.saveCategory(createData)).rejects.toThrow('No family ID');
        });
    });
});

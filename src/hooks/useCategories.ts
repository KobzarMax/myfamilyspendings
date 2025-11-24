import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../lib/api';
import { categoriesQueryOptions } from '../lib/queries';

/**
 * Hook to get categories for a family
 */
export function useCategories(familyId: string | null) {
  return useQuery(categoriesQueryOptions(familyId || undefined));
}

/**
 * Hook to create a category
 */
export function useCreateCategory(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', familyId] });
    },
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof categoryApi.updateCategory>[1] }) =>
      categoryApi.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', familyId] });
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', familyId] });
    },
  });
}

/**
 * Hook to seed default categories
 */
export function useSeedDefaultCategories(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => familyId ? categoryApi.seedDefaultCategories(familyId) : Promise.reject('No family ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', familyId] });
    },
  });
}

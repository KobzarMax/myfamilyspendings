import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { categoriesQueryOptions } from '../lib/queries';
import type { CategoryFormValues } from '../components/categories/CategoryForm';

export function useCategoryService(familyId: string | null) {
    const queryClient = useQueryClient();

    // Queries
    const { data: categories, isLoading } = useQuery(categoriesQueryOptions(familyId || undefined));

    // Mutations
    const createCategoryMutation = useMutation({
        mutationFn: async (newCategory: CategoryFormValues & { family_id: string }) => {
            const { data, error } = await supabase.from('categories').insert([newCategory]).select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories', familyId] }),
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: CategoryFormValues }) => {
            const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories', familyId] }),
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories', familyId] }),
    });

    const seedDefaultCategoriesMutation = useMutation({
        mutationFn: async () => {
            if (!familyId) throw new Error('No family ID');

            const defaults = [
                { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
                { name: 'Freelance', type: 'income', icon: '💻', color: '#3b82f6' },
                { name: 'Groceries', type: 'expense', icon: '🛒', color: '#f59e0b' },
                { name: 'Rent', type: 'expense', icon: '🏠', color: '#ef4444' },
                { name: 'Utilities', type: 'expense', icon: '💡', color: '#6366f1' },
                { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8b5cf6' },
                { name: 'Transport', type: 'expense', icon: '🚗', color: '#ec4899' },
                { name: 'Health', type: 'expense', icon: '⚕️', color: '#ef4444' },
            ];

            const { error } = await supabase.from('categories').insert(
                defaults.map(cat => ({
                    ...cat,
                    family_id: familyId,
                    is_default: true,
                }))
            );

            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories', familyId] }),
    });

    // Helper to save category (create or update)
    const saveCategory = async (values: CategoryFormValues & { id?: string }) => {
        if (values.id) {
            return updateCategoryMutation.mutateAsync({
                id: values.id,
                updates: values,
            });
        }

        if (!familyId) throw new Error('No family ID');

        return createCategoryMutation.mutateAsync({
            family_id: familyId,
            ...values,
        });
    };

    return {
        // Data
        categories,
        incomeCategories: categories?.filter(c => c.type === 'income' || c.type === 'both') || [],
        expenseCategories: categories?.filter(c => c.type === 'expense' || c.type === 'both') || [],
        isLoading,

        // Actions
        createCategory: createCategoryMutation.mutate,
        createCategoryAsync: createCategoryMutation.mutateAsync,
        updateCategory: updateCategoryMutation.mutate,
        updateCategoryAsync: updateCategoryMutation.mutateAsync,
        deleteCategory: deleteCategoryMutation.mutate,
        deleteCategoryAsync: deleteCategoryMutation.mutateAsync,
        seedDefaultCategories: seedDefaultCategoriesMutation.mutate,
        seedDefaultCategoriesAsync: seedDefaultCategoriesMutation.mutateAsync,
        saveCategory,

        // States
        isSubmitting: createCategoryMutation.isPending || updateCategoryMutation.isPending,
        isDeleting: deleteCategoryMutation.isPending,
        isSeeding: seedDefaultCategoriesMutation.isPending,
    };
}

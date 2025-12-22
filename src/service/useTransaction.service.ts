import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { transactionsQueryOptions, balanceQueryOptions } from '../lib/queries';
import type { TransactionFormValues } from '../components/transactions/TransactionForm';
import type { User } from '@supabase/supabase-js';

export function useTransactionService(familyId: string | null, user: User | null | undefined) {
    const queryClient = useQueryClient();

    // Queries
    const { data: transactions, isLoading: transactionsLoading } = useQuery(transactionsQueryOptions(familyId || undefined));
    const { data: balance, isLoading: balanceLoading } = useQuery(balanceQueryOptions(familyId || undefined));

    // Mutations
    const addTransactionMutation = useMutation({
        mutationFn: async (newTransaction: TransactionFormValues) => {
            if (!familyId || !user) throw new Error('Missing family or user');

            const { data, error } = await supabase
                .from('transactions')
                .insert([{
                    ...newTransaction,
                    family_id: familyId,
                    user_id: user.id,
                }])
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions', familyId] });
            queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
        },
    });

    const updateTransactionMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: TransactionFormValues }) => {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions', familyId] });
            queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
        },
    });

    const deleteTransactionMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions', familyId] });
            queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
        },
    });

    return {
        // Data
        transactions,
        transactionsLoading,
        balance,
        balanceLoading,

        // Actions
        addTransaction: addTransactionMutation.mutate,
        addTransactionAsync: addTransactionMutation.mutateAsync,
        updateTransaction: updateTransactionMutation.mutate,
        updateTransactionAsync: updateTransactionMutation.mutateAsync,
        deleteTransaction: deleteTransactionMutation.mutate,
        deleteTransactionAsync: deleteTransactionMutation.mutateAsync,

        // Loading States
        isSubmitting: addTransactionMutation.isPending || updateTransactionMutation.isPending,
        isDeleting: deleteTransactionMutation.isPending,
    };
}

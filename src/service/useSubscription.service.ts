import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { subscriptionsQueryOptions, bankAccountsQueryOptions } from '../lib/queries';
import { type SubscriptionFormValues, type BankAccountFormValues } from '../lib/schemas';
import type { User } from '@supabase/supabase-js';

export function useSubscriptionService(familyId: string | null, user: User | null | undefined) {
    const queryClient = useQueryClient();

    // Queries
    const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery(subscriptionsQueryOptions(familyId || undefined));
    const { data: bankAccounts, isLoading: bankAccountsLoading } = useQuery(bankAccountsQueryOptions(familyId || undefined));

    // Subscription Mutations
    const addSubscriptionMutation = useMutation({
        mutationFn: async (newSubscription: SubscriptionFormValues) => {
            if (!familyId || !user) throw new Error('Missing family or user');
            const { data, error } = await supabase
                .from('subscriptions')
                .insert([{ ...newSubscription, family_id: familyId, created_by: user.id }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions', familyId] }),
    });

    const updateSubscriptionMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: SubscriptionFormValues }) => {
            const { data, error } = await supabase
                .from('subscriptions')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions', familyId] }),
    });

    const deleteSubscriptionMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('subscriptions').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions', familyId] }),
    });

    // Bank Account Mutations
    const addBankAccountMutation = useMutation({
        mutationFn: async (newAccount: BankAccountFormValues) => {
            if (!familyId || !user) throw new Error('Missing family or user');
            const { data, error } = await supabase
                .from('bank_accounts')
                .insert([{ ...newAccount, family_id: familyId, created_by: user.id }])
                .select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bankAccounts', familyId] }),
    });

    const deleteBankAccountMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('bank_accounts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bankAccounts', familyId] }),
    });

    return {
        // Data
        subscriptions,
        subscriptionsLoading,
        bankAccounts,
        bankAccountsLoading,

        // Actions
        addSubscription: addSubscriptionMutation.mutate,
        addSubscriptionAsync: addSubscriptionMutation.mutateAsync,
        updateSubscription: updateSubscriptionMutation.mutate,
        updateSubscriptionAsync: updateSubscriptionMutation.mutateAsync,
        deleteSubscription: deleteSubscriptionMutation.mutate,
        deleteSubscriptionAsync: deleteSubscriptionMutation.mutateAsync,

        addBankAccount: addBankAccountMutation.mutate,
        addBankAccountAsync: addBankAccountMutation.mutateAsync,
        deleteBankAccount: deleteBankAccountMutation.mutate,
        deleteBankAccountAsync: deleteBankAccountMutation.mutateAsync,

        // Loading States
        isSubmittingSubscription: addSubscriptionMutation.isPending || updateSubscriptionMutation.isPending,
        isDeletingSubscription: deleteSubscriptionMutation.isPending,
        isSubmittingBankAccount: addBankAccountMutation.isPending,
        isDeletingBankAccount: deleteBankAccountMutation.isPending,
    };
}

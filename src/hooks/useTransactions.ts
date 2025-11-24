import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../lib/api';
import { transactionsQueryOptions, balanceQueryOptions } from '../lib/queries';

/**
 * Hook to get transactions for a family
 */
export function useTransactions(familyId: string | null, limit?: number) {
  return useQuery(transactionsQueryOptions(familyId || undefined, limit));
}

/**
 * Hook to get balance for a family
 */
export function useBalance(familyId: string | null) {
  return useQuery(balanceQueryOptions(familyId || undefined));
}

/**
 * Hook to create a transaction
 */
export function useCreateTransaction(familyId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', familyId] });
      queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
    },
  });
}

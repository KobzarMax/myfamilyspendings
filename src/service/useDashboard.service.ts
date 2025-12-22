import { useQuery } from '@tanstack/react-query';
import {
    transactionsQueryOptions,
    balanceQueryOptions,
    upcomingSubscriptionsQueryOptions,
    pendingProposalsQueryOptions,
    balanceHistoryQueryOptions
} from '../lib/queries';
import type { User } from '@supabase/supabase-js';

export function useDashboardService(familyId: string | null, user: User | null | undefined, chartPeriod: string) {
    // We can reuse the transaction service for balance/transactions if we want, 
    // or just call useQuery directly. 
    // Since dashboard needs specific limits on transactions, direct useQuery might be better or extending the service.
    // Let's use direct queries as they are specific to dashboard (limit 5, etc).

    // Note: useTransactionService has no limit param.

    const { data: transactions, isLoading: isLoadingTx } = useQuery(transactionsQueryOptions(familyId || undefined, 5));
    const { data: balance, isLoading: isLoadingBalance } = useQuery(balanceQueryOptions(familyId || undefined));

    const { data: upcomingSubs, isLoading: isLoadingSubs } = useQuery(
        upcomingSubscriptionsQueryOptions(familyId || undefined)
    );

    const { data: pendingProposals, isLoading: isLoadingProposals } = useQuery(
        pendingProposalsQueryOptions(familyId || undefined, user?.id)
    );

    const { data: historyData, isLoading: isLoadingHistory } = useQuery(
        balanceHistoryQueryOptions(familyId || undefined, chartPeriod)
    );

    return {
        transactions,
        isLoadingTx,
        balance,
        isLoadingBalance,
        upcomingSubs,
        isLoadingSubs,
        pendingProposals,
        isLoadingProposals,
        historyData,
        isLoadingHistory
    };
}

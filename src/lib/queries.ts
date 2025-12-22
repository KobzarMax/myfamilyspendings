import { queryOptions } from '@tanstack/react-query';
import { profileApi, transactionApi, categoryApi, bankAccountApi, subscriptionApi } from './api';

export const profileQueryOptions = (userId: string | undefined) => queryOptions({
  queryKey: ['profile', userId],
  queryFn: () => userId ? profileApi.getProfile(userId) : Promise.reject('No user ID'),
  enabled: !!userId,
});

export const transactionsQueryOptions = (familyId: string | undefined, limit?: number) => queryOptions({
  queryKey: ['transactions', familyId, limit],
  queryFn: () => familyId ? transactionApi.getTransactions(familyId, limit) : Promise.resolve([]),
  enabled: !!familyId,
});

export const balanceQueryOptions = (familyId: string | undefined) => queryOptions({
  queryKey: ['balance', familyId],
  queryFn: () => familyId ? transactionApi.getBalance(familyId) : Promise.resolve(0),
  enabled: !!familyId,
});

export const categoriesQueryOptions = (familyId: string | undefined) => queryOptions({
  queryKey: ['categories', familyId],
  queryFn: () => familyId ? categoryApi.getCategories(familyId) : Promise.resolve([]),
  enabled: !!familyId,
});

export const bankAccountsQueryOptions = (familyId: string | undefined) => queryOptions({
  queryKey: ['bankAccounts', familyId],
  queryFn: () => familyId ? bankAccountApi.getBankAccounts(familyId) : Promise.resolve([]),
  enabled: !!familyId,
});

export const subscriptionsQueryOptions = (familyId: string | undefined) => queryOptions({
  queryKey: ['subscriptions', familyId],
  queryFn: () => familyId ? subscriptionApi.getSubscriptions(familyId) : Promise.resolve([]),
  enabled: !!familyId,
});

export const upcomingSubscriptionsQueryOptions = (familyId: string | undefined, days: number = 30) => queryOptions({
  queryKey: ['subscriptions', 'upcoming', familyId, days],
  queryFn: () => familyId ? subscriptionApi.getUpcomingSubscriptions(familyId, days) : Promise.resolve([]),
  enabled: !!familyId,
});

import { dashboardApi } from './api';

export const pendingProposalsQueryOptions = (familyId: string | undefined, userId: string | undefined) => queryOptions({
  queryKey: ['proposals', 'pending', familyId, userId],
  queryFn: () => (familyId && userId) ? dashboardApi.getPendingProposals(familyId, userId) : Promise.resolve([]),
  enabled: !!familyId && !!userId,
});

export const balanceHistoryQueryOptions = (familyId: string | undefined, period: string) => queryOptions({
  queryKey: ['balance', 'history', familyId, period],
  queryFn: () => {
    if (!familyId) return Promise.resolve([]);
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '2w': startDate.setDate(now.getDate() - 14); break;
      case '1m': startDate.setMonth(now.getMonth() - 1); break;
      case '3m': startDate.setMonth(now.getMonth() - 3); break;
      case '6m': startDate.setMonth(now.getMonth() - 6); break;
      case '9m': startDate.setMonth(now.getMonth() - 9); break;
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate.setMonth(now.getMonth() - 1);
    }

    return dashboardApi.getTransactionHistory(familyId, startDate);
  },
  enabled: !!familyId,
});

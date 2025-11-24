import { queryOptions } from '@tanstack/react-query';
import { profileApi, transactionApi, categoryApi } from './api';

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

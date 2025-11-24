import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTransactions, useBalance } from '../../hooks/useTransactions';
import { supabase } from '../../lib/supabase';
import { profileQueryOptions, transactionsQueryOptions, balanceQueryOptions } from '../../lib/queries';
import BalanceCard from '../../components/dashboard/BalanceCard';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import EmptyFamilyState from '../../components/dashboard/EmptyFamilyState';

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await queryClient.ensureQueryData(profileQueryOptions(user.id));

    if (profile?.family_id) {
      await Promise.all([
        queryClient.ensureQueryData(transactionsQueryOptions(profile.family_id, 5)),
        queryClient.ensureQueryData(balanceQueryOptions(profile.family_id)),
      ]);
    }
    return { userId: user.id };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { userId } = Route.useLoaderData() || {};
  const { data: profile } = useQuery(profileQueryOptions(userId));
  const familyId = profile?.family_id || null;

  const { data: transactions, isLoading } = useTransactions(familyId, 5);
  const { data: balance } = useBalance(familyId);

  if (!familyId) {
    return <EmptyFamilyState />;
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <BalanceCard balance={balance} />

      {/* Recent Activity */}
      <RecentActivityList transactions={transactions} isLoading={isLoading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickActionCard
          to="/transactions"
          icon={Plus}
          title="Add Transaction"
          description="Log income or expense"
        />
      </div>
    </div>
  );
}

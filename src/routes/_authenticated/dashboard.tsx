import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';
import { balanceQueryOptions, profileQueryOptions, transactionsQueryOptions, upcomingSubscriptionsQueryOptions } from '../../lib/queries';
import { useAuth } from '../../context/AuthContext';
import { useDashboardService } from '../../service/useDashboard.service';

import BalanceCard from '../../components/dashboard/BalanceCard';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import EmptyFamilyState from '../../components/dashboard/EmptyFamilyState';
import UpcomingSubscriptionsCard from '../../components/dashboard/UpcomingSubscriptionsCard';
import PendingProposalsCard from '../../components/dashboard/PendingProposalsCard';
import BalanceHealthChart from '../../components/dashboard/BalanceHealthChart';
import { supabase } from '../../lib/supabase';

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await queryClient.ensureQueryData(profileQueryOptions(user.id));

    if (profile?.family_id) {
      await Promise.all([
        queryClient.ensureQueryData(transactionsQueryOptions(profile.family_id, 5)),
        queryClient.ensureQueryData(balanceQueryOptions(profile.family_id)),
        queryClient.ensureQueryData(upcomingSubscriptionsQueryOptions(profile.family_id)),
        // We don't prefetch pending proposals or history as they are more user/filter specific/dynamic
      ]);
    }
    return { userId: user.id };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { userId } = Route.useLoaderData() || {};
  const { data: profile } = useQuery(profileQueryOptions(userId));
  const { user } = useAuth(); // Needed for dashboard service
  const familyId = profile?.family_id || null;
  const [chartPeriod, setChartPeriod] = useState('1m');

  const service = useDashboardService(familyId, user, chartPeriod);

  if (!familyId) {
    return <EmptyFamilyState />;
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Row: Balance & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <BalanceCard balance={service.balance} />
        </motion.div>
        <motion.div className="lg:col-span-3 grid gap-4" variants={itemVariants}>
          {/* Quick Action currently takes up space, maybe move it or keep it? 
               Let's keep it but make it fit nicely. */}
          <QuickActionCard
            to="/transactions"
            icon={Plus}
            title="Add Transaction"
            description="Log income or expense"
          />
        </motion.div>
      </div>

      {/* Second Row: Charts & Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <BalanceHealthChart
            transactions={service.historyData}
            currentPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </motion.div>
        <motion.div className="lg:col-span-3 space-y-4" variants={itemVariants}>
          {/* Pending Proposals (Conditional) */}
          {service.pendingProposals && service.pendingProposals.length > 0 && (
            <PendingProposalsCard proposals={service.pendingProposals} />
          )}

          {/* Upcoming Subscriptions */}
          <UpcomingSubscriptionsCard subscriptions={service.upcomingSubs} />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <RecentActivityList transactions={service.transactions} isLoading={service.isLoadingTx} />
      </motion.div>
    </motion.div>
  );
}

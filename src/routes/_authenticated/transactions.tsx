import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { profileQueryOptions, transactionsQueryOptions, categoriesQueryOptions } from '../../lib/queries';
import TransactionsTable from '../../components/transactions/TransactionsTable';
import AddTransactionModal from '../../components/transactions/AddTransactionModal';
import EmptyState from '../../components/shared/EmptyState';
import type { TransactionFormValues } from '../../components/transactions/TransactionForm';

export const Route = createFileRoute('/_authenticated/transactions')({
  loader: async ({ context: { queryClient } }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await queryClient.ensureQueryData(profileQueryOptions(user.id));

    if (profile?.family_id) {
      await Promise.all([
        queryClient.ensureQueryData(transactionsQueryOptions(profile.family_id)),
        queryClient.ensureQueryData(categoriesQueryOptions(profile.family_id)),
      ]);
    }
    return { userId: user.id };
  },
  component: TransactionsPage,
});

function TransactionsPage() {
  const { user } = useAuth();
  const { userId } = Route.useLoaderData() || {};
  const { data: profile } = useQuery(profileQueryOptions(userId || user?.id));
  const familyId = profile?.family_id || null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories } = useCategories(familyId);
  const { data: transactions, isLoading } = useQuery(transactionsQueryOptions(familyId || undefined));

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: TransactionFormValues) => {
      if (!familyId || !user) throw new Error('Missing family or user');

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            ...newTransaction,
            family_id: familyId,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', familyId] });
      queryClient.invalidateQueries({ queryKey: ['balance', familyId] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (values: TransactionFormValues) => {
    addTransactionMutation.mutate(values);
  };

  if (!familyId) {
    return (
      <EmptyState
        title="No Family Found"
        description="Please create or join a family first."
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transactions including income and expenses.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} isLoading={isLoading} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={addTransactionMutation.isPending}
        categories={categories}
      />
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { categoriesQueryOptions, profileQueryOptions, transactionsQueryOptions } from '../../lib/queries';
import { useTransactionService } from '../../service/useTransaction.service';
import TransactionsTable from '../../components/transactions/TransactionsTable';
import AddTransactionModal from '../../components/transactions/AddTransactionModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/shared/EmptyState';
import type { TransactionFormValues } from '../../components/transactions/TransactionForm';
import type { Transaction } from '../../types';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const { data: categories } = useCategories(familyId);
  const service = useTransactionService(familyId, user);

  const handleSubmit = (values: TransactionFormValues) => {
    const onSuccess = () => {
      setIsModalOpen(false);
      setEditingTransaction(null);
    };

    if (editingTransaction) {
      service.updateTransaction({ id: editingTransaction.id, updates: values }, { onSuccess });
    } else {
      service.addTransaction(values, { onSuccess });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      onConfirm: async () => {
        await service.deleteTransactionAsync(id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  if (!familyId) {
    return (
      <EmptyState
        title="No Family Found"
        description="Please create or join a family first."
      />
    );
  }

  // Prepare initial values for editing
  const initialValues = editingTransaction ? {
    amount: editingTransaction.amount.toString(),
    type: editingTransaction.type,
    category: editingTransaction.category,
    description: editingTransaction.description || '',
    date: editingTransaction.date.split('T')[0],
    is_recurring: editingTransaction.is_recurring || false,
    status: editingTransaction.status,
  } : undefined;



  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="sm:flex sm:items-center" variants={itemVariants}>
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
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants}>
        <TransactionsTable
          transactions={service.transactions}
          isLoading={service.transactionsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={service.isSubmitting}
        categories={categories}
        isEditing={!!editingTransaction}
        initialValues={initialValues}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant="danger"
        isLoading={service.isDeleting}
      />
    </motion.div>
  );
}

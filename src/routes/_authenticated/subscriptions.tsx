import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import { profileQueryOptions, bankAccountsQueryOptions, subscriptionsQueryOptions } from '../../lib/queries';
import { useSubscriptionService } from '../../service/useSubscription.service';
import SubscriptionsTable from '../../components/subscriptions/SubscriptionsTable';
import BankAccountsList from '../../components/subscriptions/BankAccountsList';
import AddSubscriptionModal from '../../components/subscriptions/AddSubscriptionModal';
import AddBankAccountModal from '../../components/subscriptions/AddBankAccountModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/shared/EmptyState';
import { type SubscriptionFormValues, type BankAccountFormValues } from '../../lib/schemas';
import type { Database } from '../../lib/database.types';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

type Subscription = Database['public']['Tables']['subscriptions']['Row'] & {
    bank_accounts?: { id: string; name: string } | null;
};

export const Route = createFileRoute('/_authenticated/subscriptions')({
    loader: async ({ context: { queryClient } }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const profile = await queryClient.ensureQueryData(profileQueryOptions(user.id));

        if (profile?.family_id) {
            await Promise.all([
                queryClient.ensureQueryData(subscriptionsQueryOptions(profile.family_id)),
                queryClient.ensureQueryData(bankAccountsQueryOptions(profile.family_id)),
            ]);
        }
        return { userId: user.id };
    },
    component: SubscriptionsPage,
});

function SubscriptionsPage() {
    const { user } = useAuth();
    const { userId } = Route.useLoaderData() || {};
    const { data: profile } = useQuery(profileQueryOptions(userId || user?.id));
    const familyId = profile?.family_id || null;
    const service = useSubscriptionService(familyId, user);

    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

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

    // Handlers
    const handleSubscriptionSubmit = (values: SubscriptionFormValues) => {
        const onSuccess = () => {
            setIsSubscriptionModalOpen(false);
            setEditingSubscription(null);
        };

        if (editingSubscription) {
            service.updateSubscription({ id: editingSubscription.id, updates: values }, { onSuccess });
        } else {
            service.addSubscription(values, { onSuccess });
        }
    };

    const handleEditSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsSubscriptionModalOpen(true);
    };

    const handleDeleteSubscription = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Subscription',
            message: 'Are you sure you want to delete this subscription? This action cannot be undone.',
            onConfirm: async () => {
                await service.deleteSubscriptionAsync(id);
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleBankAccountSubmit = (values: BankAccountFormValues) => {
        service.addBankAccount(values, {
            onSuccess: () => setIsBankAccountModalOpen(false)
        });
    };

    const handleDeleteBankAccount = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Bank Account',
            message: 'Are you sure you want to delete this bank account? Subscriptions linked to this account will have their bank account reference removed.',
            onConfirm: async () => {
                await service.deleteBankAccountAsync(id);
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleCloseSubscriptionModal = () => {
        setIsSubscriptionModalOpen(false);
        setEditingSubscription(null);
    };

    const handleCloseBankAccountModal = () => {
        setIsBankAccountModalOpen(false);
    };

    if (!familyId) {
        return (
            <EmptyState
                title="No Family Found"
                description="Please create or join a family first."
            />
        );
    }

    // Prepare initial values for editing subscription
    const subscriptionInitialValues = editingSubscription ? {
        name: editingSubscription.name,
        amount: editingSubscription.amount.toString(),
        frequency: editingSubscription.frequency,
        next_payment_date: typeof editingSubscription.next_payment_date === 'string'
            ? editingSubscription.next_payment_date.split('T')[0]
            : editingSubscription.next_payment_date,
        bank_account_id: editingSubscription.bank_account_id,
        category: editingSubscription.category,
        description: editingSubscription.description,
        is_active: editingSubscription.is_active,
    } : undefined;

    return (
        <motion.div
            className="px-4 sm:px-6 lg:px-8 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Header */}
            <motion.div className="sm:flex sm:items-center" variants={itemVariants}>
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Subscriptions</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage your recurring subscriptions and payment methods.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setIsSubscriptionModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add Subscription
                    </button>
                </div>
            </motion.div>

            {/* Bank Accounts Section */}
            <motion.div className="mt-8" variants={itemVariants}>
                <BankAccountsList
                    bankAccounts={service.bankAccounts}
                    isLoading={service.bankAccountsLoading}
                    onAdd={() => setIsBankAccountModalOpen(true)}
                    onDelete={handleDeleteBankAccount}
                />
            </motion.div>

            {/* Subscriptions Table */}
            <motion.div variants={itemVariants}>
                <SubscriptionsTable
                    subscriptions={service.subscriptions}
                    isLoading={service.subscriptionsLoading}
                    onEdit={handleEditSubscription}
                    onDelete={handleDeleteSubscription}
                />
            </motion.div>

            {/* Add/Edit Subscription Modal */}
            <AddSubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={handleCloseSubscriptionModal}
                onSubmit={handleSubscriptionSubmit}
                isSubmitting={service.isSubmittingSubscription}
                isEditing={!!editingSubscription}
                initialValues={subscriptionInitialValues}
                bankAccounts={service.bankAccounts}
            />

            {/* Add Bank Account Modal */}
            <AddBankAccountModal
                isOpen={isBankAccountModalOpen}
                onClose={handleCloseBankAccountModal}
                onSubmit={handleBankAccountSubmit}
                isSubmitting={service.isSubmittingBankAccount}
                isEditing={false}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant="danger"
                isLoading={service.isDeletingSubscription || service.isDeletingBankAccount}
            />
        </motion.div>
    );
}

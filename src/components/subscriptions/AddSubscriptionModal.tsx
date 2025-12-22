import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import SubscriptionForm, { type SubscriptionFormValues } from './SubscriptionForm';
import type { Database } from '../../lib/database.types';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: SubscriptionFormValues) => void;
    isSubmitting: boolean;
    isEditing: boolean;
    initialValues?: SubscriptionFormValues;
    bankAccounts?: BankAccount[];
}

export default function AddSubscriptionModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    isEditing,
    initialValues,
    bankAccounts,
}: AddSubscriptionModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="sr-only">Close</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div>
                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                {isEditing ? 'Edit Subscription' : 'Add Subscription'}
                            </DialogTitle>
                            <SubscriptionForm
                                onSubmit={onSubmit}
                                isSubmitting={isSubmitting}
                                isEditing={isEditing}
                                initialValues={initialValues}
                                bankAccounts={bankAccounts}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

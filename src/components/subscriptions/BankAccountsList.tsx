import { Plus, Trash2 } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

interface BankAccountsListProps {
    bankAccounts?: BankAccount[];
    isLoading: boolean;
    onAdd: () => void;
    onDelete: (id: string) => void;
}

export default function BankAccountsList({
    bankAccounts,
    isLoading,
    onAdd,
    onDelete,
}: BankAccountsListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-pulse text-gray-600">Loading bank accounts...</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Bank Accounts</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Manage your bank accounts for subscription payments.</p>
                        </div>
                    </div>
                    <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                        <button
                            type="button"
                            onClick={onAdd}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <Plus className="h-4 w-4" />
                            Add Account
                        </button>
                    </div>
                </div>

                {!bankAccounts || bankAccounts.length === 0 ? (
                    <div className="mt-6 text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No bank accounts yet. Add one to get started!</p>
                    </div>
                ) : (
                    <ul role="list" className="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {bankAccounts.map((account) => (
                            <li key={account.id} className="flex items-center justify-between py-4">
                                <div className="flex items-center">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                                        <span className="text-sm font-medium text-indigo-600">
                                            {account.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{account.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Added {new Date(account.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(account.id)}
                                    className="ml-4 flex-shrink-0 text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete {account.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

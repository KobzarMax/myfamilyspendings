import { Pencil, Trash2 } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'] & {
    bank_accounts?: { id: string; name: string } | null;
};

interface SubscriptionsTableProps {
    subscriptions?: Subscription[];
    isLoading: boolean;
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
}

export default function SubscriptionsTable({
    subscriptions,
    isLoading,
    onEdit,
    onDelete,
}: SubscriptionsTableProps) {
    if (isLoading) {
        return (
            <div className="mt-8 flex justify-center">
                <div className="animate-pulse text-gray-600">Loading subscriptions...</div>
            </div>
        );
    }

    if (!subscriptions || subscriptions.length === 0) {
        return (
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">No subscriptions yet. Add your first subscription to get started!</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatFrequency = (frequency: string) => {
        return frequency.charAt(0).toUpperCase() + frequency.slice(1);
    };

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Frequency
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Next Payment
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Bank Account
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {subscriptions.map((subscription) => (
                                <tr key={subscription.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        <div>
                                            <div>{subscription.name}</div>
                                            {subscription.category && (
                                                <div className="text-xs text-gray-500">{subscription.category}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                        ${Number(subscription.amount).toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatFrequency(subscription.frequency)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatDate(subscription.next_payment_date)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {subscription.bank_accounts?.name || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${subscription.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {subscription.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <button
                                            onClick={() => onEdit(subscription)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit {subscription.name}</span>
                                        </button>
                                        <button
                                            onClick={() => onDelete(subscription.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete {subscription.name}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

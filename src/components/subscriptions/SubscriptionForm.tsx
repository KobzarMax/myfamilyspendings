import { useForm, revalidateLogic } from '@tanstack/react-form';
import Input from '../Input';
import type { Database } from '../../lib/database.types';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

import { subscriptionSchema, type SubscriptionFormValues } from '../../lib/schemas';

interface SubscriptionFormProps {
    onSubmit: (values: SubscriptionFormValues) => void;
    isSubmitting: boolean;
    isEditing: boolean;
    initialValues?: SubscriptionFormValues;
    bankAccounts?: BankAccount[];
}

export default function SubscriptionForm({
    onSubmit,
    isSubmitting,
    isEditing,
    initialValues,
    bankAccounts = [],
}: SubscriptionFormProps) {
    const form = useForm({
        defaultValues: initialValues || {
            name: '',
            amount: '',
            frequency: 'monthly' as const,
            next_payment_date: '',
            bank_account_id: null,
            category: null,
            description: null,
            is_active: true,
        } as SubscriptionFormValues,
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: subscriptionSchema,
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="mt-6 space-y-4"
        >
            <form.Field name="name">
                {(field) => (
                    <div>
                        <Input
                            id="name"
                            label="Subscription Name"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="e.g., Netflix, Spotify"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="amount">
                {(field) => (
                    <div>
                        <Input
                            id="amount"
                            label="Amount"
                            type="number"
                            step="0.01"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="0.00"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="frequency">
                {(field) => (
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                            Frequency
                        </label>
                        <select
                            id="frequency"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="next_payment_date">
                {(field) => (
                    <div>
                        <Input
                            id="next_payment_date"
                            label="Next Payment Date"
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="bank_account_id">
                {(field) => (
                    <div>
                        <label htmlFor="bank_account_id" className="block text-sm font-medium text-gray-700">
                            Bank Account (Optional)
                        </label>
                        <select
                            id="bank_account_id"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value || null)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="">None</option>
                            {bankAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="category">
                {(field) => (
                    <div>
                        <Input
                            id="category"
                            label="Category (Optional)"
                            type="text"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value || null)}
                            onBlur={field.handleBlur}
                            placeholder="e.g., Entertainment, Utilities"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="description">
                {(field) => (
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value || null)}
                            onBlur={field.handleBlur}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Additional notes..."
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{(field.state.meta.errors[0] as any).message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="is_active">
                {(field) => (
                    <div className="flex items-center">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            onBlur={field.handleBlur}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                            Active subscription
                        </label>
                    </div>
                )}
            </form.Field>

            {/* Submit Button */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Subscription' : 'Add Subscription'}
                </button>
            </div>
        </form>
    );
}

export type { SubscriptionFormValues };

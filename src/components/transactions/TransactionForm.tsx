import { useForm, revalidateLogic, useStore } from '@tanstack/react-form';
import { transactionSchema, type TransactionFormValues } from '../../lib/schemas';
import type { Category } from '../../types';

interface TransactionFormProps {
    onSubmit: (values: TransactionFormValues) => void;
    isSubmitting: boolean;
    categories: Category[] | undefined;
    onCancel: () => void;
}

export default function TransactionForm({
    onSubmit,
    isSubmitting,
    categories,
    onCancel,
}: TransactionFormProps) {
    const form = useForm({
        defaultValues: {
            amount: '',
            type: 'expense' as 'income' | 'expense',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            is_recurring: false,
            status: 'completed' as 'planned' | 'completed',
        },
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: transactionSchema,
        },
    });

    // Filter categories based on transaction type
    const transactionType = useStore(form.store, (state) => state.values.type);
    const filteredCategories = categories?.filter(
        (cat) => cat.type === transactionType || cat.type === 'both'
    );

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="mt-6 space-y-4"
        >
            <form.Field
                name="type"
            >
                {(field) => (
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'income' | 'expense')}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="amount"
            >
                {(field) => (
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="0.00"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="category"
            >
                {(field) => (
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select a category</option>
                            {filteredCategories?.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
                {(field) => (
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            id="description"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Optional details"
                        />
                    </div>
                )}
            </form.Field>

            <form.Field
                name="date"
            >
                {(field) => (
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            id="date"
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            {/* Recurring Field */}
            <form.Field name="is_recurring">
                {(field) => (
                    <div className="flex items-center">
                        <input
                            id="is_recurring"
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900">Recurring</label>
                    </div>
                )}
            </form.Field>

            <form.Field
                name="status"
            >
                {(field) => (
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="status"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'planned' | 'completed')}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="completed">Completed</option>
                            <option value="planned">Planned</option>
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            {/* Submit Buttons */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto disabled:opacity-50"
                >
                    {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export type { TransactionFormValues };

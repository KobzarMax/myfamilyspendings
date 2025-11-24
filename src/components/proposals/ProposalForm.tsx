import { useForm, revalidateLogic } from '@tanstack/react-form';
import { proposalSchema, type ProposalFormValues } from '../../lib/schemas';

interface ProposalFormProps {
    onSubmit: (values: ProposalFormValues) => void;
    isSubmitting: boolean;
    isEditing?: boolean;
}

export default function ProposalForm({
    onSubmit,
    isSubmitting,
    isEditing,
}: ProposalFormProps) {
    const form = useForm({
        defaultValues: {
            type: 'spending' as 'spending' | 'savings',
            amount: '',
            description: '',
            target_date: '',
        } as ProposalFormValues,
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: proposalSchema,
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
            <form.Field
                name="type"
            >
                {(field) => (
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'spending' | 'savings')}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="spending">Spending</option>
                            <option value="savings">Savings</option>
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
                name="description"
            >
                {(field) => (
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="What is this for?"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            {/* Target Date Field */}
            <form.Field name="target_date">
                {(field) => (
                    <div>
                        <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">Target Date (Optional)</label>
                        <input
                            id="target_date"
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
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
                    {isSubmitting ? 'Creating...' : isEditing ? 'Update Proposal' : 'Create Proposal'}
                </button>
            </div>
        </form>
    );
}

export type { ProposalFormValues };

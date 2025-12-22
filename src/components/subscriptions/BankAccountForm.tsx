import { useForm, revalidateLogic } from '@tanstack/react-form';
import Input from '../Input';
import { AlertCircle } from 'lucide-react';

import { bankAccountSchema, type BankAccountFormValues } from '../../lib/schemas';

interface BankAccountFormProps {
    onSubmit: (values: BankAccountFormValues) => void;
    isSubmitting: boolean;
    isEditing: boolean;
    initialValues?: BankAccountFormValues;
}

export default function BankAccountForm({
    onSubmit,
    isSubmitting,
    isEditing,
    initialValues,
}: BankAccountFormProps) {
    const form = useForm({
        defaultValues: initialValues || {
            name: '',
        } as BankAccountFormValues,
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: bankAccountSchema,
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
            {/* Warning Message */}
            <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                                Please use a friendly name only (e.g., "Main Checking", "Savings Account").
                                <strong> Do not include sensitive information</strong> like account numbers or passwords.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form.Field name="name">
                {(field) => (
                    <div>
                        <Input
                            id="name"
                            label="Account Name"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="e.g., Main Checking, Savings"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
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
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Account' : 'Add Account'}
                </button>
            </div>
        </form>
    );
}

export type { BankAccountFormValues };

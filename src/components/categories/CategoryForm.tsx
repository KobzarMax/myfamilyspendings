import { useForm, revalidateLogic } from '@tanstack/react-form';
import { categorySchema, type CategoryFormValues } from '../../lib/schemas';
import Input from '../Input';

interface CategoryFormProps {
    onSubmit: (values: CategoryFormValues) => void;
    isSubmitting: boolean;
    isEditing: boolean;
    initialValues?: CategoryFormValues;
}

export default function CategoryForm({
    onSubmit,
    isSubmitting,
    isEditing,
    initialValues,
}: CategoryFormProps) {
    const form = useForm({
        defaultValues: initialValues || {
            name: '',
            type: 'expense' as 'income' | 'expense' | 'both',
            icon: '',
            color: '#6b7280',
        } as CategoryFormValues,
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: categorySchema,
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
                name="name"
            >
                {(field) => (
                    <div>
                        <Input
                            id="name"
                            label="Name"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="e.g., Groceries, Salary"
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="type"
            >
                {(field) => (
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'income' | 'expense' | 'both')}
                            onBlur={field.handleBlur}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                            <option value="both">Both</option>
                        </select>
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="icon"
            >
                {(field) => (
                    <div>
                        <Input
                            id="icon"
                            label="Icon (emoji)"
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="🛒"
                            maxLength={2}
                        />
                        {field.state.meta.errors?.[0] && (
                            <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0].message}</p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="color"
            >
                {(field) => (
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                        <div className="mt-1 flex items-center gap-2">
                            <input
                                id="color-picker"
                                type="color"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="h-10 w-20 rounded border border-gray-300"
                            />
                            <Input
                                id="color"
                                type="text"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder="#6b7280"
                            />
                        </div>
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
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
                </button>
            </div>
        </form>
    );
}

export type { CategoryFormValues };

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm from '../TransactionForm';

// Mock category data matching the Category type
const mockCategories = [
    {
        id: '1',
        name: 'Groceries',
        type: 'expense',
        familyId: 'family-1',
        updatedAt: new Date(),
        createdAt: new Date(),
        icon: '🛒',
        color: '#000000',
        isDefault: false
    },
    {
        id: '2',
        name: 'Salary',
        type: 'income',
        familyId: 'family-1',
        updatedAt: new Date(),
        createdAt: new Date(),
        icon: '💰',
        color: '#000000',
        isDefault: false
    },
];

// Mock the categories hook
vi.mock('../../../hooks/useCategories', () => ({
    useCategories: () => ({
        categories: mockCategories,
        loading: false,
    }),
}));

describe('TransactionForm', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    const defaultProps = {
        onSubmit: mockOnSubmit,
        isSubmitting: false,
        categories: mockCategories as any,
        onCancel: mockOnCancel,
    };

    beforeEach(() => {
        mockOnSubmit.mockClear();
        mockOnCancel.mockClear();
    });

    it('renders correctly', () => {
        render(<TransactionForm {...defaultProps} />);

        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<TransactionForm {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: /add transaction/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
            expect(screen.getByText(/category is required/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<TransactionForm {...defaultProps} />);

        // Fill in all required fields
        await user.type(screen.getByLabelText(/amount/i), '100');
        await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
        await user.selectOptions(screen.getByLabelText(/category/i), 'Groceries');
        await user.type(screen.getByLabelText(/description/i), 'Weekly groceries');

        // Date already has a default value, so we don't need to set it

        const submitButton = screen.getByRole('button', { name: /add transaction/i });
        await user.click(submitButton);

        // Wait for the form to submit
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        }, { timeout: 3000 });

        // Verify the submitted data
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            amount: '100',
            type: 'expense',
            category: 'Groceries',
            description: 'Weekly groceries',
            is_recurring: false,
            status: 'completed',
        }));
    });

    it('filters categories based on type', async () => {
        const user = userEvent.setup();
        render(<TransactionForm {...defaultProps} />);

        // Default type is expense, should show Groceries (with icon)
        expect(screen.getByRole('option', { name: /Groceries/i })).toBeInTheDocument();

        // Change to income
        await user.selectOptions(screen.getByLabelText(/type/i), 'income');

        // Should show Salary (with icon)
        await waitFor(() => {
            expect(screen.getByRole('option', { name: /Salary/i })).toBeInTheDocument();
        });
    });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryForm from '../CategoryForm';

describe('CategoryForm', () => {
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        onSubmit: mockOnSubmit,
        isSubmitting: false,
        isEditing: false,
    };

    it('renders correctly', () => {
        render(<CategoryForm {...defaultProps} />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/icon/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<CategoryForm {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: /add category/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<CategoryForm {...defaultProps} />);

        await user.type(screen.getByLabelText(/name/i), 'Groceries');
        await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
        await user.type(screen.getByLabelText(/icon/i), '🛒');

        const submitButton = screen.getByRole('button', { name: /add category/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Groceries',
                type: 'expense',
                icon: '🛒',
            }));
        });
    });

    it('shows editing state correctly', () => {
        render(<CategoryForm {...defaultProps} isEditing={true} />);
        expect(screen.getByRole('button', { name: /update category/i })).toBeInTheDocument();
    });

    it('initializes with default values', () => {
        const initialValues = {
            name: 'Salary',
            type: 'income' as const,
            icon: '💰',
            color: '#00ff00',
        };

        render(<CategoryForm {...defaultProps} initialValues={initialValues} isEditing={true} />);

        expect(screen.getByLabelText(/name/i)).toHaveValue('Salary');
        expect(screen.getByLabelText(/type/i)).toHaveValue('income');
        expect(screen.getByLabelText(/icon/i)).toHaveValue('💰');
    });
});

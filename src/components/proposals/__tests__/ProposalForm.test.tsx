import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProposalForm from '../ProposalForm';

describe('ProposalForm', () => {
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        onSubmit: mockOnSubmit,
        isSubmitting: false,
        isEditing: false,
    };

    it('renders correctly', () => {
        render(<ProposalForm {...defaultProps} />);

        expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/target date/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create proposal/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<ProposalForm {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: /create proposal/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
            expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<ProposalForm {...defaultProps} />);

        await user.selectOptions(screen.getByLabelText(/type/i), 'spending');
        await user.type(screen.getByLabelText(/amount/i), '500');
        await user.type(screen.getByLabelText(/description/i), 'New laptop for work');
        await user.type(screen.getByLabelText(/target date/i), '2023-12-25');

        const submitButton = screen.getByRole('button', { name: /create proposal/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                type: 'spending',
                amount: '500',
                description: 'New laptop for work',
                target_date: '2023-12-25',
            }));
        });
    });

    it('shows editing state correctly', () => {
        render(<ProposalForm {...defaultProps} isEditing={true} />);
        expect(screen.getByRole('button', { name: /update proposal/i })).toBeInTheDocument();
    });
});

import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Amount must be greater than 0'
    ),
  type: z.enum(['income', 'expense'], {
    error: () => ({ message: 'Type must be income or expense' }),
  }),
  category: z.string().min(1, 'Category is required'),
  description: z.string(),
  date: z.string().min(1, 'Date is required'),
  is_recurring: z.boolean(),
  status: z.enum(['planned', 'completed'], {
    error: () => ({ message: 'Status must be planned or completed' }),
  }),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

// Category validation schema
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  type: z.enum(['income', 'expense', 'both'], {
    error: () => ({ message: 'Type must be income, expense, or both' }),
  }),
  icon: z.string()
    .max(2, 'Icon must be 1-2 characters'),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #6b7280)'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// Proposal validation schema
export const proposalSchema = z.object({
  type: z.enum(['spending', 'savings'], {
    error: () => ({ message: 'Type must be spending or savings' }),
  }),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Amount must be greater than 0'
    ),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  target_date: z.string(),
});

export type ProposalFormValues = z.infer<typeof proposalSchema>;

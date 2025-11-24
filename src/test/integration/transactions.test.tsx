import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../utils';
import { Route as TransactionsRoute } from '../../routes/_authenticated/transactions';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    session: { user: { id: 'user-123' } },
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Mock API queries
vi.mock('../../lib/queries', async () => {
  const actual = await vi.importActual('../../lib/queries');
  return {
    ...actual,
    profileQueryOptions: (userId: string) => ({
      queryKey: ['profile', userId],
      queryFn: () => Promise.resolve({ family_id: 'family-123' }),
    }),
    transactionsQueryOptions: (familyId: string) => ({
      queryKey: ['transactions', familyId],
      queryFn: () => Promise.resolve([
        { id: '1', description: 'Groceries', amount: 50, type: 'expense', date: '2023-01-01' }
      ]),
    }),
    categoriesQueryOptions: (familyId: string) => ({
      queryKey: ['categories', familyId],
      queryFn: () => Promise.resolve([
        { id: 'cat-1', name: 'Food', type: 'expense' }
      ]),
    }),
  };
});

describe('Transactions Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: 'user-123' } } });
  });

  it('renders transactions list', async () => {
    // We need to mock the loader data or ensure the loader runs
    // Since we are testing the component, we can rely on the mocked queries
    // But Route.useLoaderData might return undefined if not running in real router with loader
    // renderWithRouter creates a router but doesn't necessarily run the loader logic of the specific route file unless we register it.
    
    // For integration test of the Page component, we can mock Route.useLoaderData
    vi.spyOn(TransactionsRoute, 'useLoaderData').mockReturnValue({ userId: 'user-123' });

    const Component = TransactionsRoute.options.component as React.ComponentType;
    renderWithRouter(<Component />);

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('$50.00')).toBeInTheDocument();
    });
  });

  it('opens add transaction modal', async () => {
    vi.spyOn(TransactionsRoute, 'useLoaderData').mockReturnValue({ userId: 'user-123' });
    const Component = TransactionsRoute.options.component as React.ComponentType;
    renderWithRouter(<Component />);

    await waitFor(() => expect(screen.getByText('Add Transaction')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Add Transaction'));

    await waitFor(() => {
      expect(screen.getByText('Add Transaction', { selector: 'h3' })).toBeInTheDocument();
    });
  });
});

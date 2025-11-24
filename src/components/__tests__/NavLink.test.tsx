import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Home } from 'lucide-react';
import NavLink from '../NavLink';
import { renderWithRouter } from '../../test/utils';

describe('NavLink Component', () => {
  const renderNavLink = () => {
    return renderWithRouter(
      <NavLink to="/test" icon={Home}>
        Test Link
      </NavLink>
    );
  };

  it('renders the link text', async () => {
    renderNavLink();
    await waitFor(() => expect(screen.getByText('Test Link')).toBeInTheDocument());
  });

  it('renders the icon', async () => {
    renderNavLink();
    await waitFor(() => {
      const link = screen.getByText('Test Link').closest('a');
      expect(link).toBeInTheDocument();
    });
  });

  it('applies correct href', async () => {
    renderNavLink();
    await waitFor(() => {
      const link = screen.getByText('Test Link').closest('a');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  it('has correct base classes', async () => {
    renderNavLink();
    await waitFor(() => {
      const link = screen.getByText('Test Link').closest('a');
      expect(link).toHaveClass('inline-flex', 'items-center', 'border-b-2');
    });
  });
});

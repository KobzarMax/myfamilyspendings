import { Link, useRouterState } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function NavLink({ to, icon: Icon, children }: NavLinkProps) {
  const router = useRouterState();
  const isActive = router.location.pathname === to ||
                   (to !== '/' && router.location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={clsx(
        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium gap-2',
        isActive
          ? 'border-indigo-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

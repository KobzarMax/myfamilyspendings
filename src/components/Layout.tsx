import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, Users, PiggyBank, Tags } from 'lucide-react';
import NavLink from './NavLink';

export default function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-indigo-600">FamilyBudget</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" icon={Home}>
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" icon={PlusCircle}>
                  Transactions
                </NavLink>
                <NavLink to="/proposals" icon={Users}>
                  Proposals
                </NavLink>
                <NavLink to="/categories" icon={Tags}>
                  Categories
                </NavLink>
                <NavLink to="/savings" icon={PiggyBank}>
                  Savings
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

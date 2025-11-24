import { useState } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, Users, PiggyBank, Tags, Menu } from 'lucide-react';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';
import MobileNav from './MobileNav';

export default function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center px-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="flex flex-shrink-0 items-center ml-2 lg:ml-0">
                <span className="text-xl font-bold text-indigo-600">FamilyBudget</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
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
              </div>
            </div>

            {/* Desktop Sign Out Button */}
            <div className="hidden lg:flex items-center">
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

      {/* Main Content */}
      <div className="py-6 pb-20 lg:pb-10">
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

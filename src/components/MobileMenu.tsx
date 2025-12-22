import { X, Home, PlusCircle, Users, Tags, RefreshCw, LogOut, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onSignOut: () => void;
}

export default function MobileMenu({ isOpen, onClose, onSignOut }: MobileMenuProps) {
    const { user } = useAuth();

    const menuItems = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/transactions', icon: PlusCircle, label: 'Transactions' },
        { to: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
        { to: '/proposals', icon: Users, label: 'Proposals' },
        { to: '/categories', icon: Tags, label: 'Categories' },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Slide-in Menu */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-xl font-bold text-indigo-600">FamilyBudget</span>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        onClick={onClose}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        activeProps={{
                                            className: 'bg-indigo-50 text-indigo-600 font-medium',
                                        }}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Sign Out Button */}
                    <div className="p-4 border-t">
                        <button
                            onClick={() => {
                                onSignOut();
                                onClose();
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

import { Home, PlusCircle, Users, Tags, PiggyBank } from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';

export default function MobileNav() {
    const router = useRouterState();
    const currentPath = router.location.pathname;

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Home' },
        { to: '/transactions', icon: PlusCircle, label: 'Transactions' },
        { to: '/proposals', icon: Users, label: 'Proposals' },
        { to: '/categories', icon: Tags, label: 'Categories' },
        { to: '/savings', icon: PiggyBank, label: 'Savings' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = currentPath.startsWith(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${isActive
                                    ? 'text-indigo-600'
                                    : 'text-gray-600 hover:text-indigo-600'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? 'stroke-2' : ''}`} />
                            <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

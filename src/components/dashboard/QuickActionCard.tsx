import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
    to: string;
    icon: LucideIcon;
    title: string;
    description: string;
    iconBgColor?: string;
    iconColor?: string;
}

export default function QuickActionCard({
    to,
    icon: Icon,
    title,
    description,
    iconBgColor = 'bg-indigo-500',
    iconColor = 'text-white',
}: QuickActionCardProps) {
    return (
        <Link
            to={to}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
            <div className="flex-shrink-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor} ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="truncate text-sm text-gray-500">{description}</p>
            </div>
        </Link>
    );
}

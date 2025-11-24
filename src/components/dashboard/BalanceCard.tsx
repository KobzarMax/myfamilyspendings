import { Wallet } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface BalanceCardProps {
    balance: number | undefined;
    isLoading?: boolean;
}

export default function BalanceCard({ balance, isLoading }: BalanceCardProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Wallet className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">Current Balance</dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">
                                    {isLoading ? (
                                        <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
                                    ) : balance !== undefined ? (
                                        `$${balance.toFixed(2)}`
                                    ) : (
                                        <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />
                                    )}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                    <Link to="/transactions" className="font-medium text-indigo-700 hover:text-indigo-900">
                        View all transactions
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { Wallet } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface BalanceCardProps {
    balance: number | undefined;
    isLoading?: boolean;
}

export default function BalanceCard({ balance, isLoading }: BalanceCardProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-primary to-violet-700 p-6 text-primary-foreground shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80">Total Balance</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isLoading ? (
                                <div className="h-8 w-32 animate-pulse rounded bg-white/20" />
                            ) : (
                                Number(balance || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                            )}
                        </h2>
                    </div>
                </div>
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <Wallet className="h-6 w-6 text-white" />
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <Link
                    to="/transactions"
                    className="text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white"
                >
                    View Transactions &rarr;
                </Link>
            </div>
        </div>
    );
}

import { format } from 'date-fns';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface Proposal {
    id: string;
    type: 'spending' | 'savings';
    amount: number;
    description: string | null;
    target_date: string | null;
    created_at: string;
}

interface PendingProposalsCardProps {
    proposals: Proposal[] | undefined;
    isLoading?: boolean;
}

export default function PendingProposalsCard({ proposals, isLoading }: PendingProposalsCardProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                <div className="mt-4 space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-12 animate-pulse rounded bg-muted/50" />
                    ))}
                </div>
            </div>
        );
    }

    const hasProposals = proposals && proposals.length > 0;

    return (
        <div className="flex flex-col rounded-lg border bg-card shadow-sm">
            <div className="border-b p-6 pb-4">
                <h3 className="font-semibold leading-none tracking-tight">Pending Proposals</h3>
                <p className="text-sm text-muted-foreground mt-1">Awaiting your vote</p>
            </div>
            <div className="p-6 pt-4 flex-1">
                {!hasProposals ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mb-2 opacity-50" />
                        <p>All caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {proposals.map((proposal) => (
                            <div key={proposal.id} className="group flex items-start justify-between space-x-4 rounded-md border p-3 transition-colors hover:bg-muted/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${proposal.type === 'spending'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(proposal.created_at), 'MMM d')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium leading-none">
                                        {proposal.description || 'No description'}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {Number(proposal.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </p>
                                </div>
                                <Link
                                    to="/proposals"
                                    search={{ proposalId: proposal.id }}
                                    className="mt-1 text-muted-foreground transition-colors group-hover:text-primary"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="sr-only">View proposal</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

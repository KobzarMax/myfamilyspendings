import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface Subscription {
    id: string;
    name: string;
    amount: number;
    next_payment_date: string;
    bank_accounts: {
        name: string;
    } | null;
}

interface UpcomingSubscriptionsCardProps {
    subscriptions: Subscription[] | undefined;
    isLoading?: boolean;
}

export default function UpcomingSubscriptionsCard({ subscriptions, isLoading }: UpcomingSubscriptionsCardProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 animate-pulse rounded bg-muted/50" />
                    ))}
                </div>
            </div>
        );
    }

    const hasSubscriptions = subscriptions && subscriptions.length > 0;

    return (
        <div className="flex flex-col rounded-lg border bg-card shadow-sm">
            <div className="border-b p-6 pb-4">
                <h3 className="font-semibold leading-none tracking-tight">Upcoming Subscriptions</h3>
                <p className="text-sm text-muted-foreground mt-1">Next 30 days</p>
            </div>
            <div className="p-6 pt-4 flex-1">
                {!hasSubscriptions ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <Calendar className="h-8 w-8 mb-2 opacity-50" />
                        <p>No upcoming payments</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subscriptions.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">{sub.name}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <span>{format(new Date(sub.next_payment_date), 'MMM d, yyyy')}</span>
                                        {sub.bank_accounts && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{sub.bank_accounts.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="font-medium">
                                    -{Number(sub.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

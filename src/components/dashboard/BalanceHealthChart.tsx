import { useMemo } from 'react';
import { format } from 'date-fns';

interface Transaction {
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

interface BalanceHealthChartProps {
    transactions: Transaction[] | undefined;
    isLoading?: boolean;
    onPeriodChange: (period: string) => void;
    currentPeriod: string;
}

export default function BalanceHealthChart({ transactions, isLoading, onPeriodChange, currentPeriod }: BalanceHealthChartProps) {
    const periods = [
        { label: '2W', value: '2w' },
        { label: '1M', value: '1m' },
        { label: '3M', value: '3m' },
        { label: '6M', value: '6m' },
        { label: '9M', value: '9m' },
        { label: '1Y', value: '1y' },
    ];

    // Process data for the chart
    // We'll create a simplified "net flow" bar chart for now, aggregating by appropriate intervals
    const chartData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        // Simple daily aggregation for now
        const dailyMap = new Map<string, number>();

        transactions.forEach(t => {
            const dateKey = t.date.split('T')[0]; // YYYY-MM-DD
            const amount = Number(t.amount);
            const val = t.type === 'income' ? amount : -amount;
            dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + val);
        });

        // Sort by date
        return Array.from(dailyMap.entries())
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [transactions]);

    // Find max value for scaling
    const maxValue = Math.max(...chartData.map(d => Math.abs(d.value)), 100);

    if (isLoading) {
        return (
            <div className="rounded-lg border bg-card p-6 shadow-sm h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-8 animate-pulse rounded bg-muted" />)}
                    </div>
                </div>
                <div className="flex-1 animate-pulse rounded bg-muted/30" />
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex flex-col space-y-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                    <h3 className="font-semibold leading-none tracking-tight">Balance Health</h3>
                    <p className="text-sm text-muted-foreground mt-1">Net cash flow over time</p>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                    {periods.map((period) => (
                        <button
                            key={period.value}
                            onClick={() => onPeriodChange(period.value)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${currentPeriod === period.value
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-background/50'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 pt-0">
                {!chartData.length ? (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md mt-4">
                        No data for this period
                    </div>
                ) : (
                    <div className="mt-4 h-[200px] flex items-end justify-between gap-px sm:gap-1">
                        {chartData.map((item, index) => {
                            // Determine bar height as percentage of max
                            const heightPct = Math.min((Math.abs(item.value) / maxValue) * 100, 100);
                            const isPositive = item.value >= 0;
                            // Only show some labels to avoid crowding
                            const showLabel = chartData.length < 15 || index % Math.ceil(chartData.length / 8) === 0;

                            return (
                                <div key={item.date} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                                    {/* Bar */}
                                    <div
                                        className={`w-full max-w-[20px] rounded-t-sm transition-all hover:opacity-80 ${isPositive ? 'bg-success/80' : 'bg-danger/80'
                                            }`}
                                        style={{ height: `${Math.max(heightPct, 2)}%` }} // min 2% height to be visible
                                    />

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                        <div className="rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md border">
                                            <p className="font-semibold">{format(new Date(item.date), 'MMM d')}</p>
                                            <p className={isPositive ? 'text-success' : 'text-danger'}>
                                                {item.value > 0 ? '+' : ''}{item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Axis Label */}
                                    {showLabel && (
                                        <div className="absolute top-full mt-2 text-[10px] text-muted-foreground whitespace-nowrap hidden sm:block">
                                            {format(new Date(item.date), 'MMM d')}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

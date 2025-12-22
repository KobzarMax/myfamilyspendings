import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ListItemSkeleton } from '../Skeleton';
import type { Transaction } from '../../types';

interface RecentActivityListProps {
    transactions: Transaction[] | undefined;
    isLoading: boolean;
}

import { motion } from 'framer-motion';
import { fadeInVariants } from '../../lib/animations';

export default function RecentActivityList({ transactions, isLoading }: RecentActivityListProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
                <div className="mt-6 flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                        {isLoading ? (
                            <>
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                                <ListItemSkeleton />
                            </>
                        ) : transactions?.length === 0 ? (
                            <li className="py-4 text-center text-gray-500">No recent transactions</li>
                        ) : (
                            transactions?.map((transaction, index) => (
                                <motion.li
                                    key={transaction.id}
                                    className="py-4"
                                    variants={fadeInVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {transaction.type === 'income' ? (
                                                <ArrowUpRight className="h-6 w-6 text-success" />
                                            ) : (
                                                <ArrowDownRight className="h-6 w-6 text-danger" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {transaction.description || transaction.category}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.type === 'income'
                                                    ? 'bg-success/10 text-success'
                                                    : 'bg-danger/10 text-danger'
                                                }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="mt-6">
                    <Link
                        to="/transactions"
                        className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </div>
    );
}

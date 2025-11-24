import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionRowProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
    return (
        <tr>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                {new Date(transaction.date).toLocaleDateString()}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {transaction.type}
                </span>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.category}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.description}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                ${Number(transaction.amount).toFixed(2)}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.status}</td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                        title="Edit transaction"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete transaction"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

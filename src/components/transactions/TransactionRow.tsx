import type { Transaction } from '../../types';

interface TransactionRowProps {
    transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
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
        </tr>
    );
}

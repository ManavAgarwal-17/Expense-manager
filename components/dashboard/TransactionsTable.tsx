import { MoreVertical } from 'lucide-react';

export default function TransactionsTable({ transactions }: { transactions: any[] }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Spending History</h3>
                <button className="text-[var(--muted)] hover:text-white">
                    <MoreVertical size={16} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--muted)]">
                    <thead className="border-b border-white/10">
                        <tr>
                            <th className="pb-3 font-medium text-[var(--muted)]">Category</th>
                            <th className="pb-3 font-medium text-[var(--muted)]">Budgeted</th>
                            <th className="pb-3 font-medium text-[var(--muted)]">Spent</th>
                            <th className="pb-3 font-medium text-[var(--muted)] text-right">Used</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((t, i) => (
                            <tr key={i} className="group hover:bg-white/5 transition-colors">
                                <td className="py-3 text-white font-medium">{t.category}</td>
                                <td className="py-3">${t.budgeted.toFixed(2)}</td>
                                <td className="py-3">${t.spent.toFixed(2)}</td>
                                <td className="py-3 text-right">
                                    <span className={`
                    ${t.used > 100 ? 'text-red-500' : 'text-blue-400'}
                  `}>
                                        {t.used}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

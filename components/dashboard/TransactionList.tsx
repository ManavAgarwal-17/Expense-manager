'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/app/actions/transaction';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    date: Date;
    description: string | null;
}


export default function TransactionList({ transactions, onEdit, currency = '₹' }: { transactions: Transaction[], onEdit?: (transaction: Transaction) => void, currency?: string }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!deleteId) return;

        setIsDeleting(true);
        await deleteTransaction(deleteId);
        setIsDeleting(false);
        setDeleteId(null);
    }

    return (
        <div className="bg-[var(--card)] rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#1F1F1F] border-b border-white/10">
                        <tr>
                            <th className="py-4 px-6 font-medium text-[var(--muted)]">Date</th>
                            <th className="py-4 px-6 font-medium text-[var(--muted)]">Category</th>
                            <th className="py-4 px-6 font-medium text-[var(--muted)]">Description</th>
                            <th className="py-4 px-6 font-medium text-[var(--muted)] text-right">Amount</th>
                            <th className="py-4 px-6 font-medium text-[var(--muted)] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-[var(--muted)]">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6 text-white">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-white">
                                        <span className="px-2 py-1 rounded bg-white/10 text-xs font-medium">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[var(--muted)]">
                                        {t.description || '-'}
                                    </td>
                                    <td className={`py-4 px-6 text-right font-medium ${t.type === 'INCOME' ? 'text-green-400' : 'text-white'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'}{currency}{t.amount.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(t)}
                                                    className="text-[var(--primary)] hover:text-white transition-colors p-2 rounded-full hover:bg-[var(--primary)]/10"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setDeleteId(t.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-400/10"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </div>
    );
}

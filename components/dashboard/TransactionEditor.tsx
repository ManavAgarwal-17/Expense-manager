'use client';

import { useState } from 'react';
import { addTransaction, updateTransaction } from '@/app/actions/transaction';

interface TransactionEditorProps {
    initialData?: {
        id: string;
        amount: number;
        type: string;
        category: string;
        date: Date | string; // Handle Date object or ISO string
        description: string | null;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

const INCOME_CATEGORIES = ['Salary', 'Reimbursement', 'Gifts', 'Pocket Money', 'Others'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Outing', 'Entertainment', 'Health', 'Grocery', 'Shopping', 'Lent', 'Misc'];

export default function TransactionEditor({ initialData, onSuccess, onCancel }: TransactionEditorProps) {
    const [loading, setLoading] = useState(false);
    const [transactionType, setTransactionType] = useState(initialData?.type || 'EXPENSE');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        let res;
        if (initialData?.id) {
            res = await updateTransaction(initialData.id, formData);
        } else {
            res = await addTransaction(formData);
        }

        setLoading(false);

        if (res.success) {
            if (onSuccess) onSuccess();
        } else {
            alert(res.message);
        }
    }

    // Format date for input
    const defaultDate = initialData?.date
        ? new Date(initialData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    // Get categories based on type
    const categories = transactionType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const defaultCategory = initialData?.category || categories[0];

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Amount</label>
                <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    defaultValue={initialData?.amount}
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="0.00"
                />
            </div>

            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Type</label>
                <select
                    name="type"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>

            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Category</label>
                <select
                    name="category"
                    key={transactionType} // Reset when type changes
                    defaultValue={defaultCategory}
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Date</label>
                <input
                    type="date"
                    name="date"
                    required
                    defaultValue={defaultDate}
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Description (Optional)</label>
                <input
                    type="text"
                    name="description"
                    defaultValue={initialData?.description || ''}
                    className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Dinner with friends..."
                />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-[var(--muted)] hover:text-white px-4 py-2 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                >
                    {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Transaction' : 'Save Transaction')}
                </button>
            </div>
        </form>
    );
}

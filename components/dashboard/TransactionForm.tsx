'use client';

import { useState, useEffect } from 'react';
import { addTransaction } from '@/app/actions/transaction';
import { getCategories } from '@/app/actions/categories';
import { Plus, Loader2 } from 'lucide-react';

type Category = {
    id: string;
    name: string;
    type: string;
};

export default function TransactionForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

    useEffect(() => {
        async function fetchCategories() {
            setCategoriesLoading(true);
            const data = await getCategories();
            setCategories(data);
            setCategoriesLoading(false);
        }
        fetchCategories();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const res = await addTransaction(formData);
        setLoading(false);

        if (res.success) {
            setIsOpen(false);
            (event.target as HTMLFormElement).reset();
            setSelectedType('EXPENSE');
        } else {
            alert(res.message);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-[var(--primary)] text-black px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
            >
                <Plus size={18} /> Add Transaction
            </button>
        );
    }

    const filteredCategories = categories.filter((c) => c.type === selectedType);

    return (
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Add Transaction</h3>
                <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-white">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        required
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Type</label>
                    <select
                        name="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as 'EXPENSE' | 'INCOME')}
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Category</label>
                    {categoriesLoading ? (
                        <div className="w-full bg-[#1F1F1F] text-[var(--muted)] px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Loading...
                        </div>
                    ) : (
                        <select
                            name="category"
                            className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        >
                            {filteredCategories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                            {filteredCategories.length === 0 && (
                                <option value="">No categories available</option>
                            )}
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Description (Optional)</label>
                    <input
                        type="text"
                        name="description"
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        placeholder="Dinner with friends..."
                    />
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Save Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}

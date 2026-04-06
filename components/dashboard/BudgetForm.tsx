'use client';

import { useState, useEffect } from 'react';
import { addBudget } from '@/app/actions/budget';
import { getCategories } from '@/app/actions/categories';
import { Plus, Loader2 } from 'lucide-react';

type Category = {
    id: string;
    name: string;
    type: string;
};

export default function BudgetForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            setCategoriesLoading(true);
            const data = await getCategories();
            setCategories(data.filter((c: Category) => c.type === 'EXPENSE'));
            setCategoriesLoading(false);
        }
        fetchCategories();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const res = await addBudget(formData);
        setLoading(false);

        if (res.success) {
            setIsOpen(false);
            (event.target as HTMLFormElement).reset();
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
                <Plus size={18} /> Create Budget
            </button>
        );
    }

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'short' });
    const currentYear = today.getFullYear();

    return (
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Create Budget</h3>
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
                        placeholder="1000.00"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Category (Optional)</label>
                    {categoriesLoading ? (
                        <div className="w-full bg-[#1F1F1F] text-[var(--muted)] px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Loading...
                        </div>
                    ) : (
                        <select
                            name="category"
                            className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        >
                            <option value="">All Categories (General)</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Month</label>
                    <select
                        name="month"
                        defaultValue={currentMonth}
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    >
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Year</label>
                    <input
                        type="number"
                        name="year"
                        defaultValue={currentYear}
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Budget'}
                    </button>
                </div>
            </form>
        </div>
    );
}

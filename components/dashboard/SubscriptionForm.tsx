'use client';

import { useState } from 'react';
import { addSubscription } from '@/app/actions/subscription';
import { Plus } from 'lucide-react';

export default function SubscriptionForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const res = await addSubscription(formData);
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
                <Plus size={18} /> Add Subscription
            </button>
        );
    }

    return (
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Add Subscription</h3>
                <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-white">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        placeholder="Netflix"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Cost</label>
                    <input
                        type="number"
                        step="0.01"
                        name="cost"
                        required
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        placeholder="14.99"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Next Renewal Date</label>
                    <input
                        type="date"
                        name="renewalDate"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Renewal Period</label>
                    <select
                        name="renewalPeriod"
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    >
                        <option value="ONE_TIME">One Time</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1">Status</label>
                    <select
                        name="status"
                        className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Subscription'}
                    </button>
                </div>
            </form>
        </div>
    );
}

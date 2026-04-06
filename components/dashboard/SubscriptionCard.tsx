'use client';

import { CreditCard } from 'lucide-react';

interface SubscriptionCardProps {
    count: number;
    amount: number;
}

export default function SubscriptionCard({ count, amount, currency = '₹' }: SubscriptionCardProps & { currency?: string }) {
    return (
        <div className="h-full bg-gradient-to-br from-[#2e2305] to-[var(--card)] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-medium">Subscriptions</h3>
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-black">
                    <CreditCard size={16} />
                </div>
            </div>

            <div className="mb-2">
                <span className="text-3xl font-bold text-white">{count}</span>
                <span className="text-sm text-[var(--muted)] ml-2">Active</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">
                    Monthly Cost
                </span>
                <span className="text-white font-bold">
                    {currency}{amount.toFixed(2)}
                </span>
            </div>
        </div>
    );
}

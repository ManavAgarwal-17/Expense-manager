'use client';

import { useState } from 'react';
import { Trash2, RefreshCcw, Calendar } from 'lucide-react';
import { deleteSubscription, toggleSubscriptionStatus } from '@/app/actions/subscription';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Subscription {
    id: string;
    name: string;
    cost: number;
    renewalDate: Date;
    renewalPeriod: string;
    status: string;
}

export default function SubscriptionCard({ subscription, currency = '₹' }: { subscription: Subscription, currency?: string }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const renewalDate = new Date(subscription.renewalDate);
    const isActive = subscription.status === 'ACTIVE';

    const getPeriodText = (period: string) => {
        switch (period) {
            case 'ONE_TIME': return 'one-time';
            case 'MONTHLY': return 'month';
            case 'QUARTERLY': return 'quarter';
            case 'YEARLY': return 'year';
            default: return 'month';
        }
    };

    async function handleDelete() {
        if (!deleteId) return;

        setIsDeleting(true);
        await deleteSubscription(deleteId);
        setIsDeleting(false);
        setDeleteId(null);
    }

    async function handleToggle() {
        setIsToggling(true);
        await toggleSubscriptionStatus(subscription.id, subscription.status);
        setIsToggling(false);
    }

    return (
        <>
            <div className={`bg-[var(--card)] p-6 rounded-2xl border transition-all ${isActive ? 'border-white/5' : 'border-white/5 opacity-75'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">{subscription.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mt-1">
                            <Calendar size={14} />
                            {subscription.renewalPeriod === 'ONE_TIME' ? 'One-time payment' : `Next: ${renewalDate.toLocaleDateString()}`}
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold border ${isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                        {subscription.status}
                    </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-white">{currency}{subscription.cost.toFixed(2)}</span>
                    <span className="text-[var(--muted)] text-sm">/ {getPeriodText(subscription.renewalPeriod)}</span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button
                        onClick={handleToggle}
                        disabled={isToggling}
                        className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 ${isActive ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                    >
                        <RefreshCcw size={16} />
                        {isToggling ? 'Loading...' : (isActive ? 'Pause' : 'Activate')}
                    </button>

                    <button
                        onClick={() => setDeleteId(subscription.id)}
                        className="h-full aspect-square flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/10"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Subscription"
                message={`Are you sure you want to delete "${subscription.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}

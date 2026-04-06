'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteBudget } from '@/app/actions/budget';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface BudgetCardItemProps {
    budget: {
        id: string;
        category: string | null;
        month: string;
        year: number;
        amount: number;
    };
    budgetSpent: number;
    currency: string;
}

export default function BudgetCardItem({ budget, budgetSpent, currency }: BudgetCardItemProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const percentage = budget.amount > 0 ? Math.min(100, (budgetSpent / budget.amount) * 100) : 0;
    const isOverBudget = budgetSpent > budget.amount;

    async function handleDelete() {
        if (!deleteId) return;

        setIsDeleting(true);
        await deleteBudget(deleteId);
        setIsDeleting(false);
        setDeleteId(null);
    }

    return (
        <>
            <div className={`bg-[var(--card)] p-6 rounded-2xl border ${isOverBudget ? 'border-red-500/50' : 'border-white/5'} relative group`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-sm text-[var(--muted)] mb-1">
                            {budget.month} {budget.year}
                        </div>
                        <h3 className={`text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                            {budget.category || 'General Budget'}
                        </h3>
                    </div>
                    <button
                        onClick={() => setDeleteId(budget.id)}
                        className="text-[var(--muted)] hover:text-red-400 transition-colors p-2"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="mb-2 flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                        {currency}{budgetSpent.toFixed(2)}
                    </span>
                    <span className="text-[var(--muted)] text-sm">
                        / {currency}{budget.amount.toFixed(2)}
                    </span>
                </div>

                <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : 'bg-[var(--primary)]'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                {isOverBudget && (
                    <div className="mt-2 text-xs text-red-400 font-medium">
                        Over budget by {currency}{(budgetSpent - budget.amount).toFixed(2)}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Budget"
                message={`Are you sure you want to delete the budget for "${budget.category || 'General Budget'}" (${budget.month} ${budget.year})? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}

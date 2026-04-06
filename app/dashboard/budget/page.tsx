import { getBudgets } from '@/app/actions/budget';
import { getTransactions } from '@/app/actions/transaction';
import BudgetForm from '@/components/dashboard/BudgetForm';
import BudgetCard from '@/components/dashboard/BudgetCard';
import BudgetCardItem from '@/components/dashboard/BudgetCardItem';

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { calculateBudgetStats } from '@/lib/budgetStats';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export default async function BudgetPage() {
    const userId = await getUser();
    if (!userId) return <div>Unauthorized</div>;

    const [budgets, transactions, userData] = await Promise.all([
        prisma.budget.findMany({
            where: { userId }
        }),
        prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { currency: true }
        })
    ]);

    const currency = userData?.currency || '₹';

    // Calculate Budget Summary Stats
    const budgetStats = calculateBudgetStats(transactions, budgets);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Budget</h1>
                    <p className="text-[var(--muted)]">Manage your monthly spending goals, track transactions, and stay on top of your finances.</p>
                </div>
            </div>

            {/* Layout Grid */}
            {/* Top Section: Overview & Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Main Budget Widget */}
                <BudgetCard stats={budgetStats} currency={currency} />

                {/* 2. Set New Budget Form */}
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5 h-full">
                    <h3 className="text-xl font-bold text-white mb-4">Set New Budget</h3>
                    <BudgetForm />
                </div>
            </div>

            {/* Bottom Section: Budget List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white">Your Budgets</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.length === 0 ? (
                        <div className="col-span-full text-[var(--muted)] py-4 text-center border border-dashed border-white/10 rounded-xl">
                            No budgets defined yet.
                        </div>
                    ) : (
                        budgets.map((budget: any) => {
                            // Calculate spent for this specific budget category and month
                            const budgetSpent = transactions
                                .filter((t: any) => {
                                    const d = new Date(t.date);
                                    const tMonth = d.toLocaleString('default', { month: 'short' });
                                    const tYear = d.getFullYear();
                                    return (
                                        t.type === 'EXPENSE' &&
                                        t.category === budget.category &&
                                        tMonth === budget.month &&
                                        tYear === budget.year
                                    );
                                })
                                .reduce((sum: number, t: any) => sum + t.amount, 0);

                            return (
                                <BudgetCardItem
                                    key={budget.id}
                                    budget={budget}
                                    budgetSpent={budgetSpent}
                                    currency={currency}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

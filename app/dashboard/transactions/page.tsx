import { getTransactions } from '@/app/actions/transaction';
import TransactionWidget from '@/components/dashboard/TransactionWidget';
import InfoCard from '@/components/dashboard/InfoCard';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export default async function TransactionsPage() {
    const userId = await getUser();
    if (!userId) return <div>Unauthorized</div>;

    const [transactions, userData] = await Promise.all([
        getTransactions(),
        prisma.user.findUnique({
            where: { id: userId },
            select: { currency: true }
        })
    ]);

    const currency = userData?.currency || '₹';

    // Calculate current month income and expenses
    const today = new Date();
    const currentMonthTransactions = (transactions as any[]).filter((t: any) => {
        const d = new Date(t.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    const income = currentMonthTransactions
        .filter((t: any) => t.type === 'INCOME')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const expense = currentMonthTransactions
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
                    <p className="text-[var(--muted)]">Manage your income and expenses</p>
                </div>
            </div>

            {/* Income and Expense Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    title="Incomes"
                    amount={income}
                    change={0}
                    changeType="increase"
                    variant="success"
                    currency={currency}
                />
                <InfoCard
                    title="Expenses"
                    amount={expense}
                    change={0}
                    changeType="increase"
                    variant="danger"
                    currency={currency}
                />
            </div>

            <div className="flex-1 min-h-[600px]">
                <TransactionWidget transactions={transactions as any[]} currency={currency} />
            </div>
        </div>
    );
}

import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import BudgetCard from '@/components/dashboard/BudgetCard';
import InfoCard from '@/components/dashboard/InfoCard';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import { CategoryBreakdownChart } from '@/components/dashboard/StatChart';
import IncomeExpenseFlowChart from '@/components/dashboard/IncomeExpenseFlowChart';
import { calculateBudgetStats } from '@/lib/budgetStats';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export default async function DashboardPage() {
    const userId = await getUser();

    if (!userId) {
        return <div>Authentication required</div>;
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    // Define types since Prisma client might be stale during dev
    interface Transaction {
        id: string;
        amount: number;
        type: string;
        category: string;
        date: Date;
        description: string | null;
        userId: string;
    }

    interface Budget {
        id: string;
        amount: number;
        spent: number;
        month: string;
        year: number;
        userId: string;
    }

    // Fetch data including user currency
    const [transactionsData, budgetsData, subscriptionsData, userData] = await Promise.all([
        prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        }),
        prisma.budget.findMany({
            where: { userId }
        }),
        prisma.subscription.findMany({
            where: { userId, status: 'ACTIVE' }
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { currency: true }
        })
    ]);

    const currency = userData?.currency || '₹';

    const transactions = transactionsData as unknown as Transaction[];
    const budgets = budgetsData as unknown as Budget[];
    const subscriptions = subscriptionsData;

    // -- Calculate Stats --

    // 1. Budget Stats using helper
    const budgetStats = calculateBudgetStats(transactions, budgets);

    // 2. Income & Expenses Stats
    const currentMonthTransactions = transactions.filter((t: Transaction) => {
        const d = new Date(t.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    const income = currentMonthTransactions
        .filter((t: Transaction) => t.type === 'INCOME')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const expense = currentMonthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);


    // 3. Income & Expense Flow Data (by category)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Monthly data - group transactions by month with category breakdown
    const incomeExpenseMonthlyData = months.map((m, index) => {
        const monthTrans = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === currentYear && d.getMonth() === index;
        });

        // Group income by category
        const incomeByCategory: Record<string, number> = {};
        monthTrans.filter(t => t.type === 'INCOME').forEach(t => {
            incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
        });

        // Group expenses by category
        const expenseByCategory: Record<string, number> = {};
        monthTrans.filter(t => t.type === 'EXPENSE').forEach(t => {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        });

        return {
            name: m,
            income: Object.entries(incomeByCategory).map(([category, amount]) => ({ category, amount })),
            expense: Object.entries(expenseByCategory).map(([category, amount]) => ({ category, amount }))
        };
    });

    // Yearly data - group all transactions by year
    const yearlyDataMap: Record<number, { income: Record<string, number>, expense: Record<string, number> }> = {};

    transactions.forEach(t => {
        const year = new Date(t.date).getFullYear();
        if (!yearlyDataMap[year]) {
            yearlyDataMap[year] = { income: {}, expense: {} };
        }

        if (t.type === 'INCOME') {
            yearlyDataMap[year].income[t.category] = (yearlyDataMap[year].income[t.category] || 0) + t.amount;
        } else if (t.type === 'EXPENSE') {
            yearlyDataMap[year].expense[t.category] = (yearlyDataMap[year].expense[t.category] || 0) + t.amount;
        }
    });

    const incomeExpenseYearlyData = Object.entries(yearlyDataMap)
        .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
        .map(([year, data]) => ({
            name: year,
            income: Object.entries(data.income).map(([category, amount]) => ({ category, amount })),
            expense: Object.entries(data.expense).map(([category, amount]) => ({ category, amount }))
        }));


    // 4. Category Breakdown Data
    const spendingCategoryMap: Record<string, number> = {};
    const incomeCategoryMap: Record<string, number> = {};

    currentMonthTransactions.forEach((t: Transaction) => {
        if (t.type === 'EXPENSE') {
            spendingCategoryMap[t.category] = (spendingCategoryMap[t.category] || 0) + t.amount;
        } else if (t.type === 'INCOME') {
            incomeCategoryMap[t.category] = (incomeCategoryMap[t.category] || 0) + t.amount;
        }
    });

    const spendingCategoriesData = Object.entries(spendingCategoryMap).map(([name, value]) => ({ name, value }));
    const incomeCategoriesData = Object.entries(incomeCategoryMap).map(([name, value]) => ({ name, value }));

    // Subscriptions Count
    const activeSubscriptionsCount = subscriptions.length;
    const totalSubscriptionCost = subscriptions.reduce((sum: number, s: { cost: number }) => sum + s.cost, 0);

    return (
        <div className="flex flex-col gap-6">

            {/* Top Row: Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {/* Budget Card (Span 2) */}
                <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <BudgetCard stats={budgetStats} currency={currency} />
                </div>

                {/* Income Card */}
                <div className="lg:col-span-1">
                    <InfoCard
                        title="Incomes"
                        amount={income}
                        change={0}
                        changeType="increase"
                        variant="success"
                        currency={currency}
                    />
                </div>

                {/* Expenses Card */}
                <div className="lg:col-span-1">
                    <InfoCard
                        title="Expenses"
                        amount={expense}
                        change={0}
                        changeType="increase"
                        variant="danger"
                        currency={currency}
                    />
                </div>

                {/* Subscription Card */}
                <div className="lg:col-span-1 xl:col-span-1">
                    <SubscriptionCard count={activeSubscriptionsCount} amount={totalSubscriptionCost} currency={currency} />
                </div>
            </div>

            {/* Category Breakdown - Two Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Categories Widget */}
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-medium">Spending by Category</h3>
                        <span className="text-xs text-[var(--muted)]">Current Month</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <CategoryBreakdownChart
                            spendingData={spendingCategoriesData}
                            incomeData={[]}
                            currency={currency}
                            showOnlySpending={true}
                        />
                    </div>
                </div>

                {/* Income Categories Widget */}
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-medium">Income by Category</h3>
                        <span className="text-xs text-[var(--muted)]">Current Month</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <CategoryBreakdownChart
                            spendingData={[]}
                            incomeData={incomeCategoriesData}
                            currency={currency}
                            showOnlyIncome={true}
                        />
                    </div>
                </div>
            </div>

            {/* Middle Row: Income & Expense Flow Chart */}
            <div className="bg-gradient-to-br from-[#051e2e] to-[var(--card)] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-medium">Income & Expense Flow</h3>
                </div>
                <div className="h-[400px] w-full">
                    <IncomeExpenseFlowChart
                        monthlyData={incomeExpenseMonthlyData}
                        yearlyData={incomeExpenseYearlyData}
                        currency={currency}
                    />
                </div>
            </div>


        </div>
    );
}

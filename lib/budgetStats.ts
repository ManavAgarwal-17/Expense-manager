
export interface BudgetData {
    amount: number;
    used: number;
    data: number[]; // Array of values for the graph
    label: string; // e.g. "Today", "This Month"
}

export interface BudgetStats {
    daily: BudgetData;
    monthly: BudgetData;
    yearly: BudgetData;
}

// Interfaces compatible with Prisma return types or basic shapes
interface Transaction {
    amount: number;
    date: Date;
    type: string;
}

interface Budget {
    amount: number;
    month: string;
    year: number;
}

export function calculateBudgetStats(transactions: Transaction[], budgets: Budget[]): BudgetStats {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Filter for Expenses related to this year for calculation
    const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');

    // --- YEARLY STATS ---
    const yearlyBudgets = budgets.filter(b => b.year === currentYear);
    const yearlyLimit = yearlyBudgets.reduce((sum, b) => sum + b.amount, 0);

    const yearlyTransactions = expenseTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear;
    });
    const yearlyUsed = yearlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    const yearlyData = new Array(12).fill(0);
    yearlyTransactions.forEach(t => {
        const m = new Date(t.date).getMonth();
        yearlyData[m] += t.amount;
    });

    // --- MONTHLY STATS ---
    const currentMonthName = today.toLocaleString('default', { month: 'short' });
    const monthlyBudgets = budgets.filter(b => b.year === currentYear && b.month === currentMonthName);
    const monthlyLimit = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0);

    const monthlyTransactions = yearlyTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth;
    });
    const monthlyUsed = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthlyData = new Array(daysInMonth).fill(0);
    monthlyTransactions.forEach(t => {
        const d = new Date(t.date).getDate() - 1;
        if (d >= 0 && d < daysInMonth) monthlyData[d] += t.amount;
    });

    // --- DAILY STATS ---
    const dailyLimit = monthlyLimit > 0 ? monthlyLimit / daysInMonth : 0;

    const dailyTransactions = monthlyTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getDate() === currentDay;
    });
    const dailyUsed = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);

    const dailyData = new Array(24).fill(0);
    dailyTransactions.forEach(t => {
        const h = new Date(t.date).getHours();
        dailyData[h] += t.amount;
    });

    return {
        daily: {
            amount: dailyLimit,
            used: dailyUsed,
            data: dailyData,
            label: 'This Day'
        },
        monthly: {
            amount: monthlyLimit,
            used: monthlyUsed,
            data: monthlyData,
            label: 'This Month'
        },
        yearly: {
            amount: yearlyLimit,
            used: yearlyUsed,
            data: yearlyData,
            label: 'This Year'
        }
    };
}

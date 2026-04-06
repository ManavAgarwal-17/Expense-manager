'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
    // Income categories - Green tones
    'Salary': '#10B981',
    'Freelance': '#14B8A6',
    'Investment': '#06B6D4',
    'Business': '#22C55E',
    'Bonus': '#059669',

    // Expense categories - Red/Warm tones
    'Food': '#EF4444',
    'Transport': '#F59E0B',
    'Entertainment': '#EC4899',
    'Shopping': '#A855F7',
    'Bills': '#6366F1',
    'Healthcare': '#F97316',
    'Education': '#8B5CF6',
    'Rent': '#F43F5E',

    // Default
    'Other': '#6B7280'
};

const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || '#6B7280';
};

interface CategoryAmount {
    category: string;
    amount: number;
}

interface ChartDataPoint {
    name: string;
    income: CategoryAmount[];
    expense: CategoryAmount[];
}

interface IncomeExpenseFlowChartProps {
    monthlyData: ChartDataPoint[];
    yearlyData: ChartDataPoint[];
    currency?: string;
}

export default function IncomeExpenseFlowChart({
    monthlyData,
    yearlyData,
    currency = '₹'
}: IncomeExpenseFlowChartProps) {
    const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

    const data = view === 'monthly' ? monthlyData : yearlyData;

    // Get all unique categories across all data points
    const allCategories = new Set<string>();
    data.forEach(point => {
        point.income.forEach(item => allCategories.add(item.category));
        point.expense.forEach(item => allCategories.add(item.category));
    });

    // Transform data for stacked bar chart
    const transformedData = data.map(point => {
        const result: any = { name: point.name };

        // Add income categories
        point.income.forEach(item => {
            result[`income_${item.category}`] = item.amount;
        });

        // Add expense categories
        point.expense.forEach(item => {
            result[`expense_${item.category}`] = item.amount;
        });

        return result;
    });

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || payload.length === 0) return null;

        // Separate income and expense items
        const incomeItems = payload.filter((item: any) => item.dataKey.startsWith('income_'));
        const expenseItems = payload.filter((item: any) => item.dataKey.startsWith('expense_'));

        const totalIncome = incomeItems.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
        const totalExpense = expenseItems.reduce((sum: number, item: any) => sum + (item.value || 0), 0);

        return (
            <div className="bg-[#1A1A1A] p-4 rounded-lg border border-white/10 shadow-lg">
                <p className="text-white font-bold mb-2">{label}</p>

                {incomeItems.length > 0 && (
                    <div className="mb-2">
                        <p className="text-green-400 font-semibold text-sm mb-1">Income: {currency}{totalIncome.toFixed(2)}</p>
                        {incomeItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between gap-4 text-xs">
                                <span style={{ color: item.fill }}>{item.dataKey.replace('income_', '')}</span>
                                <span className="text-white">{currency}{item.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {expenseItems.length > 0 && (
                    <div>
                        <p className="text-red-400 font-semibold text-sm mb-1">Expense: {currency}{totalExpense.toFixed(2)}</p>
                        {expenseItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between gap-4 text-xs">
                                <span style={{ color: item.fill }}>{item.dataKey.replace('expense_', '')}</span>
                                <span className="text-white">{currency}{item.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between text-sm font-bold">
                        <span className="text-[var(--muted)]">Net:</span>
                        <span className={totalIncome - totalExpense >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {currency}{(totalIncome - totalExpense).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            {/* Toggle Buttons */}
            <div className="flex justify-end mb-4">
                <div className="flex bg-[#252525] rounded-full p-1">
                    <button
                        onClick={() => setView('monthly')}
                        className={`px-4 py-1.5 text-xs rounded-full font-medium transition-colors ${view === 'monthly'
                            ? 'bg-[var(--primary)] text-black'
                            : 'text-[var(--muted)] hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setView('yearly')}
                        className={`px-4 py-1.5 text-xs rounded-full font-medium transition-colors ${view === 'yearly'
                            ? 'bg-[var(--primary)] text-black'
                            : 'text-[var(--muted)] hover:text-white'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={transformedData}
                    barGap={8}
                    margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#666"
                        tick={{ fill: '#999', fontSize: 11 }}
                        axisLine={{ stroke: '#333' }}
                        angle={0}
                        height={60}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#999', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                    {/* Render income bars */}
                    {Array.from(allCategories).map((category, index) => (
                        <Bar
                            key={`income_${category}`}
                            dataKey={`income_${category}`}
                            stackId="income"
                            fill={getCategoryColor(category)}
                            radius={index === allCategories.size - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                    ))}

                    {/* Render expense bars */}
                    {Array.from(allCategories).map((category, index) => (
                        <Bar
                            key={`expense_${category}`}
                            dataKey={`expense_${category}`}
                            stackId="expense"
                            fill={getCategoryColor(category)}
                            radius={index === allCategories.size - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

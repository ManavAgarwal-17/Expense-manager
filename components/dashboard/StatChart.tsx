'use client';

import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

export function BudgetSpendingFlowChart({ data, currency = '₹' }: { data: any[], currency?: string }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `${currency}${value / 1000}k`}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                />
                <Bar dataKey="budget" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="spend" fill="#1E3A8A" radius={[4, 4, 0, 0]} stackId="b" />
                {/* Note: The image uses side-by-side or stacked? 
           Image shows two bars per month: Green (Budget) and Blue (Spend).
           They are side by side.
        */}
            </BarChart>
        </ResponsiveContainer>
    );
}

// Fixed version for side-by-side bars matching the image exactly
export function DoubleBarChart({ data, currency = '₹' }: { data: any[], currency?: string }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `${currency}${value / 1000}k`}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="budget" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="spend" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function IncomeFlowChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function SpendingCategoriesChart({ data }: { data: any[] }) {
    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    // Convert to Gauge style as in the image (Semi-circle)
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function CategoryBreakdownChart({
    spendingData,
    incomeData,
    currency = '₹',
    showOnlySpending = false,
    showOnlyIncome = false
}: {
    spendingData: { name: string; value: number }[],
    incomeData: { name: string; value: number }[],
    currency?: string,
    showOnlySpending?: boolean,
    showOnlyIncome?: boolean
}) {
    const SPENDING_COLORS = ['#EF4444', '#F59E0B', '#F97316', '#EC4899', '#8B5CF6', '#6366F1'];
    const INCOME_COLORS = ['#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'];

    const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);
    const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white">
                    <p className="font-medium">{payload[0].name}</p>
                    <p className="text-sm text-[var(--primary)]">
                        {currency}{payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // If showing only one type, render single chart
    if (showOnlySpending) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                    <span className="text-sm text-[var(--muted)]">
                        Total: {currency}{totalSpending.toFixed(2)}
                    </span>
                </div>
                <div className="flex-1 min-h-[200px]">
                    {spendingData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={SPENDING_COLORS[index % SPENDING_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted)]">
                            No spending data
                        </div>
                    )}
                </div>
                {/* Legend for Spending */}
                {spendingData.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {spendingData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: SPENDING_COLORS[index % SPENDING_COLORS.length] }}
                                />
                                <span className="text-xs text-[var(--muted)] truncate">{item.name}</span>
                                <span className="text-xs text-white ml-auto">{currency}{item.value.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (showOnlyIncome) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center mb-4">
                    <span className="text-sm text-[var(--muted)]">
                        Total: {currency}{totalIncome.toFixed(2)}
                    </span>
                </div>
                <div className="flex-1 min-h-[200px]">
                    {incomeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted)]">
                            No income data
                        </div>
                    )}
                </div>
                {/* Legend for Income */}
                {incomeData.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {incomeData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: INCOME_COLORS[index % INCOME_COLORS.length] }}
                                />
                                <span className="text-xs text-[var(--muted)] truncate">{item.name}</span>
                                <span className="text-xs text-white ml-auto">{currency}{item.value.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default: Show both side by side
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Spending Categories */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Spending by Category</h4>
                    <span className="text-sm text-[var(--muted)]">
                        Total: {currency}{totalSpending.toFixed(2)}
                    </span>
                </div>
                <div className="flex-1 min-h-[250px]">
                    {spendingData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={SPENDING_COLORS[index % SPENDING_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted)]">
                            No spending data
                        </div>
                    )}
                </div>
                {/* Legend for Spending */}
                {spendingData.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {spendingData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: SPENDING_COLORS[index % SPENDING_COLORS.length] }}
                                />
                                <span className="text-xs text-[var(--muted)] truncate">{item.name}</span>
                                <span className="text-xs text-white ml-auto">{currency}{item.value.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Income Categories */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Income by Category</h4>
                    <span className="text-sm text-[var(--muted)]">
                        Total: {currency}{totalIncome.toFixed(2)}
                    </span>
                </div>
                <div className="flex-1 min-h-[250px]">
                    {incomeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted)]">
                            No income data
                        </div>
                    )}
                </div>
                {/* Legend for Income */}
                {incomeData.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {incomeData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: INCOME_COLORS[index % INCOME_COLORS.length] }}
                                />
                                <span className="text-xs text-[var(--muted)] truncate">{item.name}</span>
                                <span className="text-xs text-white ml-auto">{currency}{item.value.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

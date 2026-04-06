'use client';

import { useState } from 'react';

// Interfaces matching the helper
interface BudgetData {
    amount: number;
    used: number;
    data: number[];
    label: string;
}

interface BudgetStats {
    daily: BudgetData;
    monthly: BudgetData;
    yearly: BudgetData;
}

export default function BudgetCard({ stats, currency = '₹' }: { stats: BudgetStats, currency?: string }) {
    const [view, setView] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    const currentData = stats[view];

    // Normalize Graph Data
    const maxVal = Math.max(...currentData.data, 0);
    // If maxVal is 0 (no data), avoid division issues, bar height will be base.

    return (
        <div className="bg-gradient-to-br from-[#2e1505] to-[var(--card)] p-6 rounded-2xl border border-white/5 relative overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium">Budget</h3>
                <div className="flex items-center gap-2">
                    <div className="flex bg-[#252525] rounded-full p-1">
                        <button
                            onClick={() => setView('daily')}
                            className={`px-3 py-1 text-xs transition-colors rounded-full ${view === 'daily' ? 'text-black bg-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-white'}`}
                        >
                            This Day
                        </button>
                        <button
                            onClick={() => setView('monthly')}
                            className={`px-3 py-1 text-xs transition-colors rounded-full ${view === 'monthly' ? 'text-black bg-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-white'}`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setView('yearly')}
                            className={`px-3 py-1 text-xs transition-colors rounded-full ${view === 'yearly' ? 'text-black bg-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-white'}`}
                        >
                            This Year
                        </button>
                    </div>
                </div>
            </div>

            {/* Amount */}
            <div className="mb-2">
                <span className="text-3xl font-bold text-white">{currency}{currentData.used.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-6">used from {currency}{currentData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

            {/* Progress Bar / Graph */}
            <div className="w-full h-12 bg-[#252525] rounded-sm flex gap-[2px] items-end overflow-hidden relative">
                {currentData.data.length > 0 ? (
                    currentData.data.map((val, i) => {
                        const barHeight = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm transition-all duration-500 ${val > 0 ? 'bg-gradient-to-t from-blue-600 to-purple-500' : 'bg-[#333]'}`}
                                style={{ height: `${Math.max(barHeight, 10)}%` }} // Min 10% height for visual aesthetics
                            ></div>
                        );
                    })
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">No data</div>
                )}
            </div>
        </div>
    );
}

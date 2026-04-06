import { ArrowUpRight } from 'lucide-react';

export default function InfoCard({
    title,
    amount,
    change,
    changeType,
    variant = 'default',
    currency = '₹'
}: {
    title: string,
    amount: number,
    change: number,
    changeType: 'increase' | 'decrease',
    variant?: 'default' | 'success' | 'danger',
    currency?: string
}) {
    // Variant styles
    const getBackground = () => {
        if (variant === 'success') return 'bg-gradient-to-br from-[#052e1f] to-[var(--card)]';
        if (variant === 'danger') return 'bg-gradient-to-br from-[#2e0505] to-[var(--card)]';
        return 'bg-[var(--card)]';
    };

    return (
        <div className={`h-full p-6 rounded-2xl border border-white/5 relative overflow-hidden ${getBackground()}`}>

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-medium">{title}</h3>
            </div>

            <div className="mb-2">
                <span className="text-3xl font-bold text-white">{currency}{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">
                    <span className={change > 0 ? 'text-[#10B981]' : 'text-red-500'}>
                        {change > 0 ? '+' : ''}{currency}{Math.abs(change)}
                    </span>
                    {' '}from last month
                </span>

            </div>
        </div>
    );
}

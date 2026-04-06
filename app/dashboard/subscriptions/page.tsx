import { getSubscriptions } from '@/app/actions/subscription';
import SubscriptionForm from '@/components/dashboard/SubscriptionForm';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import SubscriptionCardItem from '@/components/dashboard/SubscriptionCardItem';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export default async function SubscriptionsPage() {
    const userId = await getUser();
    if (!userId) return <div>Unauthorized</div>;

    const [subscriptions, userData] = await Promise.all([
        getSubscriptions(),
        prisma.user.findUnique({
            where: { id: userId },
            select: { currency: true }
        })
    ]);

    const currency = userData?.currency || '₹';

    // Calculate Summary Stats
    const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'ACTIVE');
    // Normalize to monthly cost for comparison
    const totalMonthlyCost = activeSubscriptions.reduce((sum: number, s: any) => {
        let monthlyCost = 0;
        switch (s.renewalPeriod) {
            case 'ONE_TIME':
                monthlyCost = 0; // One-time payments don't contribute to recurring monthly cost
                break;
            case 'MONTHLY':
                monthlyCost = s.cost;
                break;
            case 'QUARTERLY':
                monthlyCost = s.cost / 3;
                break;
            case 'YEARLY':
                monthlyCost = s.cost / 12;
                break;
            default:
                monthlyCost = s.cost; // Fallback to monthly
        }
        return sum + monthlyCost;
    }, 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
                    <p className="text-[var(--muted)]">Track your recurring expenses and manage renewal dates.</p>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Summary Widget */}
                <div className="h-full">
                    <SubscriptionCard count={activeSubscriptions.length} amount={totalMonthlyCost} currency={currency} />
                </div>

                {/* 2. Add Subscription Form */}
                <div className="bg-[var(--card)] p-6 rounded-2xl border border-white/5 h-full">
                    <h3 className="text-xl font-bold text-white mb-4">Add Subscription</h3>
                    <SubscriptionForm />
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white">Your Subscriptions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscriptions.length === 0 ? (
                        <div className="col-span-full text-[var(--muted)] py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                            No subscriptions added yet.
                        </div>
                    ) : (
                        subscriptions.map((sub: any) => (
                            <SubscriptionCardItem
                                key={sub.id}
                                subscription={sub}
                                currency={currency}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

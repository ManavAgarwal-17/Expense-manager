'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export async function getSubscriptions() {
    const userId = await getUser();
    if (!userId) return [];

    return await prisma.subscription.findMany({
        where: { userId },
        orderBy: { renewalDate: 'asc' }
    });
}

export async function addSubscription(formData: FormData) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const name = formData.get('name') as string;
    const cost = parseFloat(formData.get('cost') as string);
    const renewalDateStr = formData.get('renewalDate') as string;
    const renewalPeriod = formData.get('renewalPeriod') as string || 'MONTHLY';
    const status = formData.get('status') as string || 'ACTIVE';

    if (!name || !cost || !renewalDateStr) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        await prisma.subscription.create({
            data: {
                name,
                cost,
                renewalDate: new Date(renewalDateStr),
                renewalPeriod,
                status,
                userId
            }
        });
        revalidatePath('/dashboard/subscriptions');
        // Also revalidate dashboard as it might show total sub count
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to add subscription' };
    }
}

export async function deleteSubscription(id: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    try {
        await prisma.subscription.delete({
            where: { id, userId }
        });
        revalidatePath('/dashboard/subscriptions');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to delete subscription' };
    }
}

export async function toggleSubscriptionStatus(id: string, currentStatus: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
        await prisma.subscription.update({
            where: { id, userId },
            data: { status: newStatus }
        });
        revalidatePath('/dashboard/subscriptions');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to update subscription' };
    }
}

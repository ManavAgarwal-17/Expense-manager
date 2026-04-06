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

export async function getTransactions() {
    const userId = await getUser();
    if (!userId) return [];

    return await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
}

export async function addTransaction(formData: FormData) {
    const userId = await getUser();
    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const dateStr = formData.get('date') as string; // Expecting YYYY-MM-DD
    const description = formData.get('description') as string;
    const type = formData.get('type') as string; // INCOME or EXPENSE

    if (!amount || !category || !dateStr || !type) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        await prisma.transaction.create({
            data: {
                amount,
                category,
                date: new Date(dateStr),
                description,
                type,
                userId,
            },
        });
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to add transaction:', error);

        return { success: false, message: 'Failed to add transaction' };
    }
}

export async function updateTransaction(id: string, formData: FormData) {
    const userId = await getUser();
    if (!userId) {
        return { success: false, message: 'Unauthorized' };
    }

    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const dateStr = formData.get('date') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;

    if (!amount || !category || !dateStr || !type) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        await prisma.transaction.update({
            where: { id, userId },
            data: {
                amount,
                category,
                date: new Date(dateStr),
                description,
                type,
            },
        });
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to update transaction:', error);
        return { success: false, message: 'Failed to update transaction' };
    }
}

export async function deleteTransaction(id: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    try {
        await prisma.transaction.delete({
            where: { id, userId }, // Ensure user owns the transaction
        });
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { success: false, message: 'Failed to delete transaction' };
    }
}

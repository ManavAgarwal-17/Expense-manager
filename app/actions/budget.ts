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

export async function getBudgets() {
    const userId = await getUser();
    if (!userId) return [];

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'short' });
    const currentYear = today.getFullYear();

    // Fetch Budgets
    const budgets = await prisma.budget.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    // Fetch Transactions for this month/year to calculate spent
    // Note: This matches simple month string like 'Jan', 'Feb'. 
    // Ideally we'd filter by date range, but strict schema follows string Month.
    // Actually, transaction has a real Date object. 
    // We should filter transactions that match the current month/year if the budget is for current month.
    // For now we will just calculate 'spent' for the budgets that match current time context or if they are just general goals.
    // Let's assume budgets are "Monthly Goals" that repeat or are set for specific months.
    // To simplify: We'll calculate 'spent' for each budget based on its month/year.

    // Get all relevant transactions
    const transactions = await prisma.transaction.findMany({
        where: { userId, type: 'EXPENSE' }
    });

    const budgetsWithSpent = budgets.map((budget: { month: string; year: number; category: string | null }) => {
        // Find transactions matching budget's month/year and category
        const budgetIsCurrent = budget.month === currentMonth && budget.year === currentYear;

        const relevantTransactions = transactions.filter((t: { date: Date; category: string }) => {
            const tDate = new Date(t.date);
            const tMonth = tDate.toLocaleString('default', { month: 'short' });
            const tYear = tDate.getFullYear();

            const timeMatch = tMonth === budget.month && tYear === budget.year;
            // If category is set, it filters by category.
            const catMatch = budget.category ? t.category === budget.category : true;

            return timeMatch && catMatch;
        });

        const spent = relevantTransactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);
        return { ...budget, spent };
    });

    return budgetsWithSpent;
}

export async function addBudget(formData: FormData) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string || null;
    const month = formData.get('month') as string;
    const year = parseInt(formData.get('year') as string);

    if (!amount || !month || !year) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        await prisma.budget.create({
            data: {
                amount,
                category,
                month,
                year,
                userId,
                spent: 0 // Will be calculated dynamically on read
            }
        });
        revalidatePath('/dashboard/budget');
        return { success: true };
    } catch (error) {
        console.error('Failed to add budget:', error);
        return { success: false, message: 'Failed to add budget' };
    }
}

export async function deleteBudget(id: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    try {
        await prisma.budget.delete({
            where: { id, userId }
        });
        revalidatePath('/dashboard/budget');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to delete budget' };
    }
}

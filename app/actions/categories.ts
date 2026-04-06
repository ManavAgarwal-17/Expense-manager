'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const DEFAULT_EXPENSE_CATEGORIES = [
    'Housing and Utilities',
    'Food and Drinks',
    'Transportation',
    'Personal and Lifestyle',
    'Health and Wellness',
    'Financial and Obligations',
    'Education',
    'Miscellaneous',
];

const DEFAULT_INCOME_CATEGORIES = [
    'Salary',
    'Gifts',
    'Refunds',
    'Reimbursements',
    'Rental',
    'Allowance',
];

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const payload = await verifySession(token);
    return payload ? (payload.userId as string) : null;
}

export async function getCategories() {
    const userId = await getUser();
    if (!userId) return [];

    let categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
    });

    // Lazy seed defaults if user has no categories
    if (categories.length === 0) {
        const expenseData = DEFAULT_EXPENSE_CATEGORIES.map((name) => ({
            name,
            type: 'EXPENSE',
            userId,
        }));
        const incomeData = DEFAULT_INCOME_CATEGORIES.map((name) => ({
            name,
            type: 'INCOME',
            userId,
        }));

        await prisma.category.createMany({
            data: [...expenseData, ...incomeData],
        });

        categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    }

    return categories;
}

export async function addCategory(name: string, type: 'INCOME' | 'EXPENSE') {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    if (!name || !type) {
        return { success: false, message: 'Name and type are required' };
    }

    try {
        await prisma.category.create({
            data: { name, type, userId },
        });
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/transactions');
        revalidatePath('/dashboard/budget');
        return { success: true };
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { success: false, message: 'Category already exists' };
        }
        console.error('Failed to add category:', error);
        return { success: false, message: 'Failed to add category' };
    }
}

export async function updateCategory(id: string, name: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    if (!name) {
        return { success: false, message: 'Name is required' };
    }

    try {
        await prisma.category.update({
            where: { id, userId },
            data: { name },
        });
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/transactions');
        revalidatePath('/dashboard/budget');
        return { success: true };
    } catch (error) {
        console.error('Failed to update category:', error);
        return { success: false, message: 'Failed to update category' };
    }
}

export async function deleteCategory(id: string) {
    const userId = await getUser();
    if (!userId) return { success: false, message: 'Unauthorized' };

    try {
        await prisma.category.delete({
            where: { id, userId },
        });
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/transactions');
        revalidatePath('/dashboard/budget');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { success: false, message: 'Failed to delete category' };
    }
}

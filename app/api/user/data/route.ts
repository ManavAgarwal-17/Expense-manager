import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await verifySession(token);
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.userId as string;

        // Use transaction to ensure atomicity
        await prisma.$transaction([
            prisma.transaction.deleteMany({ where: { userId } }),
            prisma.budget.deleteMany({ where: { userId } }),
            prisma.subscription.deleteMany({ where: { userId } }),
        ]);

        return NextResponse.json({ success: true, message: 'All data reset successfully' });
    } catch (error) {
        console.error('Error resetting data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

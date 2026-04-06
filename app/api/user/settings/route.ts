import { NextResponse } from 'next/server';
// trigger rebuild
import { verifySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';

const updateSettingsSchema = z.object({
    currency: z.string().min(1, 'Currency is required'),
});

export async function PUT(request: Request) {
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

        const body = await request.json();
        const validationResult = updateSettingsSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { currency } = validationResult.data;

        await prisma.user.update({
            where: { id: session.userId as string },
            data: { currency },
        });

        return NextResponse.json({ success: true, message: 'Settings updated' });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

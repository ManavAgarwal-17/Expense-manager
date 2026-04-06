import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { z } from 'zod';
import { cookies } from 'next/headers';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Use generic error for security
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = await createSession(user.id);

        (await cookies()).set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('LOGIN_ERROR:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

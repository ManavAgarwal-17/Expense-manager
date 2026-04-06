import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    profession: z.string().min(1, 'Profession is required'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, dateOfBirth, profession } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                dateOfBirth,
                profession,
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

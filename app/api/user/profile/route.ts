import { NextResponse } from 'next/server';
import { verifySession, verifyPassword, hashPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
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

        const user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                profession: true,
                currency: true,
                dateOfBirth: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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
        const { firstName, lastName, dateOfBirth, profession, currentPassword, newPassword } = body;

        // Prepare update data
        const updateData: any = {
            firstName,
            lastName,
            dateOfBirth,
            profession,
        };

        // Handle password change if requested
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: session.userId as string },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const isValid = await verifyPassword(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
            }

            updateData.password = await hashPassword(newPassword);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: session.userId as string },
            data: updateData,
            select: {
                firstName: true,
                lastName: true,
                email: true,
                profession: true,
                currency: true,
                dateOfBirth: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

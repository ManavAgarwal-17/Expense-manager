import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('session')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifySession(token);

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
        const token = request.cookies.get('session')?.value;
        if (token) {
            const payload = await verifySession(token);
            if (payload) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};

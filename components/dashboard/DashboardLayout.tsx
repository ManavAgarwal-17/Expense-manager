'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import UserProfile from './UserProfile';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Budget', path: '/dashboard/budget' },
        { name: 'Transactions', path: '/dashboard/transactions' },
        { name: 'Subscriptions', path: '/dashboard/subscriptions' },
    ];

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--primary)] selection:text-[var(--background)]">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-white/5 h-20 flex items-center justify-between px-8">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-black font-bold text-xl">
                        EX
                    </div>
                    <span className="text-xl font-medium tracking-tight">Financer</span>
                </div>

                {/* Navigation Tabs */}
                <nav className="hidden md:flex items-center bg-[#1F1F1F] rounded-full p-1.5 border border-white/5 relative">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`relative px-6 py-2 rounded-full font-medium text-sm transition-colors z-10 ${isActive(item.path) ? 'text-black' : 'text-[var(--muted)] hover:text-white'
                                }`}
                        >
                            {isActive(item.path) && (
                                <motion.span
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <UserProfile />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-28 pb-12 px-8 max-w-[1600px] mx-auto animate-in fade-in zoom-in duration-500">
                {children}
            </main>
        </div>
    );
}

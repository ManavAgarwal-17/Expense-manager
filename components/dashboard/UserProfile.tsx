'use client';

import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UserProfile = {
    firstName: string | null;
    lastName: string | null;
    email: string;
};

export default function UserProfile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [imageError, setImageError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/user/profile')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) setUser(data.user);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowLogoutConfirm(false); // Close confirm on outside click
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = () => {
        if (!user) return '?';
        const first = user.firstName?.[0] || '';
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase() || (user.email?.[0] || '?').toUpperCase();
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => { setIsOpen(!isOpen); setShowLogoutConfirm(false); }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border border-white/20 hover:scale-105 transition-transform"
            >
                {getInitials()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1F1F1F] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                    {!showLogoutConfirm ? (
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => { router.push('/dashboard/profile'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left font-medium"
                            >
                                <User size={18} />
                                User Data
                            </button>
                            <button
                                onClick={() => { router.push('/dashboard/settings'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left font-medium"
                            >
                                <Settings size={18} />
                                Settings
                            </button>
                            <div className="h-px bg-white/5 my-1 mx-2" />
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-500/5">
                            <p className="text-white text-sm font-bold mb-3 text-center">Are you sure you want to log out?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-xs hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

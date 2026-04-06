'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
                setIsLoading(false);
            }
        } catch (err) {
            setError('An error occurred');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 rounded-3xl bg-[var(--card)] p-10 shadow-2xl border border-white/5 relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4 border border-white/10">
                        <LogIn className="h-8 w-8 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-[var(--muted)] text-lg">
                        Sign in to continue to Ex Financer
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 flex items-center gap-3"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted)] hover:text-white focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center items-center rounded-xl bg-[var(--primary)] px-4 py-4 text-base font-bold text-black shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="text-center text-sm text-[var(--muted)]">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-white hover:text-[var(--primary)] transition-colors underline decoration-[var(--primary)]/50 underline-offset-4">
                        Register here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

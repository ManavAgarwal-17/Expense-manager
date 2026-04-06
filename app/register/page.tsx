'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, UserPlus, Calendar, Briefcase, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        profession: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const professionOptions = [
        'Student',
        'Employed',
        'Business',
        'Freelancer',
        'Prefer not to say',
        'Other'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Exclude confirmPassword from the payload sent to the API
            const { confirmPassword, ...registrationData } = formData;

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
                setIsLoading(false);
            }
        } catch (err) {
            setError('An error occurred');
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-8 rounded-2xl bg-[var(--card)] p-8 shadow-2xl border border-white/5 text-center"
                >
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/10 p-4 ring-1 ring-green-500/50">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Welcome Aboard!
                    </h2>
                    <p className="text-[var(--muted)] text-lg">
                        Your account has been successfully created. Ready to take control of your finances?
                    </p>
                    <Link
                        href="/login"
                        className="flex w-full justify-center rounded-xl bg-[var(--primary)] px-6 py-4 text-base font-bold text-black shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                        Go to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl space-y-8 rounded-3xl bg-[var(--card)] p-10 shadow-2xl border border-white/5 relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4 border border-white/10">
                        <UserPlus className="h-8 w-8 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-[var(--muted)] text-lg">
                        Join Ex Financer and start smart tracking today
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                                First Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                                </div>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    className="block w-full pl-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                                Last Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                                </div>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    className="block w-full pl-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dateOfBirth" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                            Date of Birth
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                            </div>
                            <input
                                id="dateOfBirth"
                                type="date"
                                required
                                className="block w-full pl-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm [color-scheme:dark]"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="profession" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                            Profession
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                            </div>
                            <select
                                id="profession"
                                required
                                className="block w-full pl-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm appearance-none"
                                value={formData.profession}
                                onChange={handleChange}
                            >
                                <option value="" className="bg-[var(--card)] text-gray-400">Select your profession</option>
                                {professionOptions.map((opt) => (
                                    <option key={opt} value={opt} className="bg-[var(--card)] text-white">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {/* Custom arrow icon */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={handleChange}
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
                                minLength={8}
                                className="block w-full pl-10 pr-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={handleChange}
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

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                            </div>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                minLength={8}
                                className="block w-full pl-10 pr-10 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-[var(--primary)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all sm:text-sm"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted)] hover:text-white focus:outline-none transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center items-center rounded-xl bg-[var(--primary)] px-4 py-4 text-base font-bold text-black shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-[var(--muted)]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-white hover:text-[var(--primary)] transition-colors underline decoration-[var(--primary)]/50 underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

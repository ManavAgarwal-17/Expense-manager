'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Save, Check, User, Mail, Calendar, Briefcase, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function SettingsPage() {
    // User Profile API State
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        profession: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    // Password Visibility State
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [currency, setCurrency] = useState('₹');
    const [loading, setLoading] = useState(true);
    const [savingCurrency, setSavingCurrency] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    const [isResetting, setIsResetting] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null);

    const professionOptions = [
        'Student',
        'Employed',
        'Business',
        'Freelancer',
        'Prefer not to say',
        'Other'
    ];

    useEffect(() => {
        fetch('/api/user/profile')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setCurrency(data.user.currency || '₹');
                    setProfileData({
                        firstName: data.user.firstName || '',
                        lastName: data.user.lastName || '',
                        dateOfBirth: data.user.dateOfBirth || '',
                        profession: data.user.profession || '',
                        email: data.user.email || '',
                    });
                }
                setLoading(false);
            });
    }, []);

    const handleUpdateCurrency = async (newCurrency: string) => {
        setCurrency(newCurrency); // Optimistic update
        setSavingCurrency(true);
        try {
            await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currency: newCurrency }),
            });
        } finally {
            setTimeout(() => setSavingCurrency(false), 500);
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfileData({ ...profileData, [e.target.id]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileError('');
        setProfileSuccess('');

        // Basic validation
        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setProfileError('New passwords do not match');
                setSavingProfile(false);
                return;
            }
            if (!passwordData.currentPassword) {
                setProfileError('Current password is required to change password');
                setSavingProfile(false);
                return;
            }
        }

        try {
            const payload = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                dateOfBirth: profileData.dateOfBirth,
                profession: profileData.profession,
                ...(passwordData.newPassword ? {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                } : {})
            };

            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setProfileSuccess('Profile updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset password fields
                setTimeout(() => setProfileSuccess(''), 3000);
            } else {
                setProfileError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setProfileError('An error occurred while saving');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleResetData = async () => {
        setIsResetting(true);
        const res = await fetch('/api/user/data', { method: 'DELETE' });
        if (res.ok) {
            window.location.href = '/dashboard'; // Redirect to refresh widgets
        }
        setIsResetting(false);
        setConfirmAction(null);
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        const res = await fetch('/api/user/account', { method: 'DELETE' });
        if (res.ok) {
            window.location.href = '/'; // Redirect to home/login
        }
        setIsDeletingAccount(false);
        setConfirmAction(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Settings
                </h1>
                <p className="text-[var(--muted)] mt-2">Manage your profile, preferences and data.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* User Data Section */}
                <section className="bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-[var(--primary)]" size={24} />
                        User Data
                    </h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--muted)]">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--muted)]">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[var(--muted)]">Date of Birth</label>
                                <div className="relative">
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        value={profileData.dateOfBirth}
                                        onChange={handleProfileChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors [color-scheme:dark]"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="profession" className="block text-sm font-medium text-[var(--muted)]">Profession</label>
                                <div className="relative">
                                    <select
                                        id="profession"
                                        value={profileData.profession}
                                        onChange={handleProfileChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none"
                                    >
                                        <option value="" className="bg-[#18181b]">Select Profession</option>
                                        {professionOptions.map(opt => (
                                            <option key={opt} value={opt} className="bg-[#18181b]">{opt}</option>
                                        ))}
                                    </select>
                                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" size={18} />
                                </div>
                            </div>

                            {/* Read-only Email */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--muted)]">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[var(--muted)] cursor-not-allowed"
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-50" size={18} />
                                </div>
                                <p className="text-xs text-[var(--muted)]">Email cannot be changed.</p>
                            </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-[var(--muted)]">Current Password</label>
                                    <div className="relative">
                                        <input
                                            id="currentPassword"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white">
                                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--muted)]">New Password</label>
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white">
                                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--muted)]">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white">
                                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {profileError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {profileError}
                            </div>
                        )}
                        {profileSuccess && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <Check size={16} />
                                {profileSuccess}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="px-8 py-3 bg-[var(--primary)] text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                            >
                                {savingProfile ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/50 border-t-black rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* General Settings */}
                <section className="bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        Preferences
                        {savingCurrency && <span className="text-xs text-green-400 font-normal flex items-center gap-1 animate-in fade-in"><Check size={12} /> Saved</span>}
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-4">Currency Symbol</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['₹', '$', '€', '£'].map((sym) => (
                                <button
                                    key={sym}
                                    onClick={() => handleUpdateCurrency(sym)}
                                    className={`h-14 rounded-xl border flex items-center justify-center text-xl transition-all ${currency === sym
                                        ? 'bg-[var(--primary)] text-black border-[var(--primary)] font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-[var(--muted)]'
                                        }`}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-4">Selected currency will apply to all transactions and budgets.</p>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
                    <h2 className="text-red-400 text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertTriangle size={24} />
                        Danger Zone
                    </h2>

                    <div className="space-y-8">
                        {/* Reset Data */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-red-500/10">
                            <div>
                                <h3 className="font-medium text-white mb-1">Reset Application Data</h3>
                                <p className="text-sm text-[var(--muted)]">
                                    Permanently delete all transactions, budgets, subscriptions, and reset your account to a clean slate.
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmAction('reset')}
                                className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium whitespace-nowrap"
                            >
                                Reset All Data
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="font-medium text-white mb-1 text-red-400">Delete Account</h3>
                                <p className="text-sm text-[var(--muted)]">
                                    Permanently delete your entire account, including all personal information and financial data. This action is irreversible.
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmAction('delete')}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold whitespace-nowrap shadow-lg shadow-red-900/40"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </section>
            </motion.div>

            {/* Confirm Dialogs */}
            <ConfirmDialog
                isOpen={confirmAction === 'reset'}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleResetData}
                title="Reset All Data?"
                message="This will permanently delete all your transactions, budgets, and subscriptions. Your account settings will remain, but all financial data will be gone."
                confirmText="Reset Everything"
                isLoading={isResetting}
            />

            <ConfirmDialog
                isOpen={confirmAction === 'delete'}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleDeleteAccount}
                title="Delete Your Account?"
                message="Are you absolutely sure? This will permanently delete your account and all associated data. You will be logged out and will not be able to recover any information."
                confirmText="Permanently Delete Account"
                isLoading={isDeletingAccount}
            />
        </div>
    );
}

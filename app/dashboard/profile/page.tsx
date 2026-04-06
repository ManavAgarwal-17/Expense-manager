'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Mail, Briefcase, Calendar, Clock, Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/app/actions/categories';

type UserProfileData = {
    firstName: string | null;
    lastName: string | null;
    email: string;
    profession: string | null;
    dateOfBirth: string | null;
    createdAt: string;
    currency: string;
};

type Category = {
    id: string;
    name: string;
    type: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/profile')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) setUser(data.user);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const fetchCategories = useCallback(async () => {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
        setCategoriesLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return <div className="text-center text-[var(--muted)]">Failed to load profile.</div>;

    const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
    const incomeCategories = categories.filter((c) => c.type === 'INCOME');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    User Data
                </h1>
                <p className="text-[var(--muted)] mt-2">Personal information associated with your account.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-32 bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="col-span-2 flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-[#18181b]">
                            {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-[var(--muted)]">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <InfoItem icon={<Mail className="text-blue-400" />} label="Email Address" value={user.email} />
                    <InfoItem icon={<Briefcase className="text-purple-400" />} label="Profession" value={user.profession || 'Not set'} />
                    {user.dateOfBirth && (
                        <>
                            <InfoItem icon={<Calendar className="text-green-400" />} label="Date of Birth" value={user.dateOfBirth} />
                            <InfoItem icon={<Clock className="text-orange-400" />} label="Age" value={`${calculateAge(user.dateOfBirth)} years old`} />
                        </>
                    )}
                </div>
            </motion.div>

            {/* Categories Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
                <h2 className="text-2xl font-bold mb-6">Customizations</h2>
                <p className="text-[var(--muted)] mb-6">Manage your expense and income categories.</p>

                {categoriesLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        <CategoryList
                            title="Expense Categories"
                            type="EXPENSE"
                            categories={expenseCategories}
                            onRefresh={fetchCategories}
                        />
                        <CategoryList
                            title="Income Categories"
                            type="INCOME"
                            categories={incomeCategories}
                            onRefresh={fetchCategories}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="p-2 bg-[#18181b] rounded-lg border border-white/10">
                {icon}
            </div>
            <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-medium mb-1">{label}</p>
                <p className="font-medium text-lg">{value}</p>
            </div>
        </div>
    );
}

function CategoryList({
    title,
    type,
    categories,
    onRefresh,
}: {
    title: string;
    type: 'INCOME' | 'EXPENSE';
    categories: Category[];
    onRefresh: () => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setAddLoading(true);
        const res = await addCategory(newName.trim(), type);
        setAddLoading(false);
        if (res.success) {
            setNewName('');
            setIsAdding(false);
            onRefresh();
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-2 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Category name"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[var(--muted)]"
                        autoFocus
                    />
                    <button
                        onClick={handleAdd}
                        disabled={addLoading}
                        className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                    >
                        {addLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button
                        onClick={() => { setIsAdding(false); setNewName(''); }}
                        className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat) => (
                    <CategoryItem key={cat.id} category={cat} onRefresh={onRefresh} />
                ))}
                {categories.length === 0 && (
                    <p className="text-[var(--muted)] text-sm text-center py-4">No categories yet.</p>
                )}
            </div>
        </div>
    );
}

function CategoryItem({ category, onRefresh }: { category: Category; onRefresh: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(category.name);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!editName.trim() || editName.trim() === category.name) {
            setIsEditing(false);
            return;
        }
        setLoading(true);
        const res = await updateCategory(category.id, editName.trim());
        setLoading(false);
        if (res.success) {
            setIsEditing(false);
            onRefresh();
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${category.name}"?`)) return;
        setLoading(true);
        const res = await deleteCategory(category.id);
        setLoading(false);
        if (res.success) {
            onRefresh();
        } else {
            alert(res.message);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white"
                    autoFocus
                />
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                </button>
                <button
                    onClick={() => { setIsEditing(false); setEditName(category.name); }}
                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
            <span className="text-white">{category.name}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
            </div>
        </div>
    );
}

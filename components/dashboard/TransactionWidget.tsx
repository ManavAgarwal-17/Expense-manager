'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import TransactionList from './TransactionList';
import TransactionEditor from './TransactionEditor';

interface Transaction {
    id: string;
    amount: number;
    type: string;
    category: string;
    date: Date;
    description: string | null;
}

export default function TransactionWidget({ transactions, currency = '₹' }: { transactions: Transaction[], currency?: string }) {
    const [view, setView] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
    const [editData, setEditData] = useState<Transaction | null>(null);

    const handleEdit = (transaction: Transaction) => {
        setEditData(transaction);
        setView('EDIT');
    };

    const handleSuccess = () => {
        setView('LIST');
        setEditData(null);
    };

    return (
        <div className="bg-[var(--card)] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                    {view === 'LIST' ? 'Transactions' : view === 'ADD' ? 'Add Transaction' : 'Edit Transaction'}
                </h3>
                {view === 'LIST' ? (
                    <button
                        onClick={() => setView('ADD')}
                        className="flex items-center gap-2 text-sm bg-[var(--primary)] text-black px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
                    >
                        <Plus size={16} /> Add New
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setView('LIST');
                            setEditData(null);
                        }}
                        className="text-[var(--muted)] hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="p-0 flex-1 overflow-auto">
                {view === 'LIST' && (
                    <TransactionList transactions={transactions} onEdit={handleEdit} currency={currency} />
                )}

                {view === 'ADD' && (
                    <div className="p-6">
                        <TransactionEditor
                            onSuccess={handleSuccess}
                            onCancel={() => setView('LIST')}
                        />
                    </div>
                )}

                {view === 'EDIT' && editData && (
                    <div className="p-6">
                        <TransactionEditor
                            initialData={editData}
                            onSuccess={handleSuccess}
                            onCancel={() => {
                                setView('LIST');
                                setEditData(null);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

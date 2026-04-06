'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-[var(--card)] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--muted)] hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertTriangle className="text-red-500" size={24} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-[var(--muted)] mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import profileService from '../../services/profile.service';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const handleChangePassword = async (data) => {
        setSaving(true);
        try {
            await profileService.changePassword(data);
            toast.success('Password changed successfully.');
            navigate('/profile');
        } catch (err) {
            const body = err?.response?.data;
            toast.error(body?.errors?.[0]?.msg || body?.message || 'Failed to change password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <SEO
                title="Change Password | Edge Mile Realty"
                description="Update your account password to keep your Edge Mile Realty account secure."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
                            <circle cx="680" cy="100" r="160" stroke="#8BC53F" strokeWidth="1" />
                            <circle cx="680" cy="100" r="110" stroke="#8BC53F" strokeWidth="1" />
                            <path d="M0 150 L200 90 L400 130 L600 70 L800 110" stroke="#8BC53F" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors group mb-4"
                        >
                            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                            <KeyRound size={14} className="text-[#8BC53F]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                                Security
                            </span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                            Change Password
                        </h1>
                        <p className="text-white/55 text-sm mt-3 max-w-lg">
                            Update your account password regularly to keep listings and leads protected.
                        </p>
                    </div>
                </div>

                <div className="max-w-md mx-auto px-4 sm:px-6 -mt-6 relative z-10">
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-6 sm:p-7">
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-700 mb-6">
                            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                            <p className="leading-relaxed font-medium">
                                Changing your password will sign you out of other active sessions on this account.
                            </p>
                        </div>

                        <ChangePasswordForm
                            onSubmit={handleChangePassword}
                            loading={saving}
                            onCancel={() => navigate('/profile')}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

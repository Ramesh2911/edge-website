import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, ArrowLeft } from 'lucide-react';
import SEO from '../../components/Contact/SEO';

// Folder-mapped absolute import matching your exact workspace layout
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

export default function ChangePassword() {
    const navigate = useNavigate();

    return (
        <>
            <SEO
                title="Update Security Token | Secure Portal"
                description="Change your platform profile password parameters to ensure constant data isolation and control security."
            />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-6">

                    {/* Back Navigation Shortcut */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        Return to Dashboard
                    </button>

                    {/* Core Page Wrapper Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-xl space-y-6">

                        {/* Context Heading */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security Credentials</h1>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Update your application authentication passphrase regularly to protect listing records and programmatic developer access keys.
                            </p>
                        </div>

                        {/* Warning Layer Notification */}
                        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl flex items-start gap-3 text-xs text-amber-700 dark:text-amber-400">
                            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="leading-normal">
                                Executing a modification payload will instantly terminate all other active browser login sessions assigned to this profile context.
                            </p>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-700" />

                        {/* Injecting your pre-existing Form component directly */}
                        <ChangePasswordForm onComplete={() => navigate('/profile')} />

                    </div>
                </div>
            </main>
        </>
    );
}
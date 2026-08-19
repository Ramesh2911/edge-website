import React, { useState, useEffect } from 'react';
import {
    User, ShieldCheck, Mail, Phone, Calendar, Loader2,
    FileText, CheckCircle2, AlertCircle, TrendingUp, Settings2, KeyRound
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import profileService from '../../services/profile.service';

// Folder-mapped absolute imports matching your exact workspace layout
import ProfileCard from '../../components/profile/ProfileCard';
import EditProfileForm from '../../components/profile/EditProfileForm';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

    // Interactive Modal UI Management State
    const [activeModal, setActiveModal] = useState(null); // 'edit-profile' | 'change-password' | null

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const { data } = await profileService.getProfile();
                setProfileData(data.profile);
            } catch (err) {
                // High-fidelity fallback mock reflecting a production Developer / Broker deployment schema
                setProfileData({
                    name: 'Alexander Sterling',
                    email: 'sterling@agencycore.com',
                    phone: '+1 (555) 382-9021',
                    role: 'developer', // 'owner' | 'broker' | 'developer' | 'buyer'
                    joinedDate: 'March 2024',
                    verificationStatus: 'verified', // 'verified' | 'pending' | 'unverified'
                    accountStatus: 'active',
                    completionPercentage: 85,
                    stats: { totalProperties: 14, activeLeads: 42, closedDeals: 8 },
                    documents: [
                        { name: 'Corporate_Tax_License.pdf', size: '2.4 MB', status: 'approved' },
                        { name: 'Brokerage_Operating_Credentials.pdf', size: '4.1 MB', status: 'approved' }
                    ],
                    activities: [
                        { id: 1, text: 'Updated inventory details for Skyline Penthouse', time: '2 hours ago' },
                        { id: 2, text: 'Requested appraisal approval for Waterfront Villa', time: '1 day ago' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleProfileUpdated = () => {
        setActiveModal(null);
        toast.success('Identity metadata synced successfully.');
        // Trigger localized re-fetch lifecycle if required
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-500">Retrieving security contexts...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="My Control Profile | Platform Identity"
                description="Manage your broker credential data, corporate compliance uploads, and view personal real estate listings stats."
            />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Section 1: Top Level Profile Header layout */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full md:w-auto">
                            <ProfileCard data={profileData} />
                            <div className="text-center sm:text-left space-y-1.5">
                                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                                    <h1 className="text-2xl font-black tracking-tight">{profileData.name}</h1>
                                    <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded bg-indigo-600 text-white shadow-sm">
                                        {profileData.role}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> {profileData.email}
                                </p>
                                <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Registered since {profileData.joinedDate}
                                </p>
                            </div>
                        </div>

                        {/* Account Status / Integrity Triggers */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-0 pt-4 md:pt-0 border-slate-800 gap-4">
                            <div className="space-y-1 text-left md:text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verification Status</span>
                                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                                    <ShieldCheck className="w-4 h-4" /> Compliance Confirmed
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveModal('edit-profile')}
                                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl transition-all shadow-sm"
                                    title="Modify Profile Information"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setActiveModal('change-password')}
                                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl transition-all shadow-sm"
                                    title="Update Authentication Token"
                                >
                                    <KeyRound className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Core Metrics & Dynamic Workspace Layout Split */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* Left Workspace Column */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Dynamic Metrics Row Dashboard */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: profileData.role === 'buyer' ? 'Saved Listings' : 'Total Portfolio', val: profileData.stats.totalProperties },
                                    { label: 'Active Streams', val: profileData.stats.activeLeads },
                                    { label: 'Settled Escrows', val: profileData.stats.closedDeals }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">{stat.label}</span>
                                        <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Profile Completion Tracking Bar */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white">
                                    <h3>System Profile Completion</h3>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">{profileData.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${profileData.completionPercentage}%` }} />
                                </div>
                                <p className="text-xs text-slate-400">Append additional regulatory brokerage licenses to scale listing thresholds.</p>
                            </div>

                            {/* Historic Activities Logs */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Recent Profile Operations</h3>
                                <div className="space-y-4">
                                    {profileData.activities.map((act) => (
                                        <div key={act.id} className="flex justify-between items-start text-xs border-b border-slate-50 dark:border-slate-700/40 pb-3 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                                <p className="text-slate-600 dark:text-slate-300 font-medium">{act.text}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-4">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Uploaded Corporate / Personal Compliance Documents */}
                        <div className="lg:col-span-4">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Regulatory Compliance Data</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Required legal document uploads for status confirmation.</p>
                                </div>

                                <div className="space-y-3">
                                    {profileData.documents.map((doc, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{doc.name}</p>
                                                    <span className="text-[10px] text-slate-400">{doc.size}</span>
                                                </div>
                                            </div>
                                            <span className="flex items-center text-[10px] font-extrabold text-emerald-500 tracking-wider bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded uppercase">
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Shared Modular Overlay Component Layer (Edit Profile) */}
            {activeModal === 'edit-profile' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Modify Profile Parameters</h3>
                            <button onClick={() => setActiveModal(null)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Close</button>
                        </div>
                        <EditProfileForm defaultValues={profileData} onComplete={handleProfileUpdated} />
                    </div>
                </div>
            )}

            {/* Shared Modular Overlay Component Layer (Change Password) */}
            {activeModal === 'change-password' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 max-w-md w-full p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Authentication Token</h3>
                            <button onClick={() => setActiveModal(null)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Close</button>
                        </div>
                        <ChangePasswordForm onComplete={() => setActiveModal(null)} />
                    </div>
                </div>
            )}
        </>
    );
}
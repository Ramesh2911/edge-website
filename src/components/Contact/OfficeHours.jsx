import { Clock } from 'lucide-react';

export default function OfficeHours() {
    const schedule = [
        { days: 'Monday – Friday', hours: '8:00 AM – 7:00 PM EST' },
        { days: 'Saturday', hours: '9:00 AM – 4:00 PM EST' },
        { days: 'Sunday', hours: 'Private Appointments Only' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600">
                    <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Brokerage Hours</h3>
            </div>
            <div className="space-y-4">
                {schedule.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-600 dark:text-slate-400">{item.days}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{item.hours}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
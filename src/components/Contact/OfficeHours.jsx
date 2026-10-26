import { Clock } from 'lucide-react';
import usePageContent from '../../hooks/usePageContent';

const DEFAULT_SCHEDULE = [
    { days: 'Monday – Friday', hours: '8:00 AM – 7:00 PM EST' },
    { days: 'Saturday', hours: '9:00 AM – 4:00 PM EST' },
    { days: 'Sunday', hours: 'Private Appointments Only' },
];

const parseHours = (raw) => {
    const rows = String(raw || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            const idx = line.indexOf('|');
            if (idx < 1) return null;
            const days = line.slice(0, idx).trim();
            const hours = line.slice(idx + 1).trim();
            return days && hours ? { days, hours } : null;
        })
        .filter(Boolean);
    return rows.length ? rows : DEFAULT_SCHEDULE;
};

export default function OfficeHours() {
    const content = usePageContent();
    const schedule = parseHours(content.contact_hours);

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
                    <div key={i} className="flex justify-between items-center gap-3 text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-600 dark:text-slate-400">{item.days}</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{item.hours}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

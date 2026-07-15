import { Phone, Mail, MapPin, Share2 } from 'lucide-react';

export default function ContactInfoCards() {
    const methods = [
        { icon: <Phone className="w-5 h-5 text-indigo-600" />, title: 'Direct Line', detail: '+1 (800) 555-REAL', link: 'tel:+18005557325' },
        { icon: <Mail className="w-5 h-5 text-indigo-600" />, title: 'Client Concierge', detail: 'advisors@agency.com', link: 'mailto:advisors@agency.com' },
        { icon: <MapPin className="w-5 h-5 text-indigo-600" />, title: 'HQ Office', detail: '750 5th Ave, New York, NY', link: '#map' },
    ];

    return (
        <div className="grid sm:grid-cols-3 gap-6 -mt-28 relative z-20">
            {methods.map((m, i) => (
                <a href={m.link} key={i} className="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4">{m.icon}</div>
                    <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{m.title}</h4>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 break-words">{m.detail}</p>
                </a>
            ))}
        </div>
    );
}
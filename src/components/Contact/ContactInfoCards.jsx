import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import footerService from '../../services/footer.service';

export default function ContactInfoCards() {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        let alive = true;
        footerService
            .getFooter()
            .then((res) => {
                if (alive) setContact(res?.data?.data?.contact || null);
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    const phone = contact?.phone || '(+91) 8585033913';
    const email = contact?.email || 'info@edgemilerealty.com';
    const address = contact?.address || '59/1 Panchanan Tala Road, Howrah- 711101';

    const methods = [
        {
            icon: <Phone className="w-5 h-5 text-indigo-600" />,
            title: 'Direct Line',
            detail: phone,
            link: `tel:${String(phone).replace(/[^+\d]/g, '')}`,
        },
        {
            icon: <Mail className="w-5 h-5 text-indigo-600" />,
            title: 'Client Concierge',
            detail: email,
            link: `mailto:${email}`,
        },
        {
            icon: <MapPin className="w-5 h-5 text-indigo-600" />,
            title: 'HQ Office',
            detail: address,
            link: '#map',
        },
    ];

    return (
        <div className="grid sm:grid-cols-3 gap-6 -mt-12 sm:-mt-28 relative z-20">
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

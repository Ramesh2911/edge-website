import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import usePageContent from '../../hooks/usePageContent';

const DEFAULT_FAQS = [
    { q: 'What documentation do I need to prepare for an asset appraisal?', a: 'For a precise primary luxury asset evaluation, have current title records, property survey plans, and tax history ready for our specialist analysis.' },
    { q: 'Can I request out-of-hours or holiday viewings?', a: 'Yes, premium account tiers have access to direct off-schedule VIP walkthroughs, coordinated through your specific point-of-contact advisor.' },
    { q: 'How long does the corporate legal onboarding process take?', a: 'Standard corporate acquisitions clear within 7 to 14 standard legal days, entirely managed under our automated escrow pipelines.' },
];

const parseFaqs = (raw) => {
    const rows = String(raw || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            const idx = line.indexOf('|');
            if (idx < 1) return null;
            const q = line.slice(0, idx).trim();
            const a = line.slice(idx + 1).trim();
            return q && a ? { q, a } : null;
        })
        .filter(Boolean);
    return rows.length ? rows : DEFAULT_FAQS;
};

export default function ContactFAQ() {
    const content = usePageContent();
    const faqs = parseFaqs(content.contact_faq);

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">Frequently Asked Inquiries</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => {
                    const isOpen = activeIndex === i;
                    return (
                        <div key={i} className="border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setActiveIndex(isOpen ? null : i)}
                                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 border-t border-slate-100 dark:border-slate-700' : 'max-h-0'}`}>
                                <p className="p-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

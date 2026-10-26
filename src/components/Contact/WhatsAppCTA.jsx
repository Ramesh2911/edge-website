import { MessageSquare } from 'lucide-react';
import usePageContent from '../../hooks/usePageContent';

export default function WhatsAppCTA() {
    const content = usePageContent();
    const waNumber = String(content.contact_whatsapp || '918585033913').replace(/[^\d]/g, '');

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Instant Agent Dispatch</h3>
                    <p className="text-sm text-emerald-50 mt-1 mb-5">
                        Prefer instant messenger channels? Chat dynamically with an active on-duty broker on WhatsApp.
                    </p>
                    <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white text-emerald-600 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-50 transition"
                    >
                        Launch WhatsApp Chat
                    </a>
                </div>
            </div>
        </div>
    );
}

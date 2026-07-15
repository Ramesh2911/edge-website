// components/ContactForm.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Buying', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let localErrors = {};
        if (!formData.name.trim()) localErrors.name = 'Full name is required';
        if (!formData.email) {
            localErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            localErrors.email = 'Please provide a valid email format';
        }
        if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s+/g, ''))) {
            localErrors.phone = 'Please enter a valid international phone number';
        }
        if (!formData.message.trim() || formData.message.length < 10) {
            localErrors.message = 'Message must be at least 10 characters long';
        }
        setErrors(localErrors);
        return Object.keys(localErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' })); // Clear error dynamically
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return toast.error('Please resolve form formatting issues.');

        setIsSubmitting(true);
        try {
            // Production API Simulation
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Network payload rejected');

            toast.success('Inquiry submitted! An advisor will reach out shortly.');
            setFormData({ name: '', email: '', phone: '', subject: 'Buying', message: '' });
        } catch (error) {
            toast.error('System error occurred. Please try again or call us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send Us A Message</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Our customer experience agents reply within 2 hours.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors focus:ring-2 outline-none ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-100 dark:focus:ring-indigo-900/40'}`} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors focus:ring-2 outline-none ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-100 dark:focus:ring-indigo-900/40'}`} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors focus:ring-2 outline-none ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-100 dark:focus:ring-indigo-900/40'}`} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquiry Purpose</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40">
                        <option value="Buying">Buying a Property</option>
                        <option value="Selling">Selling/Listing a Property</option>
                        <option value="Asset Management">Asset Management</option>
                        <option value="Partnership">Corporate Partnership</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message Details *</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors focus:ring-2 outline-none resize-none ${errors.message ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-100 dark:focus:ring-indigo-900/40'}`} />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</> : 'Send Secure Inquiry'}
            </button>
        </form>
    );
}
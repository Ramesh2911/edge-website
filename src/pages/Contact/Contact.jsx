import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; 
import SEO from '../../components/Contact/SEO';
import ContactHero from '../../components/Contact/ContactHero';
import ContactInfoCards from '../../components/Contact/ContactInfoCards';
import ContactForm from '../../components/Contact/ContactForm';
import LocationMap from '../../components/Contact/LocationMap';
import OfficeHours from '../../components/Contact/OfficeHours';
import ContactFAQ from '../../components/Contact/ContactFAQ';
import WhatsAppCTA from '../../components/Contact/WhatsAppCTA';

const Contact = () => {
    return (
        <>
            <SEO
                title="Contact Our Luxury Real Estate Experts | Get In Touch"
                description="Have questions about a premium listing or looking to sell? Contact our expert real estate advisors today for tailored real estate solutions."
                keywords="contact real estate, luxury real estate broker, office locations, property advisory"
            />

            {/* Toast notifications container mounted at top level */}
            <Toaster position="top-right" reverseOrder={false} />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden"
            >
                <ContactHero />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
                    <ContactInfoCards />

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/60">
                            <ContactForm />
                        </div>
                        <div className="lg:col-span-5 space-y-8">
                            <OfficeHours />
                            <WhatsAppCTA />
                        </div>
                    </div>

                    <LocationMap />
                    <ContactFAQ />
                </div>
            </motion.main>
        </>
    );
};

export default Contact;
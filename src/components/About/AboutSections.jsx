import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2, Target, Eye, ShieldCheck, Award,
    Users, Key, TrendingUp, CheckCircle2, Star, ArrowRight
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
};

// 1. HERO BANNER
export const HeroBanner = () => (
    <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-0" />

        <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm mb-3 block">
                Redefining Modern Living
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Architecting Dreams into Reality
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                We bridge the gap between extraordinary properties and discerning buyers across the globe.
            </p>
        </motion.div>
    </section>
);

// 2. COMPANY INTRO & MISSION & VISION
export const CompanyOverview = () => (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="grid md:grid-cols-2 gap-12 items-center mb-20"
            >
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                        Pioneering Excellence in Luxury Real Estate
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Founded with a vision to revolutionize real estate transactions, Elite Haven has grown into a premier brokerage trusted by high-net-worth individuals, investors, and families worldwide.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We fuse deep local market expertise with cutting-edge market analytics to deliver an unparalleled property search and acquisition experience.
                    </p>
                </div>
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
                        alt="Modern Office"
                        className="rounded-2xl shadow-2xl object-cover h-96 w-full"
                    />
                </div>
            </motion.div>

            {/* Mission & Vision Cards */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="grid md:grid-cols-2 gap-8"
            >
                <motion.div variants={fadeUp} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
                    <p className="text-slate-600 leading-relaxed">
                        To empower clients through transparent data, exceptional advisory services, and a seamless digital platform that makes acquiring premier property simple and gratifying.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h3>
                    <p className="text-slate-600 leading-relaxed">
                        To set the global benchmark for integrity, luxury branding, and prop-tech innovation in the real estate sector for generations to come.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// 3. STATS & WHY CHOOSE US
export const StatsAndValue = () => {
    const stats = [
        { value: '$2.4B+', label: 'Volume Sold' },
        { value: '1,200+', label: 'Properties Managed' },
        { value: '99.2%', label: 'Client Satisfaction' },
        { value: '15+', label: 'Years Experience' },
    ];

    const features = [
        { title: 'Vetted Portfolio', desc: 'Every property undergoes a rigorous 50-point physical & legal inspection.', icon: ShieldCheck },
        { title: 'Data-Driven Insights', desc: 'Real-time neighborhood trends and long-term yield projections.', icon: TrendingUp },
        { title: 'End-to-End Concierge', desc: 'Legal, financial, and interior design advisory under one roof.', icon: Key },
    ];

    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-20 border-b border-slate-800 text-center"
                >
                    {stats.map((s, idx) => (
                        <motion.div key={idx} variants={fadeUp}>
                            <div className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-2">{s.value}</div>
                            <div className="text-slate-400 font-medium text-sm md:text-base">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Why Choose Us */}
                <div className="pt-20">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Discerning Clients Choose Us</h2>
                        <p className="text-slate-400">Excellence isn't an accident—it's our standard operating procedure.</p>
                    </div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((f, idx) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={idx} variants={fadeUp} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                                    <Icon className="w-10 h-10 text-amber-400 mb-6" />
                                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// 4. OUR SERVICES & CUSTOMER JOURNEY
export const ServicesAndJourney = () => {
    const steps = [
        { num: '01', title: 'Consultation', desc: 'Understanding your investment criteria and lifestyle desires.' },
        { num: '02', title: 'Curation', desc: 'Presenting off-market and hand-selected luxury residences.' },
        { num: '03', title: 'Acquisition', desc: 'Seamless negotiation, legal due diligence, and closing.' },
        { num: '04', title: 'Management', desc: 'Post-purchase property setup and yield management.' },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Acquisition Journey</h2>
                    <p className="text-slate-600">A structured four-step path to secure your property effortlessly.</p>
                </div>

                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, idx) => (
                        <motion.div key={idx} variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                            <span className="text-5xl font-black text-amber-500/20 absolute top-4 right-6">{step.num}</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">{step.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// 5. MEET OUR TEAM
export const TeamSection = () => {
    const team = [
        { name: 'Sarah Jenkins', role: 'Managing Principal & Founder', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80' },
        { name: 'David Chen', role: 'Head of Global Acquisitions', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80' },
        { name: 'Elena Rostova', role: 'Director of Luxury Estates', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Leadership Team</h2>
                    <p className="text-slate-600">Industry veterans driven by integrity, passion, and innovation.</p>
                </div>

                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {team.map((member, idx) => (
                        <motion.div key={idx} variants={fadeUp} className="group overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="overflow-hidden">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                <p className="text-amber-600 text-sm font-medium mt-1">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// 6. TESTIMONIALS & CTA
export const TestimonialsAndCTA = () => (
    <>
        <section className="py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="flex justify-center gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-amber-500" />)}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-snug">
                    "Elite Haven made purchasing our coastal estate smooth beyond expectation. Their market foresight and discretion are completely unmatched."
                </blockquote>
                <cite className="not-italic text-slate-600 font-semibold block">
                    Marcus & Eleanor Vance — Estate Buyers
                </cite>
            </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-amber-600 text-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Find Your Dream Property?</h2>
                <p className="text-amber-100 text-lg max-w-2xl mx-auto mb-8">
                    Get in touch with our team of advisors to explore exclusive listings today.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
                >
                    Contact an Advisor <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    </>
);
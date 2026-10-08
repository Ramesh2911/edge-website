import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Target, Eye, ShieldCheck, Award,
    Key, TrendingUp, Star, ArrowRight, Quote
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
};

const Eyebrow = ({ children, dark = false }) => (
    <span className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${dark ? 'text-[#8BC53F]' : 'text-[#6FA82C]'}`}>
        {children}
    </span>
);

// 1. HERO BANNER
export const HeroBanner = () => (
    <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
                alt="Luxury residence"
                className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#153964]/95 via-[#1E4C8C]/85 to-[#1E4C8C]/60" />
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#8BC53F]/25 blur-3xl z-0" />
        <div className="absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full bg-[#7CB93D]/20 blur-3xl z-0" />

        <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            className="relative z-10 max-w-4xl mx-auto text-center px-5 py-24"
        >
            <Eyebrow dark>Redefining Modern Living</Eyebrow>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.08] font-medium mb-6 text-[#F7FAFC]">
                Architecting Dreams
                <br className="hidden sm:block" /> into <span className="italic text-[#8BC53F]">Reality</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F7FAFC]/75 max-w-2xl mx-auto">
                We bridge the gap between extraordinary properties and discerning buyers across the globe.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
                <Link
                    to="/properties"
                    className="bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-7 py-3.5 shadow-lift"
                >
                    Explore Properties
                </Link>
                <Link
                    to="/contact"
                    className="border border-white/30 hover:border-[#8BC53F] text-white font-semibold text-sm rounded-xl px-7 py-3.5 transition-colors"
                >
                    Talk to an Advisor
                </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                {[
                    { big: '1,200+', small: 'Properties Managed' },
                    { big: '99.2%', small: 'Client Satisfaction' },
                    { big: '15+', small: 'Years of Trust' },
                ].map((c) => (
                    <div key={c.small} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-4 py-2.5 text-left">
                        <p className="font-display text-base text-[#8BC53F] font-semibold leading-none">{c.big}</p>
                        <p className="text-[11px] text-[#F7FAFC]/70 mt-1">{c.small}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    </section>
);

// 2. COMPANY INTRO & MISSION & VISION
export const CompanyOverview = () => (
    <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="grid md:grid-cols-2 gap-12 items-center mb-16"
            >
                <div>
                    <Eyebrow>Who We Are</Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium mb-6 leading-tight">
                        Pioneering Excellence in Luxury Real Estate
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Founded with a vision to revolutionize real estate transactions, Edge Realty has grown into a premier brokerage trusted by high-net-worth individuals, investors, and families worldwide.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We fuse deep local market expertise with cutting-edge market analytics to deliver an unparalleled property search and acquisition experience.
                    </p>

                    <div className="flex items-center gap-6 mt-7 pt-7 border-t border-[#1E4C8C]/10">
                        <div>
                            <p className="font-display text-2xl text-[#1E4C8C] font-semibold">$2.4B+</p>
                            <p className="text-xs text-slate-500 mt-0.5">Volume Sold</p>
                        </div>
                        <div className="w-px h-10 bg-[#1E4C8C]/10" />
                        <div>
                            <p className="font-display text-2xl text-[#1E4C8C] font-semibold">50+</p>
                            <p className="text-xs text-slate-500 mt-0.5">Cities Covered</p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-28 h-28 rounded-2xl bg-[#EAF6DE] border border-[#8BC53F]/40" />
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
                        alt="Modern Office"
                        className="relative rounded-2xl shadow-lift object-cover h-96 w-full"
                    />
                    <div className="absolute -bottom-6 -right-3 sm:right-6 bg-white rounded-2xl border border-[#1E4C8C]/10 shadow-lift px-5 py-4 flex items-center gap-3">
                        <span className="w-11 h-11 rounded-xl bg-[#EAF6DE] text-[#6FA82C] flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="font-display text-base text-[#1E4C8C] font-semibold leading-none">Award Winning</p>
                            <p className="text-[11px] text-slate-500 mt-1">Trusted brokerage since 2010</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mission & Vision Cards */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="grid md:grid-cols-2 gap-6"
            >
                <motion.div variants={fadeUp} className="group bg-[#F7FAFC] p-8 rounded-2xl border border-[#1E4C8C]/10 hover:shadow-lift hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 bg-[#EAF6DE] text-[#6FA82C] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1E4C8C] font-medium mb-3">Our Mission</h3>
                    <p className="text-slate-600 leading-relaxed">
                        To empower clients through transparent data, exceptional advisory services, and a seamless digital platform that makes acquiring premier property simple and gratifying.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="group bg-[#F7FAFC] p-8 rounded-2xl border border-[#1E4C8C]/10 hover:shadow-lift hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 bg-[#EAF6DE] text-[#6FA82C] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1E4C8C] font-medium mb-3">Our Vision</h3>
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
        <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white">
            <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#8BC53F]/15 blur-3xl" />
            <div className="absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full bg-[#7CB93D]/10 blur-3xl" />

            <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                {/* Stats Grid */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 text-center"
                >
                    {stats.map((s, idx) => (
                        <motion.div key={idx} variants={fadeUp}>
                            <div className="font-display text-4xl md:text-5xl text-[#8BC53F] mb-2 font-semibold">{s.value}</div>
                            <div className="text-[#F7FAFC]/60 font-medium text-sm md:text-base">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Why Choose Us */}
                <div className="pt-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <Eyebrow dark>Why Choose Us</Eyebrow>
                        <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">Why Discerning Clients Choose Us</h2>
                        <p className="text-[#F7FAFC]/60">Excellence isn't an accident—it's our standard operating procedure.</p>
                    </div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        {features.map((f, idx) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#8BC53F]/40 transition-all"
                                >
                                    <span className="w-12 h-12 rounded-xl bg-[#8BC53F]/15 text-[#8BC53F] flex items-center justify-center mb-6 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </span>
                                    <h3 className="font-display text-xl font-medium mb-3">{f.title}</h3>
                                    <p className="text-[#F7FAFC]/60 leading-relaxed text-sm">{f.desc}</p>
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
        <section className="py-16 sm:py-20 bg-[#FBF7EF]">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <Eyebrow>How It Works</Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium mb-4">The Acquisition Journey</h2>
                    <p className="text-slate-600">A structured four-step path to secure your property effortlessly.</p>
                </div>

                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="group bg-white p-7 rounded-2xl shadow-card border border-[#1E4C8C]/5 relative overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
                        >
                            <span className="absolute top-0 left-0 h-1 w-0 bg-[#7CB93D] group-hover:w-full transition-all duration-500" />
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EAF1FB] text-[#1E4C8C] font-display text-lg font-semibold mb-5">
                                {step.num}
                            </span>
                            <h3 className="font-display text-xl text-[#1E4C8C] font-medium mb-2">{step.title}</h3>
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
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <Eyebrow>Our People</Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium mb-4">Leadership Team</h2>
                    <p className="text-slate-600">Industry veterans driven by integrity, passion, and innovation.</p>
                </div>

                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="group overflow-hidden rounded-2xl bg-white border border-[#1E4C8C]/10 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
                        >
                            <div className="overflow-hidden relative">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#153964]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-display text-xl text-[#1E4C8C] font-medium">{member.name}</h3>
                                <p className="text-[#6FA82C] text-sm font-semibold mt-1">{member.role}</p>
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
        <section className="py-16 sm:py-20 bg-[#FBF7EF] relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-5 text-center relative">
                <Quote className="w-12 h-12 text-[#7CB93D]/30 mx-auto mb-6" />
                <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#7CB93D] text-[#7CB93D]" />)}
                </div>
                <blockquote className="font-display text-2xl md:text-3xl text-[#1E4C8C] mb-8 leading-snug font-medium">
                    "Edge Realty made purchasing our coastal estate smooth beyond expectation. Their market foresight and discretion are completely unmatched."
                </blockquote>
                <cite className="not-italic text-slate-600 font-semibold block">
                    Marcus &amp; Eleanor Vance — Estate Buyers
                </cite>
            </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white relative overflow-hidden">
            <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#8BC53F]/20 blur-3xl" />
            <div className="max-w-5xl mx-auto px-5 text-center relative z-10">
                <h2 className="font-display text-3xl md:text-5xl font-medium mb-6">
                    Ready to Find Your <span className="italic text-[#8BC53F]">Dream</span> Property?
                </h2>
                <p className="text-[#F7FAFC]/70 text-lg max-w-2xl mx-auto mb-8">
                    Get in touch with our team of advisors to explore exclusive listings today.
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lift"
                >
                    Contact an Advisor <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    </>
);

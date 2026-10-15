import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Target,
    Eye,
    ShieldCheck,
    Award,
    Key,
    TrendingUp,
    Star,
    ArrowRight,
    Quote,
    CheckCircle2,
    Globe2,
    Sparkles,
    Handshake,
    Compass,
    Building2,
    MapPin,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    Users,
    LineChart,
} from 'lucide-react';

// ============================================================
// Shared helpers
// ============================================================

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const Eyebrow = ({ children, dark = false }) => (
    <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 ${
            dark ? 'text-[#8BC53F]' : 'text-[#6FA82C]'
        }`}
    >
        <span className={`w-6 h-px ${dark ? 'bg-[#8BC53F]/60' : 'bg-[#6FA82C]/60'}`} />
        {children}
    </span>
);

const SectionHeading = ({ eyebrow, title, subtitle, dark = false, center = true }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className={center ? 'text-center max-w-2xl mx-auto mb-14' : 'mb-10'}
    >
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2
            className={`font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-medium leading-tight ${
                dark ? 'text-white' : 'text-[#1E4C8C]'
            }`}
        >
            {title}
        </h2>
        {subtitle && (
            <p
                className={`mt-4 text-base leading-relaxed ${
                    dark ? 'text-white/60' : 'text-slate-600'
                }`}
            >
                {subtitle}
            </p>
        )}
    </motion.div>
);

/** Animated count-up number, triggered when scrolled into view. */
function Counter({ to, decimals = 0, prefix = '', suffix = '', duration = 1700 }) {
    const ref = useRef(null);
    const started = useRef(false);
    const [val, setVal] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting && !started.current) {
                        started.current = true;
                        const t0 = performance.now();
                        const tick = (now) => {
                            const p = Math.min((now - t0) / duration, 1);
                            const eased = 1 - Math.pow(1 - p, 3);
                            setVal(to * eased);
                            if (p < 1) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    }
                }
            },
            { threshold: 0.35 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [to, duration]);

    const shown =
        decimals > 0 ? Number(val).toFixed(decimals) : Math.round(val).toLocaleString('en-IN');

    return (
        <span ref={ref}>
            {prefix}
            {shown}
            {suffix}
        </span>
    );
}

// ============================================================
// 1. HERO BANNER
// ============================================================

export const HeroBanner = () => (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
                alt="Luxury residence"
                className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#153964]/95 via-[#1E4C8C]/88 to-[#1E4C8C]/65" />
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#8BC53F]/25 blur-3xl z-0" />
        <div className="absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full bg-[#7CB93D]/20 blur-3xl z-0" />

        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center px-5 py-24 w-full"
        >
            {/* Left: copy */}
            <motion.div variants={fadeUp}>
                <Eyebrow dark>Redefining Modern Living</Eyebrow>
                <h1 className="font-display text-4xl md:text-6xl leading-[1.08] font-medium mb-6 text-[#F7FAFC]">
                    Architecting Dreams
                    <br className="hidden sm:block" /> into{' '}
                    <span className="italic text-[#8BC53F]">Reality</span>
                </h1>
                <p className="text-lg text-[#F7FAFC]/75 max-w-xl">
                    We bridge the gap between extraordinary properties and discerning
                    buyers across the globe — with data, discretion and decade-defying
                    expertise.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-9">
                    <Link
                        to="/properties"
                        className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-7 py-3.5 shadow-lift"
                    >
                        Explore Properties <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 border border-white/30 hover:border-[#8BC53F] hover:bg-white/5 text-white font-semibold text-sm rounded-xl px-7 py-3.5 transition-colors"
                    >
                        Talk to an Advisor
                    </Link>
                </div>

                {/* Trust row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[...Array(4)].map((_, i) => (
                                <span
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-[#1E4C8C] bg-gradient-to-br from-[#8BC53F] to-[#6FA82C]"
                                />
                            ))}
                        </div>
                        <span className="text-[#F7FAFC]/70 text-sm">
                            <b className="text-white">12,000+</b> happy families
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#8BC53F] text-[#8BC53F]" />
                        ))}
                        <span className="text-[#F7FAFC]/70 text-sm ml-1">
                            <b className="text-white">4.9</b> on Google
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Right: floating glass stat cards */}
            <motion.div variants={fadeUp} className="hidden lg:grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
                        <p className="font-display text-3xl text-[#8BC53F] font-semibold leading-none">
                            <Counter to={1200} suffix="+" />
                        </p>
                        <p className="text-[11px] text-[#F7FAFC]/70 mt-2">Properties Managed</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
                        <p className="font-display text-3xl text-[#8BC53F] font-semibold leading-none">
                            <Counter to={99.2} decimals={1} suffix="%" />
                        </p>
                        <p className="text-[11px] text-[#F7FAFC]/70 mt-2">Client Satisfaction</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6" />
                    </span>
                    <div>
                        <p className="font-display text-lg text-white font-semibold leading-none">
                            Award-Winning Brokerage
                        </p>
                        <p className="text-[11px] text-[#F7FAFC]/60 mt-1.5">
                            Trusted since 2010 · RERA registered
                        </p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                        <LineChart className="w-6 h-6" />
                    </span>
                    <div>
                        <p className="font-display text-lg text-white font-semibold leading-none">
                            $2.4B+ in Sales Volume
                        </p>
                        <p className="text-[11px] text-[#F7FAFC]/60 mt-1.5">
                            Across 50+ cities worldwide
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
            <span className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
    </section>
);

// ============================================================
// 2. AWARDS / TRUST MARQUEE
// ============================================================

const ACCOLADES = [
    { icon: Award, label: 'Top Broker 2024' },
    { icon: ShieldCheck, label: 'RERA Registered' },
    { icon: Star, label: 'Google 4.9 Rating' },
    { icon: Globe2, label: 'ISO 9001 Certified' },
    { icon: Handshake, label: '12,000+ Happy Families' },
    { icon: Sparkles, label: 'Luxury Portfolio Award' },
    { icon: Building2, label: '50+ Cities Covered' },
    { icon: Users, label: 'Trusted Advisors' },
];

export const AwardsMarquee = () => {
    const items = [...ACCOLADES, ...ACCOLADES];
    return (
        <section className="bg-white border-y border-[#1E4C8C]/8 py-5 overflow-hidden">
            <div className="partner-marquee flex w-max items-center">
                {items.map((a, i) => {
                    const Icon = a.icon;
                    return (
                        <div
                            key={`${a.label}-${i}`}
                            className="flex items-center gap-2.5 px-7 shrink-0"
                            aria-hidden={i >= ACCOLADES.length}
                        >
                            <span className="w-9 h-9 rounded-full bg-[#EAF6DE] text-[#6FA82C] flex items-center justify-center">
                                <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-[#1E4C8C] whitespace-nowrap">
                                {a.label}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#1E4C8C]/20 ml-4" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

// ============================================================
// 3. COMPANY OVERVIEW + MISSION & VISION
// ============================================================

export const CompanyOverview = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-16"
            >
                <div>
                    <Eyebrow>Who We Are</Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium mb-6 leading-tight">
                        Pioneering Excellence in Luxury Real Estate
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Founded with a vision to revolutionize real estate transactions,
                        Edge Realty has grown into a premier brokerage trusted by
                        high-net-worth individuals, investors and families worldwide.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        We fuse deep local market expertise with cutting-edge analytics to
                        deliver an unparalleled property search and acquisition experience.
                    </p>

                    <ul className="mt-7 space-y-3">
                        {[
                            '50-point physical & legal verification on every listing',
                            'Dedicated advisor from shortlist to handover',
                            'Transparent, data-backed valuation reports',
                        ].map((t) => (
                            <li key={t} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-5 h-5 text-[#6FA82C] shrink-0 mt-0.5" />
                                <span className="text-slate-600 text-sm leading-relaxed">{t}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-8 mt-8 pt-8 border-t border-[#1E4C8C]/10">
                        <div>
                            <p className="font-display text-3xl text-[#1E4C8C] font-semibold leading-none">
                                <Counter to={2.4} decimals={1} prefix="$" suffix="B+" />
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5">Volume Sold</p>
                        </div>
                        <div className="w-px h-12 bg-[#1E4C8C]/10" />
                        <div>
                            <p className="font-display text-3xl text-[#1E4C8C] font-semibold leading-none">
                                <Counter to={50} suffix="+" />
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5">Cities Covered</p>
                        </div>
                        <div className="w-px h-12 bg-[#1E4C8C]/10" />
                        <div>
                            <p className="font-display text-3xl text-[#1E4C8C] font-semibold leading-none">
                                <Counter to={15} suffix="+" />
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5">Years of Trust</p>
                        </div>
                    </div>
                </div>

                {/* Image collage */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-28 h-28 rounded-2xl bg-[#EAF6DE] border border-[#8BC53F]/40" />
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
                        alt="Modern Office"
                        className="relative rounded-2xl shadow-lift object-cover h-[26rem] w-full"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
                        alt="Team meeting"
                        className="absolute -bottom-8 -left-6 w-40 h-32 object-cover rounded-xl border-4 border-white shadow-lift hidden sm:block"
                    />
                    <div className="absolute -bottom-6 right-4 sm:right-6 bg-white rounded-2xl border border-[#1E4C8C]/10 shadow-lift px-5 py-4 flex items-center gap-3">
                        <span className="w-11 h-11 rounded-xl bg-[#EAF6DE] text-[#6FA82C] flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="font-display text-base text-[#1E4C8C] font-semibold leading-none">
                                Award Winning
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Trusted brokerage since 2010
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mission & Vision */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-6"
            >
                <motion.div
                    variants={fadeUp}
                    className="group relative bg-[#F7FAFC] p-8 rounded-2xl border border-[#1E4C8C]/10 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
                >
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7CB93D] to-transparent w-0 group-hover:w-full transition-all duration-500" />
                    <div className="w-12 h-12 bg-[#EAF6DE] text-[#6FA82C] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1E4C8C] font-medium mb-3">
                        Our Mission
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        To empower clients through transparent data, exceptional advisory
                        services and a seamless digital platform that makes acquiring
                        premier property simple and gratifying.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    className="group relative bg-[#F7FAFC] p-8 rounded-2xl border border-[#1E4C8C]/10 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
                >
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7CB93D] to-transparent w-0 group-hover:w-full transition-all duration-500" />
                    <div className="w-12 h-12 bg-[#EAF6DE] text-[#6FA82C] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1E4C8C] font-medium mb-3">
                        Our Vision
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        To set the global benchmark for integrity, luxury branding and
                        prop-tech innovation in the real estate sector for generations to
                        come.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// ============================================================
// 4. STATS BAND + WHY CHOOSE US
// ============================================================

const STATS = [
    { to: 2.4, decimals: 1, prefix: '$', suffix: 'B+', label: 'Volume Sold' },
    { to: 1200, suffix: '+', label: 'Properties Managed' },
    { to: 99.2, decimals: 1, suffix: '%', label: 'Client Satisfaction' },
    { to: 15, suffix: '+', label: 'Years Experience' },
];

const VALUES = [
    {
        title: 'Vetted Portfolio',
        desc: 'Every property undergoes a rigorous 50-point physical & legal inspection.',
        icon: ShieldCheck,
    },
    {
        title: 'Data-Driven Insights',
        desc: 'Real-time neighbourhood trends and long-term yield projections.',
        icon: TrendingUp,
    },
    {
        title: 'End-to-End Concierge',
        desc: 'Legal, financial and interior design advisory under one roof.',
        icon: Key,
    },
    {
        title: 'Absolute Transparency',
        desc: 'No hidden fees, no surprise commissions — clarity at every step.',
        icon: Handshake,
    },
    {
        title: 'Global Reach',
        desc: 'Local expertise amplified by an international buyer network.',
        icon: Globe2,
    },
    {
        title: 'Prop-Tech Platform',
        desc: 'Virtual tours, instant valuation and digital closing, built in.',
        icon: Compass,
    },
];

export const StatsAndValue = () => (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#8BC53F]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full bg-[#7CB93D]/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
            {/* Animated stats */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 text-center"
            >
                {STATS.map((s, idx) => (
                    <motion.div key={idx} variants={fadeUp}>
                        <div className="font-display text-4xl md:text-5xl text-[#8BC53F] mb-2 font-semibold">
                            <Counter
                                to={s.to}
                                decimals={s.decimals || 0}
                                prefix={s.prefix || ''}
                                suffix={s.suffix || ''}
                            />
                        </div>
                        <div className="text-[#F7FAFC]/60 font-medium text-sm md:text-base">
                            {s.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Why choose us */}
            <div className="pt-16">
                <SectionHeading
                    dark
                    eyebrow="Why Choose Us"
                    title="Why Discerning Clients Choose Us"
                    subtitle="Excellence isn't an accident — it's our standard operating procedure."
                />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={staggerContainer}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {VALUES.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-[#8BC53F]/40 transition-all"
                            >
                                <span className="w-12 h-12 rounded-xl bg-[#8BC53F]/15 text-[#8BC53F] flex items-center justify-center mb-5 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                                    <Icon className="w-6 h-6" />
                                </span>
                                <h3 className="font-display text-xl font-medium mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-[#F7FAFC]/60 leading-relaxed text-sm">
                                    {f.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    </section>
);

// ============================================================
// 5. MILESTONES / JOURNEY TIMELINE
// ============================================================

const MILESTONES = [
    {
        year: '2010',
        title: 'The Beginning',
        desc: 'Founded in a single office with a bold promise: integrity above commission.',
    },
    {
        year: '2014',
        title: 'Regional Expansion',
        desc: 'Opened three new branches and crossed 200 successful property closures.',
    },
    {
        year: '2018',
        title: 'Prop-Tech Launch',
        desc: 'Introduced our digital valuation engine and virtual tour platform.',
    },
    {
        year: '2021',
        title: '1,000th Home Sold',
        desc: 'Reached a milestone family and expanded into commercial portfolios.',
    },
    {
        year: '2024',
        title: 'National Recognition',
        desc: 'Named Top Brokerage and surpassing $2B in lifetime sales volume.',
    },
    {
        year: '2026',
        title: 'Global Network',
        desc: 'Serving clients across 50+ cities with 12,000+ delighted families.',
    },
];

export const Milestones = () => (
    <section className="py-16 sm:py-24 bg-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow="Our Journey"
                title="A Decade of Milestones"
                subtitle="From a single office to a nationally recognised brokerage — built one trusted relationship at a time."
            />

            <div className="relative">
                {/* Center line (desktop) */}
                <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#1E4C8C]/20 to-transparent" />

                <div className="space-y-8 lg:space-y-0">
                    {MILESTONES.map((m, idx) => {
                        const isLeft = idx % 2 === 0;
                        return (
                            <motion.div
                                key={m.year}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-80px' }}
                                variants={fadeUp}
                                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 lg:mb-10 ${
                                    isLeft ? '' : ''
                                }`}
                            >
                                {/* Dot on the line */}
                                <span className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-[#7CB93D] ring-4 ring-[#FBF7EF]" />

                                <div
                                    className={`${
                                        isLeft ? 'lg:text-right lg:pr-14' : 'lg:col-start-2 lg:pl-14'
                                    } pl-10 lg:pl-0 relative`}
                                >
                                    {/* Mobile line + dot */}
                                    <span className="lg:hidden absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#7CB93D]" />
                                    <span className="lg:hidden absolute left-[5px] top-5 bottom-[-2rem] w-px bg-[#1E4C8C]/15" />

                                    <span className="inline-block font-display text-2xl text-[#7CB93D] font-semibold">
                                        {m.year}
                                    </span>
                                    <h3 className="font-display text-xl text-[#1E4C8C] font-medium mt-1.5 mb-2">
                                        {m.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm lg:max-w-none inline-block">
                                        {m.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

// ============================================================
// 6. ACQUISITION JOURNEY
// ============================================================

const STEPS = [
    {
        num: '01',
        title: 'Consultation',
        desc: 'Understanding your investment criteria and lifestyle desires.',
    },
    {
        num: '02',
        title: 'Curation',
        desc: 'Presenting off-market and hand-selected luxury residences.',
    },
    {
        num: '03',
        title: 'Acquisition',
        desc: 'Seamless negotiation, legal due diligence and closing.',
    },
    {
        num: '04',
        title: 'Management',
        desc: 'Post-purchase property setup and yield management.',
    },
];

export const ServicesAndJourney = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow="How It Works"
                title="The Acquisition Journey"
                subtitle="A structured four-step path to secure your property effortlessly."
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {STEPS.map((step, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="group bg-[#FBF7EF] p-7 rounded-2xl border border-[#1E4C8C]/5 relative overflow-hidden hover:shadow-lift hover:-translate-y-1 hover:bg-white transition-all"
                    >
                        <span className="absolute top-0 left-0 h-1 w-0 bg-[#7CB93D] group-hover:w-full transition-all duration-500" />
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EAF1FB] text-[#1E4C8C] font-display text-lg font-semibold mb-5 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                            {step.num}
                        </span>
                        <h3 className="font-display text-xl text-[#1E4C8C] font-medium mb-2">
                            {step.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

// ============================================================
// 7. OFFICE / LIFESTYLE GALLERY
// ============================================================

const GALLERY = [
    {
        src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
        label: 'Our Headquarters',
        span: 'sm:col-span-2 sm:row-span-2',
    },
    {
        src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80',
        label: 'Client Meetings',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80',
        label: 'Advisory Lounge',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80',
        label: 'Workspace',
        span: 'sm:col-span-2',
    },
];

export const OfficeGallery = () => (
    <section className="py-16 sm:py-24 bg-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow="Inside Edge"
                title="Where Expertise Meets Elegance"
                subtitle="A glimpse into the spaces where we craft property experiences."
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[200px]"
            >
                {GALLERY.map((g, idx) => (
                    <motion.figure
                        key={idx}
                        variants={fadeUp}
                        className={`group relative overflow-hidden rounded-2xl ${g.span}`}
                    >
                        <img
                            src={g.src}
                            alt={g.label}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#153964]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                        <figcaption className="absolute bottom-4 left-4 text-white font-display text-lg drop-shadow">
                            {g.label}
                        </figcaption>
                    </motion.figure>
                ))}
            </motion.div>
        </div>
    </section>
);

// ============================================================
// 8. TEAM
// ============================================================

const TEAM = [
    {
        name: 'Sarah Jenkins',
        role: 'Managing Principal & Founder',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
    },
    {
        name: 'David Chen',
        role: 'Head of Global Acquisitions',
        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    },
    {
        name: 'Elena Rostova',
        role: 'Director of Luxury Estates',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    },
    {
        name: 'Marcus Webb',
        role: 'Head of Client Relations',
        img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80',
    },
];

const SOCIALS = ['IN', 'X', 'IG', 'F'];

export const TeamSection = () => (
    <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow="Our People"
                title="Leadership Team"
                subtitle="Industry veterans driven by integrity, passion and innovation."
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {TEAM.map((member, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="group overflow-hidden rounded-2xl bg-white border border-[#1E4C8C]/10 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
                    >
                        <div className="overflow-hidden relative">
                            <img
                                src={member.img}
                                alt={member.name}
                                loading="lazy"
                                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#153964]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Social links reveal on hover */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                {SOCIALS.map((s, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        aria-label={`${member.name} on ${s}`}
                                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/25 text-white text-[11px] font-bold flex items-center justify-center hover:bg-[#7CB93D] transition-colors"
                                    >
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-display text-lg text-[#1E4C8C] font-medium">
                                {member.name}
                            </h3>
                            <p className="text-[#6FA82C] text-sm font-semibold mt-1">
                                {member.role}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

// ============================================================
// 9. TESTIMONIALS CAROUSEL
// ============================================================

const TESTIMONIALS = [
    {
        quote:
            'Edge Realty made purchasing our coastal estate smooth beyond expectation. Their market foresight and discretion are completely unmatched.',
        name: 'Marcus & Eleanor Vance',
        role: 'Estate Buyers',
    },
    {
        quote:
            'As an NRI investor, I needed a team I could trust blindly. Their data reports and virtual tours made closing remotely effortless.',
        name: 'Priya Sharma',
        role: 'Property Investor',
    },
    {
        quote:
            'From shortlist to handover, every step was transparent. The concierge team even handled our interiors. Truly end-to-end service.',
        name: 'James Okafor',
        role: 'First-time Homeowner',
    },
];

export const Testimonials = () => {
    const [idx, setIdx] = useState(0);
    const total = TESTIMONIALS.length;

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
        return () => clearInterval(t);
    }, [total]);

    const prev = () => setIdx((i) => (i - 1 + total) % total);
    const next = () => setIdx((i) => (i + 1) % total);

    return (
        <section className="py-16 sm:py-24 bg-[#FBF7EF] relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-5 text-center relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                >
                    <Quote className="w-12 h-12 text-[#7CB93D]/30 mx-auto mb-6" />

                    <div className="min-h-[220px] sm:min-h-[200px] flex flex-col justify-center">
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-5 h-5 fill-[#7CB93D] text-[#7CB93D]"
                                />
                            ))}
                        </div>
                        <blockquote
                            key={idx}
                            className="font-display text-2xl md:text-3xl text-[#1E4C8C] mb-8 leading-snug font-medium transition-opacity duration-500"
                        >
                            “{TESTIMONIALS[idx].quote}”
                        </blockquote>
                        <cite className="not-italic text-slate-600 font-semibold block">
                            {TESTIMONIALS[idx].name}{' '}
                            <span className="text-[#6FA82C]">— {TESTIMONIALS[idx].role}</span>
                        </cite>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            aria-label="Previous testimonial"
                            className="w-10 h-10 rounded-full border border-[#1E4C8C]/15 bg-white text-[#1E4C8C] flex items-center justify-center hover:border-[#7CB93D] hover:text-[#6FA82C] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIdx(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    className={`h-2 rounded-full transition-all ${
                                        i === idx ? 'w-6 bg-[#7CB93D]' : 'w-2 bg-[#1E4C8C]/20'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            aria-label="Next testimonial"
                            className="w-10 h-10 rounded-full border border-[#1E4C8C]/15 bg-white text-[#1E4C8C] flex items-center justify-center hover:border-[#7CB93D] hover:text-[#6FA82C] transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================================
// 10. CTA BANNER
// ============================================================

export const CTABanner = () => (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white relative overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#8BC53F]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative z-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
            >
                <Eyebrow dark>Let's Begin</Eyebrow>
                <h2 className="font-display text-3xl md:text-5xl font-medium mb-5 leading-tight">
                    Ready to Find Your <span className="italic text-[#8BC53F]">Dream</span>{' '}
                    Property?
                </h2>
                <p className="text-[#F7FAFC]/70 text-lg max-w-xl mb-8">
                    Get in touch with our advisors to explore exclusive listings tailored to
                    your goals.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-7 py-3.5 rounded-xl font-semibold transition-colors shadow-lift"
                    >
                        Contact an Advisor <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        to="/properties"
                        className="inline-flex items-center gap-2 border border-white/30 hover:border-[#8BC53F] hover:bg-white/5 px-7 py-3.5 rounded-xl font-semibold transition-colors"
                    >
                        Browse Listings
                    </Link>
                </div>
            </motion.div>

            {/* Contact card */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8"
            >
                <p className="font-display text-xl mb-6">Reach us directly</p>
                <ul className="space-y-5">
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Head Office</p>
                            <p className="text-[#F7FAFC]/60 text-sm">
                                Sector 18, Gurugram, Haryana
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-[#F7FAFC]/60 text-sm">+91 98765 43210</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-[#F7FAFC]/60 text-sm">
                                hello@edgemilerealty.in
                            </p>
                        </div>
                    </li>
                </ul>
            </motion.div>
        </div>
    </section>
);

// Keep legacy export name used elsewhere (testimonials + CTA combined view).
export const TestimonialsAndCTA = () => (
    <>
        <Testimonials />
        <CTABanner />
    </>
);

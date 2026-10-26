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
import usePageContent from '../../hooks/usePageContent';
import footerService from '../../services/footer.service';

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

/** "Architecting Dreams into *Reality*" → plain text with *word* wrapped as italic accent */
const renderEmph = (text) =>
    String(text || '')
        .split('*')
        .map((part, i) =>
            i % 2 === 1 ? (
                <span key={i} className="italic text-[#8BC53F]">
                    {part}
                </span>
            ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
            )
        );

const DEFAULT_STATS_RAW =
    '$2.4B+ | Volume Sold\n1200+ | Properties Managed\n99.2% | Client Satisfaction\n15+ | Years Experience';

// Section-level defaults: identical to admin seed values, so the page keeps
// rendering the same content when the API is unavailable or a key is blank.
const DEFAULT_HERO_TRUST = '12,000+ | happy families\n4.9 | on Google';
const DEFAULT_HERO_STATS = '1200+ | Properties Managed\n99.2% | Client Satisfaction';
const DEFAULT_HERO_HIGHLIGHTS =
    'Award-Winning Brokerage | Trusted since 2010 · RERA registered\n$2.4B+ in Sales Volume | Across 50+ cities worldwide';
const DEFAULT_AWARDS =
    'Top Broker 2024\nRERA Registered\nGoogle 4.9 Rating\nISO 9001 Certified\n12,000+ Happy Families\nLuxury Portfolio Award\n50+ Cities Covered\nTrusted Advisors';
const DEFAULT_OVERVIEW_PARA =
    'Founded with a vision to revolutionize real estate transactions, Edge Realty has grown into a premier brokerage trusted by high-net-worth individuals, investors and families worldwide.\n\nWe fuse deep local market expertise with cutting-edge analytics to deliver an unparalleled property search and acquisition experience.';
const DEFAULT_OVERVIEW_LIST =
    '50-point physical & legal verification on every listing\nDedicated advisor from shortlist to handover\nTransparent, data-backed valuation reports';
const DEFAULT_OVERVIEW_STATS = '$2.4B+ | Volume Sold\n50+ | Cities Covered\n15+ | Years of Trust';
const DEFAULT_VALUES =
    'Vetted Portfolio | Every property undergoes a rigorous 50-point physical & legal inspection.\nData-Driven Insights | Real-time neighbourhood trends and long-term yield projections.\nEnd-to-End Concierge | Legal, financial and interior design advisory under one roof.\nAbsolute Transparency | No hidden fees, no surprise commissions — clarity at every step.\nGlobal Reach | Local expertise amplified by an international buyer network.\nProp-Tech Platform | Virtual tours, instant valuation and digital closing, built in.';
const DEFAULT_MILESTONES =
    '2010 | The Beginning | Founded in a single office with a bold promise: integrity above commission.\n2014 | Regional Expansion | Opened three new branches and crossed 200 successful property closures.\n2018 | Prop-Tech Launch | Introduced our digital valuation engine and virtual tour platform.\n2021 | 1,000th Home Sold | Reached a milestone family and expanded into commercial portfolios.\n2024 | National Recognition | Named Top Brokerage and surpassing $2B in lifetime sales volume.\n2026 | Global Network | Serving clients across 50+ cities with 12,000+ delighted families.';
const DEFAULT_STEPS =
    'Consultation | Understanding your investment criteria and lifestyle desires.\nCuration | Presenting off-market and hand-selected luxury residences.\nAcquisition | Seamless negotiation, legal due diligence and closing.\nManagement | Post-purchase property setup and yield management.';
const DEFAULT_GALLERY =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80 | Our Headquarters\nhttps://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80 | Client Meetings\nhttps://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80 | Advisory Lounge\nhttps://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80 | Workspace';
const DEFAULT_TEAM =
    'Sarah Jenkins | Managing Principal & Founder | https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80\nDavid Chen | Head of Global Acquisitions | https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80\nElena Rostova | Director of Luxury Estates | https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80\nMarcus Webb | Head of Client Relations | https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80';
const DEFAULT_TESTIMONIALS =
    'Edge Realty made purchasing our coastal estate smooth beyond expectation. Their market foresight and discretion are completely unmatched. | Marcus & Eleanor Vance | Estate Buyers\nAs an NRI investor, I needed a team I could trust blindly. Their data reports and virtual tours made closing remotely effortless. | Priya Sharma | Property Investor\nFrom shortlist to handover, every step was transparent. The concierge team even handled our interiors. Truly end-to-end service. | James Okafor | First-time Homeowner';

/** Newline-separated non-empty trimmed lines (blank/whitespace-only skipped). */
const lineItems = (raw, fallback) =>
    String(raw || fallback || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

/** Split one line into exactly n fields on the first n-1 pipes (missing → ''). */
const pipeFields = (line, n) => {
    const out = [];
    let rest = String(line);
    for (let i = 0; i < n - 1; i += 1) {
        const idx = rest.indexOf('|');
        if (idx < 0) break;
        out.push(rest.slice(0, idx).trim());
        rest = rest.slice(idx + 1);
    }
    out.push(rest.trim());
    while (out.length < n) out.push('');
    return out;
};

/** Lines → arrays of exactly n fields: parseRows(key, 2, default). */
const parseRows = (raw, n, fallback) => lineItems(raw, fallback).map((l) => pipeFields(l, n));

/** Blank-line separated paragraphs → array of paragraph strings. */
const paragraphs = (raw, fallback) =>
    String(raw || fallback || '')
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
        .filter(Boolean);

/** "Value | Label" stats with a per-section fallback raw string. */
const getStatsFrom = (raw, fallback) => {
    const parsed = parseStats(raw || fallback);
    return parsed.length ? parsed : parseStats(fallback);
};

/** Lines of "Value | Label" → animated counter stats (prefix/suffix split from the value) */
const parseStats = (raw) =>
    String(raw || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            const [valuePart = '', label = ''] = line.split('|').map((s) => s.trim());
            const m = valuePart.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
            if (!m || !label) return null;
            return {
                to: Number(m[2]),
                prefix: m[1],
                suffix: m[3],
                decimals: (m[2].split('.')[1] || '').length,
                label,
            };
        })
        .filter(Boolean);

const getStats = (raw) => {
    const parsed = parseStats(raw || DEFAULT_STATS_RAW);
    return parsed.length ? parsed : parseStats(DEFAULT_STATS_RAW);
};

// ============================================================
// 1. HERO BANNER
// ============================================================

export const HeroBanner = () => {
    const content = usePageContent();
    const trust = parseRows(content.about_hero_trust, 2, DEFAULT_HERO_TRUST);
    const heroStats = getStatsFrom(content.about_hero_stats, DEFAULT_HERO_STATS);
    const highlights = parseRows(content.about_hero_highlights, 2, DEFAULT_HERO_HIGHLIGHTS);
    return (
    <section className="relative min-h-[520px] lg:min-h-[600px] flex items-center overflow-hidden">
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
            className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center px-5 py-16 lg:py-24 w-full"
        >
            {/* Left: copy */}
            <motion.div variants={fadeUp}>
                <Eyebrow dark>{content.about_hero_eyebrow || 'Redefining Modern Living'}</Eyebrow>
                <h1 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1.08] font-medium mb-6 text-[#F7FAFC]">
                    {renderEmph(
                        content.about_hero_title || 'Architecting Dreams into *Reality*'
                    )}
                </h1>
                <p className="text-lg text-[#F7FAFC]/75 max-w-xl">
                    {content.about_hero_sub ||
                        'We bridge the gap between extraordinary properties and discerning buyers across the globe — with data, discretion and decade-defying expertise.'}
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
                    {trust.map(([value, text], i) => (
                        <div
                            key={i}
                            className={`flex items-center ${i === 1 ? 'gap-1.5' : 'gap-2'}`}
                        >
                            {i === 0 && (
                                <div className="flex -space-x-2">
                                    {[...Array(4)].map((_, j) => (
                                        <span
                                            key={j}
                                            className="w-8 h-8 rounded-full border-2 border-[#1E4C8C] bg-gradient-to-br from-[#8BC53F] to-[#6FA82C]"
                                        />
                                    ))}
                                </div>
                            )}
                            {i === 1 && (
                                <div className="flex gap-1.5">
                                    {[...Array(5)].map((_, j) => (
                                        <Star
                                            key={j}
                                            className="w-4 h-4 fill-[#8BC53F] text-[#8BC53F]"
                                        />
                                    ))}
                                </div>
                            )}
                            <span
                                className={`text-[#F7FAFC]/70 text-sm ${i === 1 ? 'ml-1' : ''}`}
                            >
                                <b className="text-white">{value}</b> {text}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right: floating glass stat cards */}
            <motion.div variants={fadeUp} className="hidden lg:grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    {heroStats.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
                        >
                            <p className="font-display text-3xl text-[#8BC53F] font-semibold leading-none">
                                <Counter
                                    to={s.to}
                                    decimals={s.decimals || 0}
                                    prefix={s.prefix || ''}
                                    suffix={s.suffix || ''}
                                />
                            </p>
                            <p className="text-[11px] text-[#F7FAFC]/70 mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>
                {highlights.map(([title, sub], i) => {
                    const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                    return (
                        <div
                            key={i}
                            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex items-center gap-4"
                        >
                            <span className="w-12 h-12 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6" />
                            </span>
                            <div>
                                <p className="font-display text-lg text-white font-semibold leading-none">
                                    {title}
                                </p>
                                <p className="text-[11px] text-[#F7FAFC]/60 mt-1.5">{sub}</p>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
            <span className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
    </section>
    );
};

// ============================================================
// 2. AWARDS / TRUST MARQUEE
// ============================================================

const HIGHLIGHT_ICONS = [Award, LineChart];
const AWARD_ICONS = [Award, ShieldCheck, Star, Globe2, Handshake, Sparkles, Building2, Users];

export const AwardsMarquee = () => {
    const content = usePageContent();
    const labels = lineItems(content.about_awards, DEFAULT_AWARDS);
    const items = [...labels, ...labels];
    return (
        <section className="bg-white border-y border-[#1E4C8C]/8 py-5 overflow-hidden">
            <div className="partner-marquee flex w-max items-center">
                {items.map((label, i) => {
                    const Icon = AWARD_ICONS[(i % labels.length) % AWARD_ICONS.length];
                    return (
                        <div
                            key={`${label}-${i}`}
                            className="flex items-center gap-2.5 px-7 shrink-0"
                            aria-hidden={i >= labels.length}
                        >
                            <span className="w-9 h-9 rounded-full bg-[#EAF6DE] text-[#6FA82C] flex items-center justify-center">
                                <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-[#1E4C8C] whitespace-nowrap">
                                {label}
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

export const CompanyOverview = () => {
    const content = usePageContent();
    const paras = paragraphs(content.about_overview_para, DEFAULT_OVERVIEW_PARA);
    const overviewList = lineItems(content.about_overview_list, DEFAULT_OVERVIEW_LIST);
    const overviewStats = getStatsFrom(content.about_overview_stats, DEFAULT_OVERVIEW_STATS);
    return (
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
                    <Eyebrow>
                        {content.about_overview_eyebrow || 'Who We Are'}
                    </Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium mb-6 leading-tight">
                        {content.about_overview_title ||
                            'Pioneering Excellence in Luxury Real Estate'}
                    </h2>
                    {paras.map((p, i) => (
                        <p
                            key={i}
                            className={`text-slate-600 leading-relaxed ${
                                i < paras.length - 1 ? 'mb-4' : ''
                            }`}
                        >
                            {p}
                        </p>
                    ))}

                    <ul className="mt-7 space-y-3">
                        {overviewList.map((t) => (
                            <li key={t} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-5 h-5 text-[#6FA82C] shrink-0 mt-0.5" />
                                <span className="text-slate-600 text-sm leading-relaxed">{t}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#1E4C8C]/10">
                        {overviewStats.map((s, i) => (
                            <div
                                key={i}
                                className={i > 0 ? 'border-l border-[#1E4C8C]/10 pl-4' : ''}
                            >
                                <p className="font-display text-2xl sm:text-3xl text-[#1E4C8C] font-semibold leading-none">
                                    <Counter
                                        to={s.to}
                                        decimals={s.decimals || 0}
                                        prefix={s.prefix || ''}
                                        suffix={s.suffix || ''}
                                    />
                                </p>
                                <p className="text-xs text-slate-500 mt-1.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image collage */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-28 h-28 rounded-2xl bg-[#EAF6DE] border border-[#8BC53F]/40" />
                    <img
                        src={
                            content.about_overview_img1 ||
                            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'
                        }
                        alt="Modern Office"
                        className="relative rounded-2xl shadow-lift object-cover h-[18rem] sm:h-[26rem] w-full"
                    />
                    <img
                        src={
                            content.about_overview_img2 ||
                            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80'
                        }
                        alt="Team meeting"
                        className="absolute -bottom-8 -left-6 w-40 h-32 object-cover rounded-xl border-4 border-white shadow-lift hidden sm:block"
                    />
                    <div className="absolute -bottom-6 right-4 sm:right-6 bg-white rounded-2xl border border-[#1E4C8C]/10 shadow-lift px-5 py-4 flex items-center gap-3">
                        <span className="w-11 h-11 rounded-xl bg-[#EAF6DE] text-[#6FA82C] flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="font-display text-base text-[#1E4C8C] font-semibold leading-none">
                                {content.about_overview_badge_title || 'Award Winning'}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">
                                {content.about_overview_badge_sub || 'Trusted brokerage since 2010'}
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
                        {content.about_mission_title || 'Our Mission'}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        {content.about_mission ||
                            'To empower clients through transparent data, exceptional advisory services and a seamless digital platform that makes acquiring premier property simple and gratifying.'}
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
                        {content.about_vision_title || 'Our Vision'}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        {content.about_vision ||
                            'To set the global benchmark for integrity, luxury branding and prop-tech innovation in the real estate sector for generations to come.'}
                    </p>
                </motion.div>
            </motion.div>
        </div>
    </section>
    );
};

// ============================================================
// 4. STATS BAND + WHY CHOOSE US
// ============================================================

// Stats now come from admin-managed `about_stats` via getStats() (Value | Label lines)

const VALUE_ICONS = [ShieldCheck, TrendingUp, Key, Handshake, Globe2, Compass];

export const StatsAndValue = () => {
    const content = usePageContent();
    const stats = getStats(content.about_stats);
    const values = parseRows(content.about_values, 2, DEFAULT_VALUES);
    return (
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
                {stats.map((s, idx) => (
                    <motion.div key={idx} variants={fadeUp}>
                        <div className="font-display text-3xl sm:text-4xl md:text-5xl text-[#8BC53F] mb-2 font-semibold">
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
                    eyebrow={content.about_values_eyebrow || 'Why Choose Us'}
                    title={content.about_values_title || 'Why Discerning Clients Choose Us'}
                    subtitle={
                        content.about_values_sub ||
                        "Excellence isn't an accident — it's our standard operating procedure."
                    }
                />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={staggerContainer}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {values.map(([title, desc], idx) => {
                        const Icon = VALUE_ICONS[idx % VALUE_ICONS.length];
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
                                    {title}
                                </h3>
                                <p className="text-[#F7FAFC]/60 leading-relaxed text-sm">
                                    {desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    </section>
    );
};

// ============================================================
// 5. MILESTONES / JOURNEY TIMELINE
// ============================================================

export const Milestones = () => {
    const content = usePageContent();
    const milestones = parseRows(content.about_milestones, 3, DEFAULT_MILESTONES);
    return (
    <section className="py-16 sm:py-24 bg-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow={content.about_milestones_eyebrow || 'Our Journey'}
                title={content.about_milestones_title || 'A Decade of Milestones'}
                subtitle={
                    content.about_milestones_sub ||
                    'From a single office to a nationally recognised brokerage — built one trusted relationship at a time.'
                }
            />

            <div className="relative">
                {/* Center line (desktop) */}
                <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#1E4C8C]/20 to-transparent" />

                <div className="space-y-8 lg:space-y-0">
                    {milestones.map(([year, title, desc], idx) => {
                        const isLeft = idx % 2 === 0;
                        return (
                            <motion.div
                                key={idx}
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
                                        {year}
                                    </span>
                                    <h3 className="font-display text-xl text-[#1E4C8C] font-medium mt-1.5 mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm lg:max-w-none inline-block">
                                        {desc}
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
};

// ============================================================
// 6. ACQUISITION JOURNEY
// ============================================================

export const ServicesAndJourney = () => {
    const content = usePageContent();
    const steps = parseRows(content.about_steps, 2, DEFAULT_STEPS);
    return (
    <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow={content.about_steps_eyebrow || 'How It Works'}
                title={content.about_steps_title || 'The Acquisition Journey'}
                subtitle={
                    content.about_steps_sub ||
                    'A structured four-step path to secure your property effortlessly.'
                }
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {steps.map(([title, desc], idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="group bg-[#FBF7EF] p-7 rounded-2xl border border-[#1E4C8C]/5 relative overflow-hidden hover:shadow-lift hover:-translate-y-1 hover:bg-white transition-all"
                    >
                        <span className="absolute top-0 left-0 h-1 w-0 bg-[#7CB93D] group-hover:w-full transition-all duration-500" />
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EAF1FB] text-[#1E4C8C] font-display text-lg font-semibold mb-5 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-xl text-[#1E4C8C] font-medium mb-2">
                            {title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
    );
};

// ============================================================
// 7. OFFICE / LIFESTYLE GALLERY
// ============================================================

const gallerySpan = (idx) => {
    if (idx % 4 === 0) return 'sm:col-span-2 sm:row-span-2';
    if (idx % 4 === 3) return 'sm:col-span-2';
    return '';
};

export const OfficeGallery = () => {
    const content = usePageContent();
    const gallery = parseRows(content.about_gallery, 2, DEFAULT_GALLERY);
    return (
    <section className="py-16 sm:py-24 bg-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow={content.about_gallery_eyebrow || 'Inside Edge'}
                title={content.about_gallery_title || 'Where Expertise Meets Elegance'}
                subtitle={
                    content.about_gallery_sub ||
                    'A glimpse into the spaces where we craft property experiences.'
                }
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[200px]"
            >
                {gallery.map(([src, label], idx) => (
                    <motion.figure
                        key={idx}
                        variants={fadeUp}
                        className={`group relative overflow-hidden rounded-2xl ${gallerySpan(idx)}`}
                    >
                        <img
                            src={src}
                            alt={label}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#153964]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                        <figcaption className="absolute bottom-4 left-4 text-white font-display text-lg drop-shadow">
                            {label}
                        </figcaption>
                    </motion.figure>
                ))}
            </motion.div>
        </div>
    </section>
    );
};

// ============================================================
// 8. TEAM
// ============================================================

const SOCIALS = ['IN', 'X', 'IG', 'F'];

export const TeamSection = () => {
    const content = usePageContent();
    const team = parseRows(content.about_team, 3, DEFAULT_TEAM);
    return (
    <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <SectionHeading
                eyebrow={content.about_team_eyebrow || 'Our People'}
                title={content.about_team_title || 'Leadership Team'}
                subtitle={
                    content.about_team_sub ||
                    'Industry veterans driven by integrity, passion and innovation.'
                }
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {team.map(([name, role, img], idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="group overflow-hidden rounded-2xl bg-white border border-[#1E4C8C]/10 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
                    >
                        <div className="overflow-hidden relative">
                            <img
                                src={img}
                                alt={name}
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
                                        aria-label={`${name} on ${s}`}
                                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/25 text-white text-[11px] font-bold flex items-center justify-center hover:bg-[#7CB93D] transition-colors"
                                    >
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-display text-lg text-[#1E4C8C] font-medium">
                                {name}
                            </h3>
                            <p className="text-[#6FA82C] text-sm font-semibold mt-1">
                                {role}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
    );
};

// ============================================================
// 9. TESTIMONIALS CAROUSEL
// ============================================================

export const Testimonials = () => {
    const content = usePageContent();
    const testimonials = parseRows(content.about_testimonials, 3, DEFAULT_TESTIMONIALS);
    const total = testimonials.length;
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (total < 2) return undefined;
        const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
        return () => clearInterval(t);
    }, [total]);

    const prev = () => setIdx((i) => (i - 1 + total) % total);
    const next = () => setIdx((i) => (i + 1) % total);

    const active = testimonials[idx] || testimonials[0];

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
                            “{active.quote}”
                        </blockquote>
                        <cite className="not-italic text-slate-600 font-semibold block">
                            {active.name}{' '}
                            <span className="text-[#6FA82C]">— {active.role}</span>
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
                            {testimonials.map((_, i) => (
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

export const CTABanner = () => {
    const content = usePageContent();
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

    return (
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
                <Eyebrow dark>{content.about_cta_eyebrow || "Let's Begin"}</Eyebrow>
                <h2 className="font-display text-3xl md:text-5xl font-medium mb-5 leading-tight">
                    {renderEmph(
                        content.about_cta_title || 'Ready to Find Your *Dream* Property?'
                    )}
                </h2>
                <p className="text-[#F7FAFC]/70 text-lg max-w-xl mb-8">
                    {content.about_cta_sub ||
                        'Get in touch with our advisors to explore exclusive listings tailored to your goals.'}
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
                <p className="font-display text-xl mb-6">
                    {content.about_cta_card_title || 'Reach us directly'}
                </p>
                <ul className="space-y-5">
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Head Office</p>
                            <p className="text-[#F7FAFC]/60 text-sm">
                                {contact?.address || '59/1 Panchanan Tala Road, Howrah- 711101'}
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-[#F7FAFC]/60 text-sm">
                                {contact?.phone || '(+91) 8585033913'}
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-[#8BC53F]/20 text-[#8BC53F] flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-[#F7FAFC]/60 text-sm">
                                {contact?.email || 'info@edgemilerealty.com'}
                            </p>
                        </div>
                    </li>
                </ul>
            </motion.div>
        </div>
    </section>
    );
};

// Keep legacy export name used elsewhere (testimonials + CTA combined view).
export const TestimonialsAndCTA = () => (
    <>
        <Testimonials />
        <CTABanner />
    </>
);

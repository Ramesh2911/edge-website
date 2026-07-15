export default function ContactHero() {
    return (
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Connect With Our Global Advisors</h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Whether buying, selling, or analyzing investments, our global reach and unmatched local brokerage teams ensure direct results.
                </p>
            </div>
        </section>
    );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, FileText, Home } from "lucide-react";
import contentService from "../../services/content.service";

const toParagraphs = (text) =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const PAGES = {
  privacy: {
    prefix: "legal_privacy",
    fallbackTitle: "Privacy Policy",
    description:
      "Learn how Edge Mile Realty collects, uses and protects your personal information.",
  },
  terms: {
    prefix: "legal_terms",
    fallbackTitle: "Terms & Conditions",
    description: "Terms governing your use of the Edge Mile Realty website and services.",
  },
};

export default function LegalPage({ kind = "privacy" }) {
  const cfg = PAGES[kind] || PAGES.privacy;
  const { prefix, fallbackTitle } = cfg;
  const [state, setState] = useState({ loading: true, ready: false, data: null });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, ready: false, data: null });
    contentService
      .getContent()
      .then((res) => {
        if (!alive) return;
        const all = res?.data?.data || {};
        const body = all[`${prefix}_content`] || "";
        setState({
          loading: false,
          ready: Boolean(String(body).trim()),
          data: {
            title: all[`${prefix}_title`] || fallbackTitle,
            updated: all[`${prefix}_updated`] || "",
            content: body,
          },
        });
      })
      .catch(() => {
        if (alive) setState({ loading: false, ready: false, data: null });
      });
    return () => {
      alive = false;
    };
  }, [prefix, fallbackTitle]);

  const title = state.data?.title || fallbackTitle;
  const updated = state.data?.updated || "";
  const paras = state.ready ? toParagraphs(state.data?.content) : [];

  return (
    <>
      <Helmet>
        <title>{`${title} | Edge Mile Realty`}</title>
        <meta name="description" content={cfg.description} />
        <meta property="og:title" content={`${title} | Edge Mile Realty`} />
        <meta property="og:description" content={cfg.description} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero band */}
      <div className="bg-[#153964] text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-[#8BC53F] transition inline-flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/90">{title}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 text-sm text-white/55">{updated}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 sm:py-16">
        {state.loading && (
          <div className="max-w-3xl space-y-4 animate-pulse">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
          </div>
        )}

        {!state.loading && !state.ready && (
          <div className="max-w-2xl text-center mx-auto py-10">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF1FB] text-[#1E4C8C] flex items-center justify-center mx-auto mb-5">
              <FileText size={24} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#1E4C8C] mb-3">
              Content coming soon
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Ei page er content ekhono add kora hoyni. Ashole thakle ektu pore abar try korun.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <Home size={16} /> Back to Home
            </Link>
          </div>
        )}

        {!state.loading && state.ready && (
          <article className="max-w-3xl">
            {paras.map((para, i) => (
              <p
                key={i}
                className="text-slate-600 leading-relaxed text-[15px] sm:text-base mb-5"
              >
                {para}
              </p>
            ))}
          </article>
        )}
      </div>
    </>
  );
}

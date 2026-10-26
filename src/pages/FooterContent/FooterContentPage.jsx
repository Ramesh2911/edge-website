import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, FileText, Home } from "lucide-react";
import footerService from "../../services/footer.service";

const toParagraphs = (text) =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function FooterContentPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, notFound: false, page: null });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, notFound: false, page: null });
    footerService
      .getPageContent(slug)
      .then((res) => {
        const data = res?.data?.data;
        if (!alive) return;
        if (data && data.content && String(data.content).trim()) {
          setState({ loading: false, notFound: false, page: data });
        } else {
          setState({ loading: false, notFound: true, page: null });
        }
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, notFound: true, page: null });
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const label = state.page?.label || slug?.replace(/-/g, " ") || "Page";

  return (
    <>
      <Helmet>
        <title>{label ? `${label} | Edge Mile Realty` : "Edge Mile Realty"}</title>
      </Helmet>

      {/* Hero band */}
      <div className="bg-[#153964] text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-[#8BC53F] transition inline-flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/90 capitalize">{label}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            {label}
          </h1>
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

        {!state.loading && state.notFound && (
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

        {!state.loading && !state.notFound && state.page && (
          <article className="max-w-3xl">
            {toParagraphs(state.page.content).map((para, i) => (
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

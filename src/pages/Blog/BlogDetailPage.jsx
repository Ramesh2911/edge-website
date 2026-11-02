import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Home,
  CalendarDays,
  Newspaper,
  Tag,
} from "lucide-react";
import { blogPosts } from "../../data/staticData";
import blogService from "../../services/blog.service";
import { slugify } from "./BlogPage";
import { resolveImageUrl } from "../../utils/imageUrl";

const GRADIENTS = [
  "from-amber-200 to-orange-100",
  "from-emerald-200 to-teal-100",
  "from-violet-200 to-purple-100",
  "from-rose-200 to-red-100",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fmtDate = (v, fallback) => {
  if (!v) return fallback || "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const toPost = (p, i) => ({
  ...p,
  slug: p.slug || slugify(p.title),
  image: resolveImageUrl(p.image || p.image_url) || "",
  gradient: p.gradient || GRADIENTS[i % GRADIENTS.length],
  displayDate: fmtDate(p.post_date, p.date),
});

const staticByIdSlug = (slug) => {
  const idx = blogPosts.findIndex((p) => slugify(p.title) === slug);
  return idx >= 0 ? toPost(blogPosts[idx], idx) : null;
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setPost(null);

    const fallback = staticByIdSlug(slug);

    blogService
      .getPost(slug)
      .then((res) => {
        if (!alive) return;
        const data = res?.data?.data;
        setPost(data ? toPost(data, 0) : fallback);
      })
      .catch(() => {
        if (alive) setPost(fallback);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    blogService
      .getPosts()
      .then((res) => {
        const data = res?.data?.data;
        if (alive && Array.isArray(data) && data.length) {
          setRelated(data.map(toPost).filter((p) => p.slug !== slug));
        } else if (alive) {
          setRelated(blogPosts.map(toPost).filter((p) => p.slug !== slug));
        }
      })
      .catch(() => {
        if (alive) setRelated(blogPosts.map(toPost).filter((p) => p.slug !== slug));
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  const relatedList = useMemo(() => related.slice(0, 3), [related]);

  if (loading) {
    return (
      <main className="bg-[#FBF7EF] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-16 space-y-5 animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-8 w-5/6 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="bg-[#FBF7EF] min-h-screen flex items-center justify-center px-5">
        <div className="text-center py-16 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF1FB] text-[#1E4C8C] flex items-center justify-center mx-auto mb-5">
            <Newspaper size={24} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E4C8C] mb-3">
            Article not found
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Ei article ta pawa jay na, apni bojhe felun. Onno articles dekhe nen.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Edge Mile Realty`}</title>
        <meta name="description" content={post.excerpt || ""} />
        <meta property="og:title" content={`${post.title} | Edge Mile Realty`} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:type" content="article" />
        {post.image && <meta property="og:image" content={post.image} />}
      </Helmet>

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#153964] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#153964] via-[#1E4C8C]/90 to-[#1E4C8C]/65" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8BC53F]/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-5 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-5 flex-wrap">
            <Link to="/" className="hover:text-[#8BC53F] transition inline-flex items-center gap-1">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-[#8BC53F] transition">
              Blog
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/90 line-clamp-1">{post.title}</span>
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#4C7A1F] bg-[#EAF6DE] rounded-full px-3 py-1">
              {post.tag || "Article"}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-semibold leading-tight mt-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} /> {post.displayDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag size={14} /> {post.tag || "Insights"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover image */}
      {post.image && (
        <div className="bg-[#FBF7EF]">
          <div className="max-w-4xl mx-auto px-5 lg:px-8 -mt-8 relative z-10">
            <div
              className={`h-56 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${post.gradient} shadow-lift border border-white/60`}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Article */}
      <main className="bg-[#FBF7EF]">
        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-6"
        >
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium border-l-4 border-[#6FA82C] pl-5 mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="prose-blog space-y-5">
            <p className="text-slate-600 leading-relaxed text-[15px] sm:text-base">
              At Edge Mile Realty, we believe an informed decision is the first step toward the
              right address. Our team constantly studies buyer behaviour, locality dynamics and
              pricing patterns so you don&apos;t have to guess.
            </p>
            <p className="text-slate-600 leading-relaxed text-[15px] sm:text-base">
              Whether you are a first-time buyer or a seasoned investor, take a moment to explore
              this article, bookmark what resonates, and reach out to our advisors whenever you
              are ready to take the next step.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-[#1E4C8C]/10 flex items-center justify-between gap-4 flex-wrap">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
            >
              <ArrowLeft size={15} /> All articles
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Talk to an advisor <ArrowRight size={14} />
            </Link>
          </div>
        </motion.article>

        {/* Related */}
        {relatedList.length > 0 && (
          <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12 sm:py-16 border-t border-[#1E4C8C]/10 mt-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
                Keep Reading
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-[#1E4C8C] mt-3 font-medium">
                Related Articles
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedList.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group block bg-white rounded-2xl border border-[#1E4C8C]/10 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
                >
                  <div className={`h-40 bg-gradient-to-br ${r.gradient} relative overflow-hidden`}>
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500">{r.displayDate}</p>
                    <h3 className="font-display text-base text-[#1E4C8C] font-medium mt-1 leading-snug group-hover:text-[#6FA82C] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Home, Search, Newspaper } from "lucide-react";
import { blogPosts } from "../../data/staticData";
import blogService from "../../services/blog.service";
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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

export default function BlogPage() {
  const [posts, setPosts] = useState(() => blogPosts.map(toPost));
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    blogService
      .getPosts()
      .then((res) => {
        const data = res?.data?.data;
        if (alive && Array.isArray(data) && data.length) {
          setPosts(data.map(toPost));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const tags = useMemo(
    () => ["all", ...Array.from(new Set(posts.map((p) => p.tag).filter(Boolean)))],
    [posts]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (tag !== "all" && p.tag !== tag) return false;
      if (!s) return true;
      return [p.title, p.excerpt, p.tag].filter(Boolean).some((f) => f.toLowerCase().includes(s));
    });
  }, [posts, q, tag]);

  return (
    <>
      <Helmet>
        <title>Blog | Edge Mile Realty</title>
        <meta
          name="description"
          content="Insights, tips and trends in real estate — buyer guides, market updates and decor ideas from Edge Mile Realty."
        />
        <meta property="og:title" content="Blog | Edge Mile Realty" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#153964] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#153964] via-[#1E4C8C]/90 to-[#1E4C8C]/65" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8BC53F]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 w-96 h-96 rounded-full bg-[#6FA82C]/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-14 sm:py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-2 text-sm text-white/60 mb-5"
            >
              <Link to="/" className="hover:text-[#8BC53F] transition inline-flex items-center gap-1">
                <Home size={14} /> Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-white/90">Blog</span>
            </motion.div>

            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8BC53F]"
            >
              <span className="w-8 h-px bg-[#8BC53F]" /> Insights
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl font-semibold leading-tight mt-4 max-w-2xl"
            >
              Ideas that move you{" "}
              <span className="text-[#8BC53F]">closer to home</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-white/70 mt-4 max-w-xl text-[15px] leading-relaxed"
            >
              Buyer guides, market trends and inspiration — crafted by our property experts.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-[#1E4C8C]/10 sticky top-16 sm:top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1E4C8C]/15 bg-[#F7FAFC] text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6FA82C]/40 focus:border-[#6FA82C] transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  tag === t
                    ? "bg-[#6FA82C] text-white"
                    : "bg-[#EAF6DE] text-[#4C7A1F] hover:bg-[#DCEFC8]"
                }`}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="bg-[#FBF7EF] min-h-screen">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 sm:py-16">
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#1E4C8C]/10 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="h-5 w-4/5 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1FB] text-[#1E4C8C] flex items-center justify-center mx-auto mb-5">
                <Newspaper size={24} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#1E4C8C] mb-3">
                No articles found
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Try a different search or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setTag("all");
                }}
                className="inline-flex items-center gap-2 bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((post) => (
                <motion.article key={post.id} variants={fadeUp}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block h-full bg-white rounded-2xl border border-[#1E4C8C]/10 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
                  >
                    <div className={`h-52 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide text-[#4C7A1F] bg-[#EAF6DE] rounded-full px-2.5 py-1">
                        {post.tag || "Article"}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col">
                      <p className="text-xs text-slate-500">{post.displayDate}</p>
                      <h2 className="font-display text-lg text-[#1E4C8C] font-medium mt-1.5 leading-snug group-hover:text-[#6FA82C] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[#1E4C8C] text-sm font-semibold mt-4">
                        Read More
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

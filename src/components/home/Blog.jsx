import { ArrowRight } from "lucide-react";
import { blogPosts } from "../../data/staticData";

export default function Blog() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-10 sm:py-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Our Blog
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Latest from Our Blog
        </h2>
        <p className="text-slate-500 mt-2 text-[15px]">
          Insights, tips and trends in real estate
        </p>
        <a
          href="#"
          className="inline-block text-sm font-semibold text-[#6FA82C] hover:underline mt-3"
        >
          View All Articles →
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {blogPosts.map((post) => (
          <a
            key={post.id}
            href="#"
            className="group block bg-white rounded-2xl border border-[#1E4C8C]/10 p-3 hover:shadow-lift hover:-translate-y-1 transition-all"
          >
            <div className={`h-40 rounded-xl bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#6FA82C] bg-[#EAF6DE] rounded-full px-2.5 py-1 mt-4">
              {post.tag}
            </span>
            <p className="text-xs text-slate-500 mt-2">{post.date}</p>
            <h3 className="font-display text-base text-[#1E4C8C] font-medium mt-1.5 leading-snug group-hover:text-[#6FA82C] transition-colors">
              {post.title}
            </h3>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-[#1E4C8C] text-xs font-semibold mt-3">
              Read More <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
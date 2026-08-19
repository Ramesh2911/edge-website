import { useState } from "react";
import { Home, Menu, X, ChevronDown } from "lucide-react";
import { navLinks } from "../../data/staticData";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#F7FAFC]/95 backdrop-blur border-b border-[#1E4C8C]/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Edge Realty Logo"
            className="h-20 w-auto object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-7 font-body text-[15px] text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#6FA82C] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="#" className="hover:text-[#6FA82C] transition-colors flex items-center gap-1">
            Projects <ChevronDown size={14} />
          </a>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="/add-property"
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
          >
            List Property
            <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
          </a>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
          >
            Sign in
          </button>
        </div>

        <button
          className="lg:hidden text-[#1E4C8C]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#1E4C8C]/10 bg-[#F7FAFC] px-5 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-slate-600 text-[15px] py-1">
              {link.label}
            </a>
          ))}
          <a href="#" className="text-slate-600 text-[15px] py-1">Projects</a>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="/add-property"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
            >
              List Property
              <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
            </a>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
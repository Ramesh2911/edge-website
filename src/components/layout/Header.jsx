import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navLinks } from "../../data/staticData";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const navigate = useNavigate();

  const activeClass = ({ isActive }) =>
    isActive ? "text-[#6FA82C]" : "hover:text-[#6FA82C] transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-[#F7FAFC]/95 backdrop-blur border-b border-[#1E4C8C]/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Edge Realty Logo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-body text-[15px] text-slate-600">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#6FA82C] transition-colors py-2"
                >
                  {link.label}
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                  <div className="bg-white rounded-xl border border-[#1E4C8C]/10 shadow-lift py-2 min-w-[180px]">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:text-[#6FA82C] hover:bg-[#EAF6DE]/60 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={link.label} to={link.href} end={link.href === "/"} className={activeClass}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/add-property"
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
          >
            List Property
            <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
          </Link>
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
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  type="button"
                  onClick={() => setOpenService(!openService)}
                  className="flex items-center justify-between w-full text-slate-600 text-[15px] py-1"
                >
                  {link.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${openService ? "rotate-180" : ""}`}
                  />
                </button>
                {openService && (
                  <div className="pl-4 mt-1 flex flex-col gap-2 border-l border-[#1E4C8C]/10 ml-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={() => setOpen(false)}
                        className="text-slate-500 text-sm py-0.5 hover:text-[#6FA82C]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.label}
                to={link.href}
                end={link.href === "/"}
                onClick={() => setOpen(false)}
                className={activeClass}
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/add-property"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
            >
              List Property
              <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/login");
              }}
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

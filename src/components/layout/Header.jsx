import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  ClipboardList,
  KeyRound,
  UserRound,
  Building2,
  LogOut,
  Lock,
} from "lucide-react";
import { navLinks } from "../../data/staticData";
import { getMenusForRole } from "../../data/roleMenus";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/auth.service";
import { resolveImageUrl } from "../../utils/imageUrl";
import logo from "../../assets/logo.png";

// ------------------------------------------------------------
// Static menu data
// ------------------------------------------------------------

const GUEST_MENU = [
  { to: "/add-property", icon: Building2, label: "List Your Property" },
  { to: "/wishlist", icon: Heart, label: "Shortlisted Properties" },
  { to: "/buyer-requirement", icon: ClipboardList, label: "My Requirements" },
  { to: "/forgot-password", icon: KeyRound, label: "Forgot Password" },
];

const ROLE_BADGE = {
  Buyer: "bg-[#EAF6DE] text-[#6FA82C] border-[#8BC53F]/40",
  Owner: "bg-[#EAF0F8] text-[#1E4C8C] border-[#1E4C8C]/25",
  Broker: "bg-[#FCF3DC] text-[#C8972E] border-[#C8972E]/30",
  Developer: "bg-[#F0EAF8] text-[#6B4C9A] border-[#6B4C9A]/30",
};

const menuItemClass =
  "flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 hover:text-[#6FA82C] hover:bg-[#EAF6DE]/60 transition-colors";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = (user?.role_name || "").toLowerCase();
  const isBuyer = role === "buyer";
  const firstName = user?.full_name?.split(" ")[0] || "there";
  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const accountLinks = getMenusForRole(role);

  const activeClass = ({ isActive }) =>
    isActive ? "text-[#6FA82C]" : "hover:text-[#6FA82C] transition-colors";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // token already invalid — ignore
    }
    logout();
    navigate("/");
  };

  const Avatar = ({ size = "md" }) => {
    const dim = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
    if (user?.profile_image) {
      return (
        <img
          src={resolveImageUrl(user.profile_image)}
          alt={user?.full_name || "User"}
          className={`${dim} rounded-full object-cover border-2 border-[#8BC53F]`}
        />
      );
    }
    return (
      <span
        className={`${dim} rounded-full bg-[#1E4C8C] text-white font-semibold flex items-center justify-center shrink-0`}
      >
        {initials}
      </span>
    );
  };

  // ----------------------------------------------------------
  // Desktop account dropdown (guest + logged-in)
  // ----------------------------------------------------------
  const DesktopAccount = () => (
    <div className="relative group">
      {user ? (
        <button
          type="button"
          className="flex items-center gap-2 py-2 text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
        >
          <Avatar />
          <span className="max-w-[90px] truncate">{firstName}</span>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 py-2 text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
        >
          Sign in
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
        </button>
      )}

      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
        <div className="bg-white rounded-xl border border-[#1E4C8C]/10 shadow-lift py-2 min-w-[250px]">
          {user ? (
            <>
              <div className="px-4 pt-1 pb-2.5 border-b border-[#1E4C8C]/10">
                <p className="text-sm font-semibold text-slate-700">
                  Hi, {firstName}
                </p>
                <span
                  className={`mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                    ROLE_BADGE[user?.role_name] || ROLE_BADGE.Buyer
                  }`}
                >
                  {user?.role_name || "Member"}
                </span>
              </div>

              {accountLinks.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={menuItemClass}>
                  <Icon size={16} className="shrink-0" />
                  {label}
                </Link>
              ))}

              <div className="my-1.5 border-t border-[#1E4C8C]/10" />

              <Link to="/change-password" className={menuItemClass}>
                <Lock size={16} className="shrink-0" />
                Change Password
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="shrink-0" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="px-4 pt-1 pb-2.5">
                <p className="text-sm font-semibold text-slate-700">
                  New to Edge Realty?
                </p>
                <Link
                  to="/register"
                  className="mt-2 flex items-center justify-center gap-1.5 w-full bg-[#7CB93D] hover:bg-[#6FA82C] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="mt-2 flex items-center justify-center gap-1.5 w-full border border-[#1E4C8C]/25 text-[#1E4C8C] hover:bg-[#EAF0F8] text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

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
          {(!user || !isBuyer) && (
            <Link
              to="/add-property"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
            >
              List Property
              <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
            </Link>
          )}
          <DesktopAccount />
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

          {/* My Account accordion */}
          <div className="border-t border-[#1E4C8C]/10 pt-2">
            <button
              type="button"
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center justify-between w-full text-slate-600 text-[15px] py-1"
            >
              <span className="flex items-center gap-2">
                {user ? <Avatar size="sm" /> : <UserRound size={16} />}
                {user ? `Hi, ${firstName}` : "My Account"}
              </span>
              <ChevronDown
                size={15}
                className={`transition-transform ${openAccount ? "rotate-180" : ""}`}
              />
            </button>

            {openAccount && (
              <div className="pl-4 mt-1 flex flex-col gap-2 border-l border-[#1E4C8C]/10 ml-1">
                {user ? (
                  <>
                    {user?.role_name && (
                      <span
                        className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          ROLE_BADGE[user.role_name] || ROLE_BADGE.Buyer
                        }`}
                      >
                        {user.role_name}
                      </span>
                    )}
                    {accountLinks.map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-slate-500 text-sm py-0.5 hover:text-[#6FA82C]"
                      >
                        <Icon size={14} />
                        {label}
                      </Link>
                    ))}
                    <Link
                      to="/change-password"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-slate-500 text-sm py-0.5 hover:text-[#6FA82C]"
                    >
                      <Lock size={14} />
                      Change Password
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 text-red-600 text-sm py-0.5"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-1.5 bg-[#7CB93D] hover:bg-[#6FA82C] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                    >
                      Create Account
                    </Link>
                    {GUEST_MENU.map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-slate-500 text-sm py-0.5 hover:text-[#6FA82C]"
                      >
                        <Icon size={14} />
                        {label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {(!user || !isBuyer) && (
              <Link
                to="/add-property"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F] px-3 py-1.5 rounded-full"
              >
                List Property
                <span className="bg-[#7CB93D] text-white text-[10px] px-1.5 py-0.5 rounded-full">FREE</span>
              </Link>
            )}
            {!user && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="text-sm font-semibold text-[#1E4C8C] hover:text-[#6FA82C] transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

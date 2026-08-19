import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { footerLinks } from "../../data/staticData";
import logo from "../../assets/logo.png";

const socials = ["F", "IG", "X", "IN"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) return;

    setSubscribed(true);
    setEmail("");

    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#153964] text-[#F7FAFC]/80">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="bg-[#EAF1FB] rounded-2xl p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="font-display text-lg text-[#1E4C8C] font-medium">
              Subscribe to Our Newsletter
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Get the latest property news, market trends and insights
              delivered straight to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 sm:w-64 bg-white border border-[#1E4C8C]/15 rounded-xl px-4 py-3 text-sm text-[#1E4C8C] focus:outline-none focus:ring-2 focus:ring-[#7CB93D]"
            />

            <button
              type="submit"
              className="bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {subscribed && (
          <p className="text-[#8BC53F] text-sm mt-3">
            Thanks for subscribing! Check your inbox soon.
          </p>
        )}
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Logo */}
          <div>
            <a href="#">
              <img
                src={logo}
                alt="Edge Mile Realty"
                className="h-20 w-auto object-contain"
              />
            </a>

            <p className="mt-5 text-sm leading-7">
              Helping you find premium homes crafted for comfort, luxury and a
              better lifestyle across India.
            </p>

            <div className="flex gap-3 mt-6">
              {socials.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold hover:bg-[#7CB93D] hover:text-[#153964] transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-lg mb-5">
                {title}
              </h3>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-[#8BC53F] transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0" />
                <span>Sector 18, Gurugram, Haryana</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>+91 98765 43210</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>hello@edgemilerealty.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#F7FAFC]/50">
            © {currentYear} Edge Mile Realty. All Rights Reserved.
          </p>

          <div className="flex gap-5 text-xs">
            <a href="#" className="hover:text-[#8BC53F]">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-[#8BC53F]">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
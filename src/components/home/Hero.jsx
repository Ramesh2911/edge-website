import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Mic,
  Building2,
  MapPin,
  TrendingUp,
  Landmark,
  Megaphone,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { quickLinks, heroSlides } from "../../data/staticData";
import propertyService from "../../services/property.service";
import HeroSlider from "./HeroSlider";

const iconMap = { Building2, MapPin, TrendingUp, Landmark, Megaphone };

export default function Hero() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [propType, setPropType] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await propertyService.getCategories();
        
        console.log("Categories API Response:", res); // Debug log to check payload structure

        // Handles Axios wrappers (res.data.data) as well as direct responses (res.data or res)
        let categoryList = [];
        if (Array.isArray(res?.data?.data)) {
          categoryList = res.data.data;
        } else if (Array.isArray(res?.data)) {
          categoryList = res.data;
        } else if (Array.isArray(res)) {
          categoryList = res;
        }

        setCategories(categoryList);

        // Auto-select the first category if available
        if (categoryList.length > 0) {
          setPropType(categoryList[0].category_name);
        }
      } catch (error) {
        console.error("Failed to fetch property categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      navigate("/properties");
    } else {
      navigate(`/properties?keyword=${encodeURIComponent(query)}`);
    }
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice search is not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      navigate(`/properties?keyword=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <section className="bg-gradient-to-b from-[#F7FAFC] to-[#FBF7EF]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-8 pb-4 sm:pb-6">
          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-lift p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative sm:w-52 shrink-0">
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  disabled={isLoading}
                  className="w-full appearance-none bg-[#EAF1FB] border border-[#1E4C8C]/10 rounded-xl pl-4 pr-9 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7CB93D] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    <>
                      <option value="" disabled>
                        Select Property Type
                      </option>
                      {categories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.category_name}
                          className="text-slate-800 bg-white"
                        >
                          {cat.category_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>

              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by city, locality, project or builder"
                  className="w-full bg-[#EAF1FB] border border-[#1E4C8C]/10 rounded-xl pl-11 pr-11 py-3.5 text-sm text-[#1E4C8C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]"
                />
                <button
                  type="button"
                  aria-label="Voice search"
                  onClick={handleVoiceSearch}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isListening
                      ? "text-red-500 animate-pulse"
                      : "text-slate-500 hover:text-[#6FA82C]"
                  }`}
                >
                  <Mic size={18} />
                </button>
              </div>

              <button
                onClick={handleSearch}
                className="bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-8 py-3.5 shadow-card"
              >
                Search
              </button>
            </div>

            {message && (
              <p className="mt-3 text-xs font-medium text-[#6FA82C] bg-[#EAF6DE] rounded-lg px-3 py-2 inline-block">
                {message}
              </p>
            )}
          </div>

          {/* Quick links strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {quickLinks.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <button
                  key={item.label}
                  className="group flex items-center gap-2.5 bg-white/70 hover:bg-white border border-[#1E4C8C]/10 rounded-xl px-3.5 py-3 text-left transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EAF6DE] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#6FA82C]" />
                  </span>
                  <span className="text-xs font-semibold text-slate-600 leading-tight">
                    {item.label}
                  </span>
                  <ArrowRight
                    size={13}
                    className="ml-auto text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
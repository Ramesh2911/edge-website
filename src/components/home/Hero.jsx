import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Mic,
  Eye,
  ChevronDown,
} from "lucide-react";
import { heroSlides } from "../../data/staticData";
import propertyService from "../../services/property.service";
import HeroSlider from "./HeroSlider";

const RECENT_KEY = "edge_recent_searches";
const RECENT_MAX = 8;

const loadRecent = () => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export default function Hero() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [propType, setPropType] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recent, setRecent] = useState(loadRecent);
  const [showRecent, setShowRecent] = useState(false);

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

  const pushRecent = (term) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, RECENT_MAX);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — panel just won't persist */
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      navigate("/properties");
    } else {
      pushRecent(query);
      navigate(`/properties?keyword=${encodeURIComponent(query)}`);
    }
    setShowRecent(false);
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
      pushRecent(transcript);
      navigate(`/properties?keyword=${encodeURIComponent(transcript)}`);
      setShowRecent(false);
    };

    recognition.start();
  };

  return (
    <>
      <HeroSlider slides={heroSlides} />

      {/* Search card — straddles the hero's bottom edge (half on image, half below) */}
      <div className="relative z-20 -mt-8 sm:-mt-10 mb-4 sm:mb-6 px-4 sm:px-14">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-3 sm:p-4">
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
                onFocus={() => setShowRecent(false)}
                placeholder='Search "Farm house in Punjab below 1 cr"'
                className="w-full bg-[#EAF1FB] border border-[#1E4C8C]/10 rounded-xl pl-11 pr-20 py-3.5 text-sm text-[#1E4C8C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]"
              />
              <button
                type="button"
                aria-label="Recent searches"
                aria-expanded={showRecent}
                onClick={() => setShowRecent((v) => !v)}
                className={`absolute right-9 top-1/2 -translate-y-1/2 transition-colors ${
                  showRecent
                    ? "text-[#7CB93D]"
                    : "text-slate-500 hover:text-[#1E4C8C]"
                }`}
              >
                <Eye size={18} />
              </button>
              <button
                type="button"
                aria-label="Voice search"
                onClick={handleVoiceSearch}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isListening
                    ? "text-red-500 animate-pulse"
                    : "text-slate-500 hover:text-[#6FA82C]"
                }`}
              >
                <Mic size={18} />
              </button>

              {/* Recent searches panel */}
              {showRecent && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowRecent(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 z-30 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] py-1 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between px-3 py-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Recent searches
                      </span>
                      {recent.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setRecent([]);
                            try {
                              localStorage.removeItem(RECENT_KEY);
                            } catch {
                              /* ignore */
                            }
                          }}
                          className="text-[11px] font-semibold text-slate-400 hover:text-red-500"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {recent.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-400">No recent searches</p>
                    ) : (
                      recent.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setQuery(r);
                            pushRecent(r);
                            navigate(`/properties?keyword=${encodeURIComponent(r)}`);
                            setShowRecent(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-[#EAF1FB] hover:text-[#1E4C8C] flex items-center gap-2"
                        >
                          <Search size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">{r}</span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-semibold text-sm rounded-xl px-8 py-3.5 shadow-card"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
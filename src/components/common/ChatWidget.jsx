import { useState, useRef, useEffect, useMemo } from "react";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react";
import propertyService from "../../services/property.service";
import { resolveImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/formatPrice";

// ------------------------------------------------------------
// Static intent replies (used only when no DB match is found)
// ------------------------------------------------------------

const INTENT_REPLIES = [
  {
    words: ["post", "sell", "list", "rent out"],
    text: "To list your property, please login and visit the 'Add Property' page. It's quick and easy!",
  },
  {
    words: ["contact", "phone", "email", "call", "support"],
    text: "You can reach us at support@edgemilerealty.com or call us at +91-XXXXX-XXXXX",
  },
  {
    words: ["where", "location", "address", "office"],
    text: "We are located in India and serve properties across major cities.",
  },
  {
    words: ["help", "what can you"],
    text: "I can help you with: searching properties, listing properties, contacting us, and general queries. What would you like to know?",
  },
];

const GREETING =
  "Hello! Welcome to EDGE MILE REALTY. Ask me anything about properties, or tap a category below to explore.";

const FALLBACK_HELP =
  "I'm here to help! You can ask me about properties, listing, or contact information. Meanwhile, here are some suggestions from our listings:";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const getPrice = (p) => formatPrice(p?.price);

const getLocation = (p) => {
  if (p?.city) return `${p.city}${p.state ? `, ${p.state}` : ""}`;
  return p?.address || "Location N/A";
};

const unwrap = (res) => {
  const data = res?.data?.data ?? res?.data ?? [];
  return Array.isArray(data) ? data : [];
};

const matchesIntent = (input) => {
  const lower = input.toLowerCase();
  return INTENT_REPLIES.find((r) => r.words.some((w) => lower.includes(w)));
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [categories, setCategories] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const categoriesLoadedRef = useRef(false);

  const SpeechAPI = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null,
    []
  );
  const voiceSupported = Boolean(SpeechAPI);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Load category chips from DB the first time the panel opens
  useEffect(() => {
    if (!isOpen || categoriesLoadedRef.current) return;
    categoriesLoadedRef.current = true;
    propertyService
      .getCategories()
      .then((res) => {
        const data = unwrap(res).filter((c) => c.status !== 0);
        setCategories(data.slice(0, 8));
      })
      .catch(() => setCategories([]));
  }, [isOpen]);

  const pushMessage = (msg) =>
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }]);

  // ----------------------------------------------------------
  // Core reply flow: intent → DB search → fallback + latest
  // ----------------------------------------------------------
  const respond = async (text) => {
    setTyping(true);
    try {
      // 1) Action intents (post/list/contact/help) — no DB search needed
      const intent = matchesIntent(text);
      if (intent && !/property|home|apartment|villa|flat|house/i.test(text)) {
        pushMessage({ sender: "bot", text: intent.text });
        setTyping(false);
        return;
      }

      // 2) Search the project database
      let results = [];
      try {
        const res = await propertyService.searchProperty(text.trim());
        results = unwrap(res);
      } catch {
        results = [];
      }

      // Category-name fallback (e.g. "Villa") — match via category_id
      if (results.length === 0 && categories.length > 0) {
        const cat = categories.find(
          (c) => c.category_name.toLowerCase() === text.trim().toLowerCase()
        );
        if (cat) {
          try {
            const listRes = await propertyService.propertyList({ limit: 50 });
            const all = unwrap(listRes);
            results = all.filter((p) => p.category_id === cat.id);
          } catch {
            results = [];
          }
        }
      }

      if (results.length > 0) {
        const top = results.slice(0, 3);
        pushMessage({
          sender: "bot",
          text: `Found ${results.length} propert${
            results.length === 1 ? "y" : "ies"
          } matching "${text.trim()}". Here are the top picks:`,
          kind: "properties",
          properties: top,
        });
      } else {
        // 3) No match — static reply + latest listings from DB
        const intentReply = matchesIntent(text)?.text;
        let latest = [];
        try {
          const res = await propertyService.getLatestProperties();
          latest = unwrap(res).slice(0, 3);
        } catch {
          latest = [];
        }
        pushMessage({
          sender: "bot",
          text: intentReply || FALLBACK_HELP,
          ...(latest.length > 0 && {
            kind: "properties",
            properties: latest,
          }),
        });
      }
    } catch {
      pushMessage({
        sender: "bot",
        text: FALLBACK_HELP,
      });
    } finally {
      setTyping(false);
    }
  };

  const handleSend = (override) => {
    const trimmed = (typeof override === "string" ? override : input).trim();
    if (!trimmed || typing) return;

    pushMessage({ sender: "user", text: trimmed });
    setInput("");
    respond(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ----------------------------------------------------------
  // Voice input — speaks → auto-send
  // ----------------------------------------------------------
  const handleVoice = () => {
    if (!voiceSupported) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    try {
      const rec = new SpeechAPI();
      recognitionRef.current = rec;
      rec.lang = "en-IN";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript); // auto-send
      };

      rec.start();
    } catch {
      setListening(false);
    }
  };

  // ----------------------------------------------------------
  // Property suggestion card
  // ----------------------------------------------------------
  const PropertyCard = ({ property: p }) => {
    const image = p?.images?.[0] || p?.image_url || p?.cover_image || "";
    return (
      <a
        href={`/properties/details/${p.id}`}
        className="flex gap-2.5 bg-white border border-[#1E4C8C]/10 rounded-xl p-2 hover:border-[#8BC53F] hover:shadow-card transition-all"
      >
        <div className="w-16 h-16 rounded-lg bg-[#EAF6DE] overflow-hidden shrink-0 flex items-center justify-center">
          {image ? (
            <img
              src={resolveImageUrl(image)}
              alt={p.property_title || "Property"}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <Building2 size={20} className="text-[#7CB93D]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[13px] font-semibold text-[#1E4C8C] truncate leading-tight"
            title={p.property_title}
          >
            {p.property_title || "Untitled Property"}
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
            <MapPin size={10} className="shrink-0" />
            {getLocation(p)}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm font-bold text-[#6FA82C]">
              {getPrice(p)}
            </span>
            <span className="text-[11px] font-semibold text-[#1E4C8C]">
              View Details →
            </span>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {isOpen && (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#1E4C8C] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8BC53F] flex items-center justify-center">
                <span className="text-white font-display text-xs font-bold">
                  EM
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">
                  EDGE MILE REALTY Support
                </p>
                <p className="text-[10px] text-blue-200 mt-0.5">
                  We typically reply in a few minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-72 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#7CB93D] text-white rounded-br-md"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  <span>{msg.text}</span>
                  {msg.kind === "properties" && msg.properties && (
                    <div className="mt-2 space-y-2">
                      {msg.properties.map((p) => (
                        <PropertyCard key={p.id} property={p} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-3.5 py-3 shadow-sm">
                  <Loader2
                    size={16}
                    className="animate-spin text-[#7CB93D]"
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Category suggestion chips (from DB) */}
          {categories.length > 0 && (
            <div className="px-3 pt-2.5 pb-1 bg-white border-t border-slate-100">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSend(cat.category_name)}
                    className="shrink-0 text-[11px] font-semibold text-[#1E4C8C] bg-[#EAF6DE] border border-[#8BC53F]/40 hover:bg-[#8BC53F] hover:text-white transition-colors rounded-full px-2.5 py-1"
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input + voice + send */}
          <div className="border-t border-slate-200 bg-white p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                listening ? "Listening..." : "Type or speak your message..."
              }
              className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]"
            />
            <button
              onClick={handleVoice}
              disabled={!voiceSupported}
              title={
                voiceSupported
                  ? listening
                    ? "Stop voice input"
                    : "Speak your message"
                  : "Voice input not supported in this browser"
              }
              aria-label="Voice input"
              className={`rounded-xl p-2.5 transition-colors border ${
                listening
                  ? "bg-red-500 border-red-600 text-white animate-pulse"
                  : voiceSupported
                    ? "bg-slate-100 border-slate-200 text-[#1E4C8C] hover:bg-[#EAF6DE] hover:border-[#8BC53F]"
                    : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Mic size={16} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || typing}
              className="bg-[#7CB93D] hover:bg-[#6FA82C] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-colors"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`ml-auto flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? "bg-slate-600 hover:bg-slate-700"
            : "bg-[#7CB93D] hover:bg-[#6FA82C]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
    </div>
  );
}

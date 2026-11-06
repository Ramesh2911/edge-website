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
// Intent replies — matched by keyword, in order
// ------------------------------------------------------------

const INTENT_REPLIES = [
  // Greetings — plain text, no property search
  {
    words: ["hi", "hello", "hey", "hii", "helo", "namaste", "good morning", "good evening", "good afternoon", "yo"],
    text: "Hello! 👋 Welcome to EDGE MILE REALTY. How can I help you today?",
    kind: "text",
  },
  // Small talk
  {
    words: ["how are you", "how r u", "how are u", "how do you do", "whats up", "what's up", "how's it going", "how is it going", "you okay", "you ok"],
    text: "I'm doing great, thanks for asking! 😊\nHow can I help you — looking for a property, or something else?",
    kind: "text",
  },
  // Farewell
  {
    words: ["bye", "goodbye", "see you", "take care", "good night", "gtg"],
    text: "Goodbye! 👋 Have a great day. Feel free to come back anytime if you need help with properties.",
    kind: "text",
  },
  // Thanks
  {
    words: ["thank", "thanks", "thank you", "thx", "appreciate"],
    text: "You're welcome! 😊 Is there anything else I can help you with — property search, listing, or contact details?",
    kind: "text",
  },
  // Identity
  {
    words: ["who are you", "what are you", "your name", "are you a bot", "are you human", "introduce"],
    text: "I'm the EDGE MILE REALTY assistant — a property help bot. I can help you search homes, flats, villas, plots and commercial spaces, or guide you on listing and support.",
    kind: "text",
  },
  // Capabilities
  {
    words: ["what can you", "help me", "how to use", "options", "commands", "features"],
    text: "I can help you with:\n• Searching properties (try: \"3 BHK in Mumbai\", \"Villa\", \"Plot\")\n• Listing your property\n• Contact & support info\n• General questions about EDGE MILE REALTY\n\nWhat would you like to know?",
    kind: "text",
  },
  // Post / list
  {
    words: ["post", "sell", "list my", "list a", "rent out", "how to list", "add property", "upload property"],
    text: "To list your property, login and visit the 'Add Property' page. Fill in the details, upload photos, and submit — our team will review it before it goes live. It's quick and easy!",
    kind: "text",
  },
  // Contact
  {
    words: ["contact", "phone", "email", "call", "support", "number", "whatsapp"],
    text: "You can reach us at support@edgemilerealty.com or call us at +91-XXXXX-XXXXX. You can also use the Contact page on this site for a quick callback.",
    kind: "text",
  },
  // Location / office
  {
    words: ["where is your office", "office address", "your location", "office location"],
    text: "We are based in India and serve properties across major cities. For our office address, please check the Contact page.",
    kind: "text",
  },
  // Price / budget questions (generic — not a property search)
  {
    words: ["what is your commission", "commission", "fees", "charges", "brokerage", "zero brokerage"],
    text: "EDGE MILE REALTY offers zero-brokerage on listings for owners. For buyers, any applicable service charges are always shared transparently before you proceed.",
    kind: "text",
  },
  // About company
  {
    words: ["about you", "about edge", "about company", "who is edge", "what is edge"],
    text: "EDGE MILE REALTY is a premium real estate platform for verified residential and commercial properties — focused on zero-brokerage listings and a smooth buy/rent experience.",
    kind: "text",
  },
  // Jokes / fun
  {
    words: ["joke", "funny", "make me laugh"],
    text: "Why did the house go to therapy? 🏠\nBecause it had too many unresolved foundation issues! 😄\n\nOkay — back to real estate. Need help finding a property?",
    kind: "text",
  },
];

const GREETING =
  "Hello! Welcome to EDGE MILE REALTY. Ask me anything about properties, or tap a category below to explore.";

const FALLBACK_HELP =
  "Hmm, I didn't quite catch that 🤔\n\nYou can ask me things like:\n• \"2 BHK in Mumbai\"\n• \"Villa for rent\"\n• \"How do I list a property?\"\n• \"Contact support\"";

// Words that mean the user is looking for a property
const PROPERTY_WORDS =
  /property|properties|home|homes|apartment|apartments|villa|villas|flat|flats|house|houses|plot|plots|office|shop|commercial|rent|buy|sale|bedroom|bed|bhk|kitchen|budget|price|cheap|luxury|near|location|city|area|sq|garden|parking/i;

const isPropertyQuery = (text) => PROPERTY_WORDS.test(text);

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
  const lower = input.toLowerCase().trim();
  // Greeting words like "hi" must match whole-ish tokens so "this" doesn't hit "hi"
  return INTENT_REPLIES.find((r) =>
    r.words.some((w) => {
      if (w.length <= 3) {
        // short words: token match (hi, hey, bye, thx…)
        return new RegExp(`(^|[^a-z])${w}([^a-z]|$)`).test(lower);
      }
      return lower.includes(w);
    })
  );
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
  // Core reply flow:
  //   greeting/conversation → plain text
  //   property query        → DB search (+ cards only if hits)
  //   otherwise             → helpful text (no forced property dump)
  // ----------------------------------------------------------
  const respond = async (text) => {
    setTyping(true);
    try {
      const trimmed = text.trim();

      // 1) Conversational intents — always plain text, never property search
      const intent = matchesIntent(trimmed);
      const looksLikeProperty = isPropertyQuery(trimmed);

      if (intent && !looksLikeProperty) {
        pushMessage({ sender: "bot", text: intent.text });
        return;
      }

      // 2) Property-related query → search the database
      if (looksLikeProperty) {
        let results = [];
        try {
          const res = await propertyService.searchProperty(trimmed);
          results = unwrap(res);
        } catch {
          results = [];
        }

        // Category-name fallback (e.g. "Villa") — match via category_id
        if (results.length === 0 && categories.length > 0) {
          const cat = categories.find(
            (c) => c.category_name.toLowerCase() === trimmed.toLowerCase()
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

        // Token fallback — multi-word queries that miss SQL LIKE
        if (results.length === 0) {
          const tokens = trimmed.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
          if (tokens.length) {
            try {
              const listRes = await propertyService.propertyList({ limit: 50 });
              const all = unwrap(listRes);
              results = all.filter((p) => {
                const text = [p.property_title, p.description, p.city, p.address, p.state, p.property_type]
                  .map((v) => String(v || "").toLowerCase())
                  .join(" ");
                return tokens.every((t) => text.includes(t));
              });
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
            } matching "${trimmed}". Here are the top picks:`,
            kind: "properties",
            properties: top,
          });
          return;
        }

        // Property query but no hits — offer latest as a suggestion
        let latest = [];
        try {
          const res = await propertyService.getLatestProperties();
          latest = unwrap(res).slice(0, 3);
        } catch {
          latest = [];
        }
        pushMessage({
          sender: "bot",
          text: `I couldn't find exact matches for "${trimmed}". Here are some recent listings you might like:`,
          ...(latest.length > 0 && {
            kind: "properties",
            properties: latest,
          }),
        });
        return;
      }

      // 3) Non-property question with no intent match — plain helpful text
      //    (do NOT dump unrelated properties)
      const followUp = intent?.text;
      pushMessage({
        sender: "bot",
        text:
          followUp ||
          FALLBACK_HELP,
      });
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
                  className={`max-w-[88%] px-3.5 py-2.5 text-sm rounded-2xl leading-relaxed whitespace-pre-line break-words ${
                    msg.sender === "user"
                      ? "bg-[#7CB93D] text-white rounded-br-md"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.text}
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

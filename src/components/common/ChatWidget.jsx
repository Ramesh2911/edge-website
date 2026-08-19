import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const botResponses = {
  hello: "Hello! Welcome to EDGE MILE REALTY. How can I help you today?",
  hi: "Hello! Welcome to EDGE MILE REALTY. How can I help you today?",
  property:
    "You can search properties using our search page. Would you like me to help you find something specific?",
  properties:
    "You can search properties using our search page. Would you like me to help you find something specific?",
  search:
    "You can search properties using our search page. Would you like me to help you find something specific?",
  post: "To list your property, please login and visit the 'Add Property' page. It's quick and easy!",
  sell: "To list your property, please login and visit the 'Add Property' page. It's quick and easy!",
  list: "To list your property, please login and visit the 'Add Property' page. It's quick and easy!",
  contact:
    "You can reach us at support@edgemilerealty.com or call us at +91-XXXXX-XXXXX",
  phone: "You can reach us at support@edgemilerealty.com or call us at +91-XXXXX-XXXXX",
  email: "You can reach us at support@edgemilerealty.com or call us at +91-XXXXX-XXXXX",
  location: "We are located in India and serve properties across major cities.",
  address: "We are located in India and serve properties across major cities.",
  help: "I can help you with: searching properties, listing properties, contacting us, and general queries. What would you like to know?",
};

function getBotResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const [keyword, response] of Object.entries(botResponses)) {
    if (lower.includes(keyword)) {
      return response;
    }
  }
  return "I'm here to help! You can ask me about properties, listing, or contact information.";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! Welcome to EDGE MILE REALTY. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: getBotResponse(trimmed),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                  className={`max-w-[80%] px-3.5 py-2.5 text-sm rounded-2xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#7CB93D] text-white rounded-br-md"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
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

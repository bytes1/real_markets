// "use client"; // <-- REMOVED THIS LINE

import { useEffect, useRef, type ReactNode, useState } from "react";
import { useChat } from "@ai-sdk/react";
import Message from "./message";

// Helper component for SVG icons (No changes needed here)
const Icon = ({
  path,
  className = "w-5 h-5",
}: {
  path: ReactNode;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
);

// Main Chat Interface Component
export default function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ✅ STEP 1: Add state to manage the chat visibility
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Effect to auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- CONTENT UPDATED ---
  // Data for quick action buttons
  const quickActions = [
    {
      id: "hot-markets",
      label: "Hot Markets",
      icon: "🔥",
      query: "What are the most popular markets right now?",
    },
    {
      id: "my-portfolio",
      label: "My Portfolio",
      icon: "📊",
      query: "Show me my current positions and P&L.",
    },
    {
      id: "how-to-trade",
      label: "How to Trade",
      icon: "📈",
      query: "How do I buy 'YES' or 'NO' shares?",
    },
    {
      id: "resolutions",
      label: "Market Results",
      icon: "✅",
      query: "Which markets have resolved recently?",
    },
  ];

  // Handlers for user actions
  const handleQuickAction = (query: string) => {
    if (append) {
      append({ role: "user", content: query });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isChatOpen ? (
        // ✅ STEP 2: Conditionally render the full chat window
        <main className="w-[450px] h-[700px] flex flex-col bg-gray-900/60 backdrop-blur-sm shadow-2xl border border-indigo-500/10 rounded-2xl overflow-hidden animate-fade-in-up">
          <header className="p-4 border-b border-indigo-500/20 flex justify-between items-center flex-shrink-0 bg-gray-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                {/* --- CONTENT UPDATED --- */}
                <span className="text-2xl">📈</span>
              </div>
              <div>
                {/* --- CONTENT UPDATED --- */}
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                  Real Market Assistant
                </h1>
                {/* --- CONTENT UPDATED --- */}
                <p className="text-xs text-gray-400">
                  Your Prediction Market Guide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                  }`}
                ></span>
                {/* --- CONTENT UPDATED --- */}
                {isLoading ? "Thinking..." : "RealBot Active"}
              </div>
              {/* ✅ ADDED: Close button inside the header */}
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <Icon
                  path={<path d="M18 6 6 18M6 6l12 12" />} // Simple 'X' icon path
                  className="w-5 h-5"
                />
              </button>
            </div>
          </header>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin] [scrollbar-color:#4a5568_#2d3748]"
          >
            {messages.length > 0 ? (
              messages.map((message) => (
                <Message key={message.id} message={message} />
              ))
            ) : (
              // --- CONTENT UPDATED (Welcome Message) ---
              <div className="flex flex-col justify-center items-center h-full text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-4xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-200 mb-2">
                    Welcome to the Real Market Assistant!
                  </h2>
                  <p className="text-gray-400 max-w-md">
                    I'm RealBot. I can help you find markets, check your
                    portfolio, or understand how to trade. How can I help you
                    today?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.query)}
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-indigo-500/40 rounded-lg transition-all text-sm flex items-center gap-2"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-gray-300">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-indigo-500/20 bg-gray-800/30">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                value={input}
                onChange={handleInputChange}
                // --- CONTENT UPDATED ---
                placeholder="Ask about markets, trading, or your portfolio..."
                className="flex-1 p-3 bg-gray-700/60 border border-gray-600/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input || input.trim() === ""}
                className="p-3 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg hover:from-indigo-500 hover:to-indigo-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-110 shadow-lg disabled:transform-none disabled:opacity-50"
                aria-label="Send message"
              >
                <Icon
                  path={
                    <>
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </>
                  }
                  className="text-white w-5 h-5"
                />
              </button>
            </form>
          </div>
        </main>
      ) : (
        // ✅ STEP 3: Render a floating button to re-open the chat
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out"
          aria-label="Open chat"
        >
          <span className="text-3xl">🤖</span>
        </button>
      )}
    </div>
  );
}

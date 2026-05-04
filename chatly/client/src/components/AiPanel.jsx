import React, { useEffect, useState } from "react";

const AiPanel = ({ query, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setAnswer("");
    setCopied(false);

    fetch(`${backendUrl}/api/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAnswer("Error: " + data.error);
        } else {
          setAnswer(data.answer || "No response from Gemini.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setAnswer("Network error: Could not reach server. Is your backend running?");
        setLoading(false);
      });
  }, [query]);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="bg-[#1e1b2e] border border-violet-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-violet-500/20 bg-violet-600/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-white font-semibold text-base">Gemini AI</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Query */}
        <div className="px-5 pt-4">
          <p className="text-xs text-violet-300 uppercase tracking-widest mb-1">You asked</p>
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2 text-sm text-white">
            {query}
          </div>
        </div>

        {/* Answer */}
        <div className="px-5 py-4 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="animate-spin inline-block text-violet-400">⟳</span>
              Thinking...
            </div>
          ) : (
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-5 pb-4 flex justify-end">
            <button
              onClick={handleCopy}
              className="text-xs bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
            >
              {copied ? "✓ Copied!" : "Copy response"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiPanel;
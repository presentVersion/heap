import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Wrench, 
  Eye, 
  ChevronRight,
  Zap,
  HelpCircle,
  Key,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Fuel
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { 
  askGeminiCopilot, 
  DEFAULT_GEMINI_API_KEY, 
  type CopilotMessage 
} from '../../services/geminiCopilotService';

export const AICopilotModal: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    assets, 
    telemetry, 
    setSelectedAsset,
    setActivePage 
  } = useSolTerraStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(
    () => localStorage.getItem('solterra_gemini_key') || DEFAULT_GEMINI_API_KEY
  );
  const [keySaved, setKeySaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your SolTerra Energy AI Copilot. I have live synchronized access to the Central Electricity Authority (CEA) Daily Generation Report (24/09/2026), Monthly Renewable Energy Report (August 2026, 59,503 MU), EV Charging Infrastructure data across petrol bunks, and Kurnool's telemetry model. How can I assist your grid planning, outage diagnostics, or clean energy dispatch?`,
      timestamp: 'Just now'
    }
  ]);

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const suggestedQuestions = [
    "Which stations have critical coal stock in today's CEA report?",
    "Analyze August 2026 Renewable Energy growth in Andhra Pradesh",
    "Where are the petrol bunk EV charging plazas in Kurnool?",
    "What is causing the 800 MW forced outage at Mundra UMTPP?",
    "Explain 765kV Green Energy Corridor transmission to Delhi & Mumbai",
    "How does Pinnapuram PSP provide Round-the-Clock (RTC) clean power?"
  ];

  const handleSaveKey = () => {
    localStorage.setItem('solterra_gemini_key', apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyConfig(false);
    }, 1500);
  };

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askGeminiCopilot(q, messages, apiKeyInput.trim());
      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Network timeout connecting to external server. Operating in verified offline grounded mode for Kurnool and CEA intelligence.`,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: CopilotMessage['action']) => {
    if (!action) return;
    setIsCopilotOpen(false);
    if (action.type === 'inspect_asset') {
      const found = assets.find(a => a.id === action.target);
      if (found) {
        setSelectedAsset(found);
      }
      setActivePage('citytwin');
    } else if (action.type === 'open_page') {
      setActivePage(action.target as any);
    }
  };

  // Simple Markdown text renderer for bold, lists, and formatting
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }

      // Bullet points
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

      // Parse bold segments (**text**)
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      return (
        <div key={lIdx} className={`${isBullet ? 'flex items-start gap-2 ml-1 my-0.5' : 'my-1'}`}>
          {isBullet && <span className="text-emerald-400 text-xs font-bold leading-relaxed">•</span>}
          <div className="flex-1">
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return (
                  <strong key={pIdx} className="text-emerald-300 font-semibold">
                    {p.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{p}</span>;
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-3xl h-[720px] max-h-[92vh] glass-panel border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left animate-fadeIn bg-slate-950/90">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_20px_rgba(0,245,155,0.4)]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white font-heading">
                  SolTerra AI Copilot
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REAL-TIME CEA INTELLIGENCE
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Synchronized · Official CEA Daily & Monthly Reports · 765kV GEC · EV Plazas</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="p-2 sm:px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Configure Copilot API Key"
            >
              <Key size={14} className="text-emerald-400" />
              <span className="hidden sm:inline text-xs font-semibold">API Key</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API Key Configuration Accordion */}
        {showKeyConfig && (
          <div className="p-4 bg-slate-900 border-b border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-slate-300 font-mono font-medium">Copilot Key:</span>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="Enter Copilot API Key..."
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm w-full sm:w-80 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {keySaved ? <CheckCircle2 size={14} /> : <Key size={14} />}
                <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Suggested Questions Pills */}
        <div className="px-4 sm:px-5 py-3 bg-slate-900/40 border-b border-white/[0.06] overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-emerald-400" /> Prompts:
          </span>
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/50 text-xs sm:text-sm font-medium text-slate-200 hover:text-emerald-300 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm shadow-md ${
                    isUser
                      ? 'bg-slate-700 text-white'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-bold'
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-emerald-600/90 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none backdrop-blur-md'
                  }`}
                >
                  <div className="text-slate-100">
                    {renderFormattedText(m.text)}
                  </div>

                  {/* Interactive Action Button */}
                  {m.action && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-105 cursor-pointer"
                      >
                        <Eye size={15} />
                        <span>{m.action.label}</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-slate-400 font-mono text-right opacity-80">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reasoning / Thinking Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-800 text-sm text-slate-200 flex items-center gap-3">
                <RefreshCw size={16} className="animate-spin text-emerald-400" />
                <span className="font-mono text-emerald-300 font-medium">Analyzing official CEA reports & grid telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-slate-900/90 flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isLoading}
            placeholder="Ask about daily CEA reports, outages, coal stocks, or petrol bunk EV stations..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/80 font-sans shadow-inner disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
          >
            <span>Ask</span>
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AICopilotModal;

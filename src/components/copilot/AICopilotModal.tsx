import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  action?: {
    type: 'inspect_asset' | 'open_page';
    target: string;
    label: string;
  };
}

export const AICopilotModal: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    assets, 
    telemetry, 
    simulationConfig,
    setSelectedAsset,
    setActivePage 
  } = useSolTerraStore();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your SolTerra Renewable City Analyst. I am connected directly to Kurnool's telemetry model (${telemetry.totalGenerationMwh} MWh generated today, ${telemetry.renewableSharePercent}% renewable share, ${telemetry.storageSocPercent}% battery SoC). How can I assist your grid planning or maintenance diagnostics?`,
      timestamp: '12:30 PM'
    }
  ]);

  if (!isCopilotOpen) return null;

  const suggestedQuestions = [
    "Which renewable assets are performing below expected output?",
    "What is causing today's peak demand?",
    "Where should additional solar infrastructure be installed?",
    "Which assets require immediate maintenance?",
    "What happens if battery storage is increased by 10 MWh?",
    "How does cloud cover affect today's renewable generation?"
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      let action: Message['action'];

      const lower = q.toLowerCase();
      if (lower.includes('below expected') || lower.includes('low performance') || lower.includes('underperform')) {
        reply = `Asset PV-210 (Rooftop Solar Array in Zone 05) is currently operating at only 65.2% efficiency (current power: 14.8 kW vs 20.5 kW capacity). The inverter heatsink temperature is elevated to 54.8°C due to dust accumulation. I recommend dispatching Field Team A for heatsink ventilation cleaning.`;
        action = {
          type: 'inspect_asset',
          target: 'PV-210',
          label: 'Inspect PV-210 on 3D Digital Twin'
        };
      } else if (lower.includes('peak demand') || lower.includes('causing')) {
        reply = `Today's peak demand is forecast at 42.8 MW (occurring between 13:30 - 15:30). The primary drivers are commercial air-conditioning loads in Zone 01 (+18%) and concurrent EV fast charging sessions at EV-014 Transport Hub. Battery System BT-09 is scheduled to discharge 92.4 kW to shave this peak.`;
        action = {
          type: 'open_page',
          target: 'analytics',
          label: 'View Load Profile Analytics'
        };
      } else if (lower.includes('additional solar') || lower.includes('where should')) {
        reply = `Zone 04 (Residential South) and Zone 03 (Transport Hub) exhibit the highest generation deficits with stress index scores above 4.5. Placing an additional 25 kW Solar Flower cluster in Zone 04 will increase Kurnool's renewable share from 84.2% to 91.5% and lower peak grid import by 3.2 MW.`;
        action = {
          type: 'open_page',
          target: 'simulation',
          label: 'Open What-If Scenario Simulator'
        };
      } else if (lower.includes('maintenance') || lower.includes('urgent')) {
        reply = `There are currently 2 urgent maintenance items: (1) SP-118 Smart Pole has an overnight battery cell imbalance (SoC dropped to 15%), and (2) SF-042 Solar Flower azimuth tracking servo has a +3.5° offset error reducing morning yield.`;
        action = {
          type: 'open_page',
          target: 'maintenance',
          label: 'Open Maintenance Dashboard'
        };
      } else if (lower.includes('battery') || lower.includes('storage') || lower.includes('10 mwh')) {
        reply = `Adding 10 MWh of BESS storage to Zone 03 would eliminate all evening grid import deficits between 18:00 - 22:00, saving an estimated $14,200/month in peak tariff charges and elevating the SolTerra City Score to 94/100.`;
        action = {
          type: 'open_page',
          target: 'simulation',
          label: 'Test 10 MWh Scenario'
        };
      } else {
        reply = `Based on our current Kurnool telemetry (simulated hour: ${simulationConfig.simulatedHour}:00, cloud cover: ${simulationConfig.cloudCoverPercent}%), city generation is currently at ${telemetry.totalGenerationMwh} MWh with 2,172 online assets. All 5 microgrid zones are balanced with zero curtailment.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
        action
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    setIsCopilotOpen(false);
    if (action.type === 'inspect_asset') {
      const found = assets.find(a => a.id === action.target);
      if (found) {
        setSelectedAsset(found);
        setActivePage('citytwin');
      }
    } else if (action.type === 'open_page') {
      setActivePage(action.target as any);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl h-[650px] max-h-[90vh] glass-panel border border-white/15 shadow-2xl flex flex-col overflow-hidden text-left animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,245,155,0.4)]">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-heading">
                SolTerra AI Copilot
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                Renewable City Analyst • Deep Model Reasoning
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Suggested Questions Pills */}
        <div className="px-4 py-2 bg-white/[0.01] border-b border-white/[0.06] overflow-x-auto flex items-center space-x-2 scrollbar-none">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-emerald-500/15 border border-white/[0.06] hover:border-emerald-500/30 text-[11px] text-slate-300 hover:text-emerald-300 transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                  : 'bg-white/[0.04] border border-white/[0.08] text-slate-200'
              }`}>
                <p>{msg.text}</p>

                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] flex items-center justify-between transition-all"
                  >
                    <span>{msg.action.label}</span>
                    <ChevronRight size={13} />
                  </button>
                )}

                <div className="text-[9px] text-slate-500 mt-1 text-right font-mono-telemetry">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 focus-within:border-emerald-400/50">
            <input
              type="text"
              placeholder="Ask anything about Kurnool's energy, telemetry, or grid recommendations..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(0,245,155,0.4)]"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

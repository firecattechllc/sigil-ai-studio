import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCcw, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface HermesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'hermes';
  text: string;
  source?: string;
}

export const HermesDrawer: React.FC<HermesDrawerProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'hermes',
      text: 'Greeting Executive. I am Hermes, the Sigil Mission Control quant assistant powered by Gemini 2.5 Flash. How can I assist with portfolio risk, proposal thesis review, or order execution topology?',
      source: 'Gemini 2.5 Flash'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/ask-hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'hermes',
          text: data.reply || 'Analysis completed.',
          source: data.source || 'Gemini 2.5 Flash'
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: 'hermes', text: 'Error contacting Hermes AI engine.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono-code">
                HERMES AI QUANT AGENT
              </h3>
              <p className="text-[10px] text-indigo-300 font-mono-code">
                Gemini 2.5 Flash Model Connected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none font-sans'
                }`}
              >
                {m.text}
              </div>
              {m.source && (
                <span className="text-[9px] text-indigo-400 font-mono-code mt-1 px-1">
                  via {m.source}
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono-code text-indigo-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Hermes AI calculating quantitative response...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono-code">
          <button
            onClick={() => setInput('Evaluate risk on AAPL equity proposal PRP-8924-X')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 whitespace-nowrap"
          >
            AAPL Proposal
          </button>
          <button
            onClick={() => setInput('Explain net -$300 TVL delta on ETH liquid staking pool')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 whitespace-nowrap"
          >
            ETH Delta
          </button>
          <button
            onClick={() => setInput('Are circuit breakers currently arm-ready?')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 whitespace-nowrap"
          >
            Circuit Breakers
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Hermes AI about risk, macro, or order flow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-sans focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

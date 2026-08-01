import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  OctagonX, 
  RefreshCw, 
  Zap, 
  Bot, 
  Plus, 
  Activity,
  Cpu,
  Clock,
  Radio
} from 'lucide-react';
import { SystemState } from '../types/sigil';

interface HeaderProps {
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  onOpenSystemHealth: () => void;
  onOpenHermes: () => void;
  onOpenNewProposal: () => void;
  pendingProposalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  systemState,
  onOpenSystemHealth,
  onOpenHermes,
  onOpenNewProposal,
  pendingProposalsCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStateBadge = () => {
    switch (systemState) {
      case 'ACTIVE':
        return (
          <button 
            onClick={onOpenSystemHealth}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono-code font-semibold hover:bg-emerald-900/60 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></span>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SYSTEM ACTIVE</span>
          </button>
        );
      case 'DEGRADED':
        return (
          <button 
            onClick={onOpenSystemHealth}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-mono-code font-semibold hover:bg-amber-900/60 transition"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DEGRADED STATE</span>
          </button>
        );
      case 'BLOCKED':
        return (
          <button 
            onClick={onOpenSystemHealth}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono-code font-semibold hover:bg-red-900/60 transition animate-pulse"
          >
            <OctagonX className="w-3.5 h-3.5" />
            <span>EXECUTION BLOCKED</span>
          </button>
        );
      case 'RECOVERING':
        return (
          <button 
            onClick={onOpenSystemHealth}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono-code font-semibold hover:bg-cyan-900/60 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>RECOVERY IN PROGRESS</span>
          </button>
        );
      case 'STARTUP':
        return (
          <button 
            onClick={onOpenSystemHealth}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-400 text-xs font-mono-code font-semibold hover:bg-purple-900/60 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>STARTUP / AUTH</span>
          </button>
        );
    }
  };

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-indigo-950/50 border border-indigo-400/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wider text-slate-100 font-mono-code">
                SIGIL MISSION CONTROL
              </h1>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-semibold">
                v3.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-wide">
              Institutional Paper Trading & Automated Governance Platform
            </p>
          </div>
        </div>

        {/* Network Status & State Indicator */}
        <div className="flex items-center gap-3 flex-wrap">
          {getStateBadge()}

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800/80 font-mono-code">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broker: Connected</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>12ms</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeStr || '13:52:14 UTC'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHermes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition"
              title="Open Hermes Quant AI Assistant"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Hermes AI</span>
            </button>

            <button
              onClick={onOpenNewProposal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
              title="Create new quantitative trade proposal"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Proposal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

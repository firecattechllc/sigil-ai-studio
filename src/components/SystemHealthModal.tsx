import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  OctagonX, 
  RefreshCw, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Server,
  Radio
} from 'lucide-react';
import { SystemState } from '../types/sigil';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({
  isOpen,
  onClose,
  systemState,
  setSystemState
}) => {
  if (!isOpen) return null;

  const statesList: { id: SystemState; label: string; desc: string; badgeClass: string; icon: any }[] = [
    {
      id: 'ACTIVE',
      label: 'System Active (Nominal)',
      desc: 'All 8 worker nodes online. Execution pipelines nominal with 12ms latency.',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      icon: ShieldCheck
    },
    {
      id: 'DEGRADED',
      label: 'Degraded State',
      desc: 'Off-chain oracle index lag detected (-$300 TVL delta). Execution routing open with warning.',
      badgeClass: 'bg-amber-950 text-amber-400 border-amber-800',
      icon: AlertTriangle
    },
    {
      id: 'BLOCKED',
      label: 'Execution Blocked',
      desc: 'Emergency pause active or circuit breaker triggered. Order placement prohibited.',
      badgeClass: 'bg-rose-950 text-rose-400 border-rose-800',
      icon: OctagonX
    },
    {
      id: 'RECOVERING',
      label: 'Recovery & Sync in Progress',
      desc: 'Reconciliation worker re-indexing liquid staking pool smart contract state.',
      badgeClass: 'bg-cyan-950 text-cyan-400 border-cyan-800',
      icon: RefreshCw
    },
    {
      id: 'STARTUP',
      label: 'Startup / Authenticating',
      desc: 'Initializing enclave keys and loading institutional paper portfolio configuration.',
      badgeClass: 'bg-purple-950 text-purple-400 border-purple-800',
      icon: Zap
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono-code uppercase">
              System Health & State Override
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State Switcher */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code block">
            Select Operational State Preset:
          </span>

          <div className="space-y-2">
            {statesList.map((st) => {
              const Icon = st.icon;
              const isSelected = systemState === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSystemState(st.id)}
                  className={`w-full p-3 rounded-xl border text-left font-mono-code transition flex items-start justify-between ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500 shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${st.badgeClass}`}>
                        {st.id}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{st.label}</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-400">
                      {st.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Metrics */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono-code">
          <div className="flex justify-between text-slate-400">
            <span>Enclave Verification:</span>
            <span className="text-emerald-400 font-bold">PASSED (RSA-2048)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Live Worker Latency:</span>
            <span className="text-slate-200">12ms Average</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Active Broker Connectors:</span>
            <span className="text-indigo-300 font-bold">8 / 8 Online</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-bold transition shadow-lg shadow-indigo-950"
        >
          Confirm State & Close
        </button>

      </div>
    </div>
  );
};

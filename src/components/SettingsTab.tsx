import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Copy, 
  Check, 
  Server, 
  Cpu, 
  RefreshCcw, 
  Trash2, 
  ShieldAlert, 
  Info,
  ExternalLink
} from 'lucide-react';

interface SettingsTabProps {
  onResetPortfolio: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onResetPortfolio }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const providerKey = '0x73A219f8C22108d44002e8912384a827419bc119';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(providerKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleReset = () => {
    onResetPortfolio();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Configuration Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 font-mono-code flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Sigil Mission Control Configuration Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            System specifications, cryptographic provider keys, architecture maps, and environment parameters.
          </p>
        </div>
        <span className="px-3 py-1 rounded-md text-xs font-mono-code font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
          BUILD v3.5.2-RELEASE
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Provider Identity & Keystore */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Provider Identity</span>
          </h3>

          <div className="space-y-3 font-mono-code text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                Authorized Governance Signer Public Address
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={providerKey}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-indigo-300 text-xs font-mono-code"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Key Algorithm:</span>
                <span className="text-slate-200 font-bold">ECDSA secp256k1</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Verification Enclave:</span>
                <span className="text-emerald-400 font-bold">AWS Nitro Enclave #1</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture Specifications */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Runtime Container Specs</span>
          </h3>

          <div className="space-y-2 font-mono-code text-xs">
            <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Frontend Framework:</span>
              <span className="text-slate-200 font-bold">React 19 + Vite 6 + Tailwind</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Backend Proxy:</span>
              <span className="text-slate-200 font-bold">Express v4 + Node TypeScript</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Generative AI SDK:</span>
              <span className="text-indigo-400 font-bold">@google/genai (Gemini 2.5 Flash)</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400">Execution Port:</span>
              <span className="text-slate-200 font-bold">Port 3000 (Cloud Run Ingress)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Danger Zone: Reset Portfolio State */}
      <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold font-mono-code text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone: Paper Portfolio Reset</span>
        </div>
        <p className="text-xs text-slate-300">
          Resets all paper trading balances, clears local orders, and restores initial benchmark positions ($1.4M TVL).
        </p>

        {resetConfirmed && (
          <div className="text-xs font-mono-code text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-800">
            ✓ Paper trading portfolio state restored to seed defaults.
          </div>
        )}

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-mono-code transition flex items-center gap-2 shadow-md shadow-rose-950"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset Paper Portfolio to Defaults</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Rocket, 
  ShieldAlert, 
  OctagonX, 
  CheckCircle2, 
  Zap, 
  Lock, 
  Activity, 
  Sliders, 
  Key, 
  Server, 
  Cpu,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { LaunchControlState, SystemState } from '../types/sigil';

interface LaunchTabProps {
  launchState: LaunchControlState;
  setLaunchState: React.Dispatch<React.SetStateAction<LaunchControlState>>;
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  onTriggerEmergencyStop: () => void;
}

export const LaunchTab: React.FC<LaunchTabProps> = ({
  launchState,
  setLaunchState,
  systemState,
  setSystemState,
  onTriggerEmergencyStop
}) => {
  const [renewalNotice, setRenewalNotice] = useState<string | null>(null);

  const handleModeChange = (mode: LaunchControlState['automationMode']) => {
    setLaunchState(prev => ({
      ...prev,
      automationMode: mode
    }));
  };

  const handleToggleCircuitBreaker = () => {
    setLaunchState(prev => ({
      ...prev,
      circuitBreakerActive: !prev.circuitBreakerActive
    }));
  };

  const handleRenewAuthToken = () => {
    setRenewalNotice('Token successfully re-signed and published to cryptographic keystore. Extended 30 days.');
    setTimeout(() => setRenewalNotice(null), 4000);
  };

  const workerNodesList = [
    { name: 'NASDAQ Direct DMA Connector #1', status: 'ONLINE', latency: '8ms' },
    { name: 'NYSE Arca Dark Pool Router', status: 'ONLINE', latency: '11ms' },
    { name: 'Uniswap v3 Liquid Engine', status: 'ONLINE', latency: '14ms' },
    { name: 'Coinbase Prime Institutional API', status: 'ONLINE', latency: '12ms' },
    { name: 'Bloomberg FIX Protocol Engine', status: 'ONLINE', latency: '9ms' },
    { name: 'IEX Smart Order Router', status: 'ONLINE', latency: '10ms' },
    { name: 'Lido Liquid Staking Router', status: 'ONLINE', latency: '15ms' },
    { name: 'Circle Custody Reserve Bridge', status: 'ONLINE', latency: '7ms' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Emergency Killswitch */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/60 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <OctagonX className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-slate-100 font-mono-code uppercase">
              Launch Control & Safety Override
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Manage automated order execution states, circuit breakers, drawdown limits, and emergency kill switches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerEmergencyStop}
            className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono-code text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-rose-950 animate-pulse"
          >
            <OctagonX className="w-4 h-4" />
            <span>EMERGENCY PAUSE ALL EXECUTION</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Automation Mode & Parameters */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Automation State Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Automation Execution Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  id: 'AUTONOMOUS', 
                  title: 'Full Autonomous', 
                  desc: 'Orders execute automatically upon proposal authorization without manual sign-off.' 
                },
                { 
                  id: 'SEMI_AUTONOMOUS', 
                  title: 'Semi-Autonomous', 
                  desc: 'Requires human governance sign-off for high-value or high-risk trades.' 
                },
                { 
                  id: 'MANUAL_ONLY', 
                  title: 'Manual Only', 
                  desc: 'All trading algorithms paused. Orders must be submitted manually.' 
                },
                { 
                  id: 'PAUSED', 
                  title: 'System Execution Paused', 
                  desc: 'All order execution disabled across all broker connectors.' 
                }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id as LaunchControlState['automationMode'])}
                  className={`p-3.5 rounded-lg border text-left font-mono-code transition flex flex-col justify-between ${
                    launchState.automationMode === mode.id
                      ? 'bg-indigo-950/80 border-indigo-500 text-slate-100 shadow-md shadow-indigo-950'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{mode.title}</span>
                    {launchState.automationMode === mode.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-snug">
                    {mode.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Circuit Breakers & Risk Thresholds */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Risk & Circuit Breaker Thresholds</span>
            </h3>

            {/* Max Drawdown Limit Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-300 font-semibold">Maximum Drawdown Circuit Breaker</span>
                <span className="text-indigo-400 font-bold">{launchState.maxDrawdownLimit.toFixed(1)}% Limit</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={launchState.maxDrawdownLimit}
                onChange={(e) => setLaunchState(prev => ({ ...prev, maxDrawdownLimit: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>1.0% Conservative</span>
                <span>Current DD: {launchState.currentDrawdown}%</span>
                <span>10.0% Aggressive</span>
              </div>
            </div>

            {/* Max Position Sizing Cap Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-300 font-semibold">Single Order Sizing Cap</span>
                <span className="text-emerald-400 font-bold">${(launchState.maxPositionSizeUsd / 1000).toFixed(0)}k USD</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="25000"
                value={launchState.maxPositionSizeUsd}
                onChange={(e) => setLaunchState(prev => ({ ...prev, maxPositionSizeUsd: parseInt(e.target.value) }))}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>$50,000 USD</span>
                <span>$500,000 USD</span>
              </div>
            </div>

            {/* Circuit Breaker Status Toggle */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-mono-code text-slate-200 block">
                  Automatic Circuit Breaker Trigger
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  Halts all order flow instantly if drawdown exceeds threshold.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleCircuitBreaker}
                className={`px-3 py-1.5 rounded text-xs font-bold font-mono-code transition ${
                  launchState.circuitBreakerActive
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {launchState.circuitBreakerActive ? 'TRIGGERED (HALTED)' : 'ARMED & NORMAL'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Authorization Token & Broker Nodes Status */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Authorization Token Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Monthly Authorization Token</span>
            </h3>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono-code">
              <div className="flex justify-between">
                <span className="text-slate-400">Token ID:</span>
                <span className="text-indigo-300 font-bold">TOK-2026-AUG-8921</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiration:</span>
                <span className="text-emerald-400 font-bold">2026-08-31T23:59:59Z</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signer Key:</span>
                <span className="text-slate-300">0x73A...119</span>
              </div>
            </div>

            {renewalNotice && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono-code p-2.5 rounded-md flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{renewalNotice}</span>
              </div>
            )}

            <button
              onClick={handleRenewAuthToken}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-950"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renew Monthly Authorization Token</span>
            </button>
          </div>

          {/* Broker Connector Worker Topology */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Live Broker Connectors</span>
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                8/8 ONLINE
              </span>
            </div>

            <div className="space-y-2">
              {workerNodesList.map((node, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/80 p-2.5 rounded-md border border-slate-800/80 flex items-center justify-between text-xs font-mono-code"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="truncate max-w-[200px]">{node.name}</span>
                  </div>
                  <span className="text-indigo-400 text-[11px] font-semibold">{node.latency}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

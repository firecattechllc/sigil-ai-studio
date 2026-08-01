import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Bot, 
  Scale, 
  Lock, 
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { Position, Proposal, ExecutionReceipt, ReconciliationDiscrepancy, AuditEvent, LaunchControlState } from '../types/sigil';
import { TabType } from './Navigation';

interface OverviewTabProps {
  positions: Position[];
  proposals: Proposal[];
  executions: ExecutionReceipt[];
  discrepancies: ReconciliationDiscrepancy[];
  auditLogs: AuditEvent[];
  launchState: LaunchControlState;
  onNavigateTab: (tab: TabType) => void;
  onSelectProposal: (proposal: Proposal) => void;
  onAuthorizeProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  onOpenHermes: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  positions,
  proposals,
  executions,
  discrepancies,
  auditLogs,
  launchState,
  onNavigateTab,
  onSelectProposal,
  onAuthorizeProposal,
  onRejectProposal,
  onOpenHermes
}) => {
  // Financial calculations
  const holdingsValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const cashBalance = 125000.00;
  const totalValue = holdingsValue + cashBalance;
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const dayChange = positions.reduce((sum, p) => sum + (p.marketValue * (p.dayChangePercent / 100)), 0);
  const dayChangePercent = (dayChange / holdingsValue) * 100;

  const pendingProposals = proposals.filter(p => p.status === 'PENDING');
  const unresolvedDiscrepancies = discrepancies.filter(d => d.status === 'UNRESOLVED');

  return (
    <div className="space-y-6">
      {/* Financial Metrics Paper Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700/80 transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Value (TVL)</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono-code text-slate-100">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +${totalUnrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-slate-400">Total P&L</span>
          </div>
        </div>

        {/* 24h P&L */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700/80 transition relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>24h Performance</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl font-bold font-mono-code ${dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {dayChange >= 0 ? '+' : ''}${dayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className={`font-bold px-1.5 py-0.5 rounded border ${
              dayChangePercent >= 0 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' 
                : 'bg-rose-950/80 text-rose-400 border-rose-800/50'
            }`}>
              {dayChangePercent >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        {/* Cash & Buying Power */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700/80 transition relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available Capital</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono-code text-slate-100">
            ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono-code">
            <span>Buying Power: <strong className="text-slate-200">${(launchState.maxPositionSizeUsd).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Risk & Safety Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700/80 transition relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Risk Parameter</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono-code text-slate-100 flex items-center gap-2">
            <span>{launchState.currentDrawdown.toFixed(1)}%</span>
            <span className="text-xs text-slate-400 font-normal">/ {launchState.maxDrawdownLimit.toFixed(1)}% Max DD</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-400 h-1.5 rounded-full" 
              style={{ width: `${(launchState.currentDrawdown / launchState.maxDrawdownLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Attention Queue & Active Positions Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Attention Queue: Pending Trade Proposals */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code">
                  Attention Queue ({pendingProposals.length} Proposals Awaiting Governance)
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('proposals')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                <span>View All Proposals</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingProposals.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                No pending proposals requiring approval. All trade queues nominal.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProposals.map((prop) => (
                  <div 
                    key={prop.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-lg p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60">
                          {prop.id}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono-code ${
                          prop.direction === 'BUY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                        }`}>
                          {prop.direction} {prop.ticker}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-code">
                          {prop.quantity} shares @ ${prop.targetPrice} (${prop.estimatedValue.toLocaleString()})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {prop.thesis}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono-code">
                        <span>Hermes AI Rec: <strong className="text-emerald-400">{prop.hermesInsight.recommendation}</strong></span>
                        <span>•</span>
                        <span>Risk Score: <strong className={prop.riskScore > 5 ? 'text-rose-400' : 'text-emerald-400'}>{prop.riskScore}/10</strong></span>
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectProposal(prop)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => onAuthorizeProposal(prop.id)}
                        className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize</span>
                      </button>
                      <button
                        onClick={() => onRejectProposal(prop.id)}
                        className="px-2.5 py-1.5 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Holdings Quick Snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code">
                Active Position Holdings ({positions.length} Assets)
              </h2>
              <button
                onClick={() => onNavigateTab('portfolio')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Full Portfolio View</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Asset Ticker</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Current Price</th>
                    <th className="py-2.5 px-3 text-right">Market Value</th>
                    <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                    <th className="py-2.5 px-3 text-right">Day %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
                  {positions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span>{pos.ticker}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({pos.name})</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{pos.quantity.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-200">${pos.currentPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-100 font-semibold">${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${pos.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.unrealizedPnL >= 0 ? '+' : ''}${pos.unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${pos.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.dayChangePercent >= 0 ? '+' : ''}{pos.dayChangePercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Automation Control, System Reconciliation & Hermes Brief */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Launch Control / Automation State */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code">
                Automation Control
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {launchState.automationMode}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono-code pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Circuit Breakers:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ARMED & READY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Worker Nodes:</span>
                <span className="text-slate-100 font-bold">{launchState.activeWorkerNodes} / {launchState.totalWorkerNodes} Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Auth Token:</span>
                <span className="text-indigo-300 font-bold">Expires Aug 31, 2026</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('launch')}
              className="w-full mt-4 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700/60"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Launch Controls</span>
            </button>
          </div>

          {/* System Reconciliation Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code">
                  Reconciliation Status
                </span>
              </div>
              {unresolvedDiscrepancies.length > 0 ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-amber-950 text-amber-400 border border-amber-800">
                  {unresolvedDiscrepancies.length} DISCREPANCY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  BALANCED
                </span>
              )}
            </div>

            {unresolvedDiscrepancies.length > 0 ? (
              <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold font-mono-code">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>TVL Delta: -$300.00 USD</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Observed ETH liquid staking pool value reflects minor off-chain oracle index lag versus smart contract state.
                </p>
                <button
                  onClick={() => onNavigateTab('reconciliation')}
                  className="w-full mt-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition text-center"
                >
                  Resolve Discrepancy
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono-code">
                All expected vs observed TVL states matched across custodial and DEX bridges.
              </p>
            )}
          </div>

          {/* Hermes AI Quant Assistant Widget */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase font-mono-code">Hermes AI Quant Agent</h3>
                  <p className="text-[10px] text-indigo-300 font-mono-code">Gemini 2.5 Flash Powered</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              "Dark pool accumulation on AAPL equity remains in 88th percentile. Risk skew for technology mega-caps is optimal ahead of macro rate guidance."
            </p>

            <button
              onClick={onOpenHermes}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-950"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Hermes AI Assistant</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

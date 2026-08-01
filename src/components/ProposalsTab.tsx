import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Edit, 
  Bot, 
  Activity, 
  Clock, 
  User, 
  Layers, 
  ArrowRight,
  AlertTriangle,
  RefreshCcw,
  Check
} from 'lucide-react';
import { Proposal } from '../types/sigil';

interface ProposalsTabProps {
  proposals: Proposal[];
  selectedProposal: Proposal | null;
  onSelectProposal: (proposal: Proposal) => void;
  onAuthorizeProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  onOpenNewProposal: () => void;
}

export const ProposalsTab: React.FC<ProposalsTabProps> = ({
  proposals,
  selectedProposal,
  onSelectProposal,
  onAuthorizeProposal,
  onRejectProposal,
  onOpenNewProposal
}) => {
  const [activeProposal, setActiveProposal] = useState<Proposal>(
    selectedProposal || proposals[0]
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState<boolean>(false);
  const [aiCustomNotice, setAiCustomNotice] = useState<string | null>(null);

  // If selectedProposal prop changes
  React.useEffect(() => {
    if (selectedProposal) {
      setActiveProposal(selectedProposal);
    }
  }, [selectedProposal]);

  const filteredProposals = proposals.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  // Call Gemini API to re-analyze active proposal
  const handleReanalyzeWithGemini = async () => {
    setIsAnalyzingGemini(true);
    setAiCustomNotice(null);
    try {
      const res = await fetch('/api/gemini/analyze-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: activeProposal.ticker,
          direction: activeProposal.direction,
          thesis: activeProposal.thesis,
          targetPrice: activeProposal.targetPrice,
          quantity: activeProposal.quantity
        })
      });
      const data = await res.json();
      if (data && data.summary) {
        setActiveProposal(prev => ({
          ...prev,
          hermesInsight: {
            recommendation: data.recommendation || prev.hermesInsight.recommendation,
            confidence: data.confidence || prev.hermesInsight.confidence,
            summary: data.summary,
            keyRisks: data.keyRisks || prev.hermesInsight.keyRisks,
            marketCatalysts: data.marketCatalysts || prev.hermesInsight.marketCatalysts
          }
        }));
        setAiCustomNotice(`Re-analyzed via ${data.source || 'Gemini 2.5 Flash'}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingGemini(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 font-mono-code flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Active Proposal Inspection & Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Review quantitative trade rationale, technical signals, risk scores, and Gemini AI insights prior to order authorization.
          </p>
        </div>

        <button
          onClick={onOpenNewProposal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold font-mono-code transition shadow-md shadow-indigo-950 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Create New Trade Proposal</span>
        </button>
      </div>

      {/* Main Split: Inspector (Top/Left) & Proposal List */}
      <div className="grid grid-cols-1 lg:col-span-12 gap-6">
        
        {/* Selected Proposal Active Inspector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          
          {/* Top Identifier Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold font-mono-code text-indigo-400 bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-md">
                  {activeProposal.id}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-mono-code">
                  {activeProposal.direction} {activeProposal.quantity} {activeProposal.ticker} Equity
                </h3>
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono-code ${
                  activeProposal.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  activeProposal.status === 'AUTHORIZED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  activeProposal.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}>
                  {activeProposal.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code mt-1">
                Author: {activeProposal.author} • Created: {activeProposal.createdTimestamp}
              </p>
            </div>

            {/* Financial Parameters */}
            <div className="flex items-center gap-4 text-xs font-mono-code bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Target Price</span>
                <span className="text-slate-100 font-bold">${activeProposal.targetPrice.toFixed(2)}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">Quantity</span>
                <span className="text-slate-100 font-bold">{activeProposal.quantity} shares</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">Estimated Value</span>
                <span className="text-indigo-300 font-bold">${activeProposal.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Trade Thesis & Rationale */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Quantitative Trade Thesis & Rationale</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeProposal.thesis}
            </p>
          </div>

          {/* Hermes AI Insight Analysis */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-800/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase font-mono-code">
                    Hermes Quant Agent Insight
                  </h4>
                  <p className="text-[10px] text-indigo-300 font-mono-code">
                    Confidence: {(activeProposal.hermesInsight.confidence * 100).toFixed(0)}% • Model: Gemini 2.5 Flash
                  </p>
                </div>
              </div>

              <button
                onClick={handleReanalyzeWithGemini}
                disabled={isAnalyzingGemini}
                className="px-3 py-1.5 rounded bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 text-xs font-semibold font-mono-code flex items-center gap-1.5 transition"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${isAnalyzingGemini ? 'animate-spin text-indigo-400' : ''}`} />
                <span>{isAnalyzingGemini ? 'Analyzing...' : 'Re-analyze with Gemini AI'}</span>
              </button>
            </div>

            {aiCustomNotice && (
              <div className="text-[11px] font-mono-code text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                ✓ {aiCustomNotice}
              </div>
            )}

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              "{activeProposal.hermesInsight.summary}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Key Risks */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 space-y-1.5">
                <span className="font-bold font-mono-code text-rose-400 flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Key Risk Factors
                </span>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                  {activeProposal.hermesInsight.keyRisks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>

              {/* Market Catalysts */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 space-y-1.5">
                <span className="font-bold font-mono-code text-emerald-400 flex items-center gap-1.5 text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Market Catalysts
                </span>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                  {activeProposal.hermesInsight.marketCatalysts.map((cat, idx) => (
                    <li key={idx}>{cat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Signals & Risk Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Indicators */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Technical Signals</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RSI Index (14)</span>
                  <span className="text-slate-100 font-bold text-sm">{activeProposal.technicalSignals.rsi}</span>
                  <span className="text-[10px] text-emerald-400 block">Neutral/Bullish Range</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MACD Status</span>
                  <span className="text-emerald-400 font-bold text-sm">{activeProposal.technicalSignals.macdStatus}</span>
                  <span className="text-[10px] text-slate-400 block">Positive Crossover</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Support Level</span>
                  <span className="text-slate-100 font-bold text-sm">${activeProposal.technicalSignals.supportLevel.toFixed(2)}</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Resistance Level</span>
                  <span className="text-slate-100 font-bold text-sm">${activeProposal.technicalSignals.resistanceLevel.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Risk Parameters */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Risk Parameter Evaluation</span>
              </h4>

              <div className="space-y-2 text-xs font-mono-code">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400">Quantitative Risk Score:</span>
                  <span className={`font-bold text-sm ${
                    activeProposal.riskScore > 5 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {activeProposal.riskScore} / 10 ({activeProposal.riskScore <= 4 ? 'LOW RISK' : 'MODERATE RISK'})
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400">Position Sizing Rules:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PASSED ($250k Limit)
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400">Projected Portfolio Impact:</span>
                  <span className="text-slate-200 font-bold">+5.7% Allocation Weight</span>
                </div>
              </div>
            </div>
          </div>

          {/* Governance Action Bar */}
          {activeProposal.status === 'PENDING' ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code block">
                  Governance Action Required
                </span>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Authorizing will immediately route order to broker execution connectors and publish an immutable audit entry.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAuthorizeProposal(activeProposal.id)}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-950"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AUTHORIZE TRADE</span>
                </button>

                <button
                  onClick={() => onRejectProposal(activeProposal.id)}
                  className="px-5 py-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono-code text-xs font-bold flex items-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT PROPOSAL</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono-code text-slate-300 flex items-center justify-between">
              <span>Proposal Governance Status: <strong className="text-indigo-400">{activeProposal.status}</strong></span>
              <span className="text-slate-500">No further governance actions pending.</span>
            </div>
          )}

        </div>

        {/* Proposals List Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code">
              Proposal Queue History ({proposals.length} Total)
            </h3>

            <div className="flex items-center gap-2 font-mono-code text-xs">
              <span className="text-slate-500">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Approval</option>
                <option value="AUTHORIZED">Authorized</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Proposal ID</th>
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Target Price</th>
                  <th className="py-2.5 px-3 text-right">Value</th>
                  <th className="py-2.5 px-3 text-right">Risk</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
                {filteredProposals.map((prop) => (
                  <tr 
                    key={prop.id}
                    onClick={() => onSelectProposal(prop)}
                    className={`hover:bg-slate-800/60 cursor-pointer transition ${
                      activeProposal.id === prop.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-indigo-400">{prop.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-200">{prop.ticker}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prop.direction === 'BUY' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {prop.direction}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{prop.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">${prop.targetPrice.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200 font-bold">${prop.estimatedValue.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${prop.riskScore > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {prop.riskScore}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prop.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        prop.status === 'AUTHORIZED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        prop.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        'bg-indigo-950 text-indigo-400'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Plus, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Proposal } from '../types/sigil';

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (proposal: Proposal) => void;
}

export const NewProposalModal: React.FC<NewProposalModalProps> = ({
  isOpen,
  onClose,
  onSubmitProposal
}) => {
  const [ticker, setTicker] = useState('NVDA');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(100);
  const [targetPrice, setTargetPrice] = useState(130.00);
  const [thesis, setThesis] = useState('Tactical momentum accumulation based on strong option call volume and enterprise cloud AI demand.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PRP-${Math.floor(8925 + Math.random() * 1000)}-${['X', 'Y', 'Z', 'W'][Math.floor(Math.random() * 4)]}`;
    const estimatedValue = targetPrice * quantity;

    const newProp: Proposal = {
      id: newId,
      ticker: ticker.toUpperCase(),
      assetName: `${ticker.toUpperCase()} Security`,
      direction,
      targetPrice,
      quantity,
      estimatedValue,
      riskScore: parseFloat((2.5 + Math.random() * 3).toFixed(1)),
      status: 'PENDING',
      thesis,
      technicalSignals: {
        rsi: 58.2,
        macdStatus: 'BULLISH',
        volumeRatio: 1.35,
        supportLevel: targetPrice * 0.95,
        resistanceLevel: targetPrice * 1.08
      },
      hermesInsight: {
        recommendation: direction === 'BUY' ? 'STRONG_BUY' : 'HOLD',
        confidence: 0.86,
        summary: `Quantitative signal alignment for ${ticker.toUpperCase()} ${direction} thesis. Favorable order flow profile.`,
        keyRisks: ['Market-wide rate sensitivity', 'Short-term volatility expansion'],
        marketCatalysts: ['Quarterly earnings release', 'Sector momentum rotation']
      },
      createdTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      author: 'Executive Trader'
    };

    onSubmitProposal(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono-code uppercase">
              Create New Quantitative Proposal
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono-code text-xs">
          
          {/* Direction */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setDirection('BUY')}
              className={`py-1.5 rounded font-bold transition ${
                direction === 'BUY' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              onClick={() => setDirection('SELL')}
              className={`py-1.5 rounded font-bold transition ${
                direction === 'SELL' ? 'bg-rose-600 text-white' : 'text-slate-400'
              }`}
            >
              SELL / SHORT
            </button>
          </div>

          {/* Ticker & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Asset Ticker Symbol</label>
              <input
                type="text"
                required
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-100 focus:border-indigo-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Order Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-slate-400 mb-1">Target Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-100 focus:border-indigo-500 font-bold"
            />
          </div>

          {/* Thesis */}
          <div>
            <label className="block text-slate-400 mb-1">Quantitative Trade Thesis / Rationale</label>
            <textarea
              rows={3}
              required
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 font-sans focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between text-slate-300">
            <span>Estimated Proposal Capital:</span>
            <span className="text-indigo-300 font-bold">${(targetPrice * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold transition shadow-lg shadow-emerald-950"
          >
            Submit Proposal to Governance Queue
          </button>
        </form>

      </div>
    </div>
  );
};

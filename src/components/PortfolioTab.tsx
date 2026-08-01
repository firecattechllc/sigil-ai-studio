import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  Minus, 
  RefreshCw, 
  PieChart, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Lock,
  ArrowRightLeft
} from 'lucide-react';
import { Position } from '../types/sigil';

interface PortfolioTabProps {
  positions: Position[];
  onExecutePaperTrade: (trade: {
    ticker: string;
    name: string;
    assetClass: 'EQUITY' | 'CRYPTO' | 'FX' | 'COMMODITY';
    direction: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  positions,
  onExecutePaperTrade
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');

  // Trade Execution Form State
  const [tradeTicker, setTradeTicker] = useState('AAPL');
  const [tradeDirection, setTradeDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQuantity, setTradeQuantity] = useState<number>(50);
  const [tradeOrderType, setTradeOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Financial Summary
  const holdingsValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const cashBalance = 125000.00;
  const totalTvl = holdingsValue + cashBalance;
  const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);

  // Filtered positions
  const filteredPositions = positions.filter(p => {
    const matchesSearch = p.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedAssetClass === 'ALL' || p.assetClass === selectedAssetClass;
    return matchesSearch && matchesClass;
  });

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = positions.find(p => p.ticker.toUpperCase() === tradeTicker.toUpperCase());
    const currentPrice = existing ? existing.currentPrice : (tradeTicker === 'AAPL' ? 232.80 : 150.00);
    const name = existing ? existing.name : `${tradeTicker} Security`;
    const assetClass = existing ? existing.assetClass : (['ETH', 'BTC', 'SOL'].includes(tradeTicker) ? 'CRYPTO' : 'EQUITY');

    onExecutePaperTrade({
      ticker: tradeTicker.toUpperCase(),
      name,
      assetClass,
      direction: tradeDirection,
      quantity: Number(tradeQuantity),
      price: currentPrice
    });

    setTradeMessage(`Executed ${tradeDirection} order for ${tradeQuantity} shares of ${tradeTicker.toUpperCase()} at $${currentPrice.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono-code">
            Total Paper TVL
          </div>
          <div className="text-2xl font-bold font-mono-code text-slate-100">
            ${totalTvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono-code">
            Securities + Institutional Cash Reserves
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono-code">
            Total Holdings Value
          </div>
          <div className="text-2xl font-bold font-mono-code text-indigo-300">
            ${holdingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono-code">
            {positions.length} Active Positions
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono-code">
            Unrealized Total P&L
          </div>
          <div className={`text-2xl font-bold font-mono-code ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono-code">
            Across active trading book
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono-code">
            Cash Balance
          </div>
          <div className="text-2xl font-bold font-mono-code text-slate-100">
            ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono-code">
            Liquid Reserve Available
          </div>
        </div>
      </div>

      {/* Main Grid: Holdings Table & Paper Execution Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Positions Table (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Active Position Book</span>
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search ticker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-indigo-500 w-36 sm:w-44"
                />
              </div>

              {/* Class Filter */}
              <select
                value={selectedAssetClass}
                onChange={(e) => setSelectedAssetClass(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Asset Classes</option>
                <option value="EQUITY">Equities</option>
                <option value="CRYPTO">Crypto</option>
                <option value="FX">FX / Commodities</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Ticker / Name</th>
                  <th className="py-2.5 px-3 text-right">Class</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Avg Price</th>
                  <th className="py-2.5 px-3 text-right">Current</th>
                  <th className="py-2.5 px-3 text-right">Market Value</th>
                  <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                  <th className="py-2.5 px-3 text-right">Day %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
                {filteredPositions.map((pos) => (
                  <tr 
                    key={pos.id} 
                    onClick={() => setTradeTicker(pos.ticker)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span className="text-indigo-400">{pos.ticker}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">{pos.name}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800 font-mono-code">
                        {pos.assetClass}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-200">{pos.quantity.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-slate-400">${pos.avgPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-slate-100 font-semibold">${pos.currentPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-slate-100 font-bold">${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className={`py-3 px-3 text-right font-bold ${pos.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pos.unrealizedPnL >= 0 ? '+' : ''}${pos.unrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      <div className="text-[10px] font-normal">({pos.unrealizedPnLPercent >= 0 ? '+' : ''}{pos.unrealizedPnLPercent.toFixed(2)}%)</div>
                    </td>
                    <td className={`py-3 px-3 text-right font-semibold ${pos.dayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pos.dayChangePercent >= 0 ? '+' : ''}{pos.dayChangePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Allocation Breakdown Bar */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code mb-2">
              <span>Asset Allocation Breakdown</span>
              <span>100% Portfolio Weight</span>
            </div>
            <div className="w-full bg-slate-950 rounded-lg h-3 flex overflow-hidden border border-slate-800 p-0.5">
              {positions.map((pos, idx) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
                return (
                  <div
                    key={pos.id}
                    className={`${colors[idx % colors.length]} h-full rounded-sm transition-all duration-300`}
                    style={{ width: `${pos.allocationPercent}%` }}
                    title={`${pos.ticker}: ${pos.allocationPercent}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono-code">
              {positions.map((pos, idx) => {
                const colors = ['text-indigo-400', 'text-emerald-400', 'text-cyan-400', 'text-amber-400', 'text-purple-400', 'text-rose-400'];
                return (
                  <div key={pos.id} className="flex items-center gap-1">
                    <span className={`font-bold ${colors[idx % colors.length]}`}>● {pos.ticker}:</span>
                    <span>{pos.allocationPercent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Paper Trade Execution Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              <span>Paper Trade Simulator</span>
            </h2>
            <span className="text-[10px] font-mono-code bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              LIVE PAPER BROKER
            </span>
          </div>

          <form onSubmit={handleTradeSubmit} className="space-y-4">
            {/* Direction Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setTradeDirection('BUY')}
                className={`py-1.5 rounded text-xs font-bold font-mono-code transition ${
                  tradeDirection === 'BUY'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setTradeDirection('SELL')}
                className={`py-1.5 rounded text-xs font-bold font-mono-code transition ${
                  tradeDirection === 'SELL'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Ticker Selection */}
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">
                Asset Ticker Symbol
              </label>
              <select
                value={tradeTicker}
                onChange={(e) => setTradeTicker(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono-code text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {positions.map(p => (
                  <option key={p.id} value={p.ticker}>
                    {p.ticker} - {p.name} (${p.currentPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">
                Order Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono-code text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">
                Execution Routing Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <button
                  type="button"
                  onClick={() => setTradeOrderType('MARKET')}
                  className={`py-1.5 px-3 rounded border text-center font-bold ${
                    tradeOrderType === 'MARKET'
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Direct Market
                </button>
                <button
                  type="button"
                  onClick={() => setTradeOrderType('LIMIT')}
                  className={`py-1.5 px-3 rounded border text-center font-bold ${
                    tradeOrderType === 'LIMIT'
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Dark Pool Limit
                </button>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono-code space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Value:</span>
                <span className="text-slate-100 font-bold">
                  ${((positions.find(p => p.ticker === tradeTicker)?.currentPrice || 200) * tradeQuantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Routing Fee:</span>
                <span className="text-slate-300">$12.50 USD</span>
              </div>
            </div>

            {tradeMessage && (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono-code p-2.5 rounded-md flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{tradeMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono-code text-white transition shadow-md ${
                tradeDirection === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
              }`}
            >
              Execute Simulated {tradeDirection} Receipt
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

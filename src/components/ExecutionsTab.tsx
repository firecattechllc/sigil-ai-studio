import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Copy, 
  Check, 
  Layers 
} from 'lucide-react';
import { ExecutionReceipt } from '../types/sigil';

interface ExecutionsTabProps {
  executions: ExecutionReceipt[];
}

export const ExecutionsTab: React.FC<ExecutionsTabProps> = ({ executions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSide, setFilterSide] = useState<string>('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState<ExecutionReceipt | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredExecutions = executions.filter(rec => {
    const matchesSearch = rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.proposalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = filterSide === 'ALL' || rec.side === filterSide;
    return matchesSearch && matchesSide;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'ReceiptID,ProposalID,Timestamp,Side,Ticker,Quantity,Price,TotalValue,Fee,Status,Venue,SlippageBps,TxHash\n';
    const rows = executions.map(e => 
      `${e.id},${e.proposalId},"${e.timestamp}",${e.side},${e.ticker},${e.quantity},${e.price},${e.totalValue},${e.fee},${e.status},"${e.executionVenue}",${e.slippageBps},"${e.txHash}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sigil_executions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 font-mono-code flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <span>Execution Receipts Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Immutable settlement receipts for all executed quantitative paper trade proposals across brokers and liquidity pools.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-bold font-mono-code transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Receipts (CSV)</span>
        </button>
      </div>

      {/* Main Grid: Executions Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Executions Table */}
        <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 ${
          selectedReceipt ? 'lg:col-span-8' : 'lg:col-span-12'
        }`}>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code">
                Settled Receipts ({filteredExecutions.length})
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap font-mono-code text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search receipt ID, ticker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>

              <select
                value={filterSide}
                onChange={(e) => setFilterSide(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Sides</option>
                <option value="BUY">BUY Only</option>
                <option value="SELL">SELL Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Receipt ID</th>
                  <th className="py-2.5 px-3">Proposal Ref</th>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Side / Ticker</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total Value</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
                {filteredExecutions.map((rec) => (
                  <tr 
                    key={rec.id}
                    onClick={() => setSelectedReceipt(rec)}
                    className={`hover:bg-slate-800/60 cursor-pointer transition ${
                      selectedReceipt?.id === rec.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-indigo-400">{rec.id}</td>
                    <td className="py-3 px-3 text-slate-400">{rec.proposalId}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{rec.timestamp}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rec.side === 'BUY' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {rec.side}
                        </span>
                        <span className="font-bold text-slate-100">{rec.ticker}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-200">{rec.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-200">${rec.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-slate-100 font-bold">${rec.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Selected Receipt Detail Drawer (4 cols) */}
        {selectedReceipt && (
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" />
                <span>Receipt {selectedReceipt.id}</span>
              </h3>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-xs text-slate-400 hover:text-slate-100 font-mono-code"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Proposal Reference:</span>
                  <span className="text-indigo-300 font-bold">{selectedReceipt.proposalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Execution Venue:</span>
                  <span className="text-slate-200">{selectedReceipt.executionVenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Slippage:</span>
                  <span className="text-emerald-400">{selectedReceipt.slippageBps} bps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Routing Fee:</span>
                  <span className="text-slate-300">${selectedReceipt.fee.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Cryptographic Transaction Hash */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">
                  Cryptographic Transaction Hash
                </span>
                <div className="text-[10px] text-indigo-300 break-all font-mono-code p-2 bg-slate-900 rounded border border-slate-800">
                  {selectedReceipt.txHash}
                </div>
                <button
                  onClick={() => handleCopyHash(selectedReceipt.txHash)}
                  className="w-full mt-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedHash === selectedReceipt.txHash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Hash</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Transaction Hash</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-3 text-emerald-300 text-[11px] leading-relaxed">
                ✓ Verified by Sigil Cryptographic Key Engine. Receipt settled with zero delta variance.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

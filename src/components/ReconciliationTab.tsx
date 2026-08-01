import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Server, 
  Database, 
  ArrowRightLeft,
  Check,
  ShieldCheck
} from 'lucide-react';
import { ReconciliationDiscrepancy } from '../types/sigil';

interface ReconciliationTabProps {
  discrepancies: ReconciliationDiscrepancy[];
  onResolveDiscrepancy: (discrepancyId: string) => void;
  onRunFullReconciliationScan: () => void;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({
  discrepancies,
  onResolveDiscrepancy,
  onRunFullReconciliationScan
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const totalDelta = discrepancies
    .filter(d => d.status === 'UNRESOLVED')
    .reduce((sum, d) => sum + d.delta, 0);

  const handleScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    setTimeout(() => {
      onRunFullReconciliationScan();
      setIsScanning(false);
      setScanMessage('System topology scan complete. Subgraph index updated.');
      setTimeout(() => setScanMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 font-mono-code flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span>Multi-Bridge Reconciliation Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Automated cross-chain and multi-custody state verification matching off-chain books against live smart contract TVL.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold font-mono-code transition flex items-center gap-2 shadow-md shadow-indigo-950 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Topology...' : 'Run Topology Audit Scan'}</span>
        </button>
      </div>

      {scanMessage && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono-code p-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Topology Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block font-mono-code">
            Expected System TVL
          </span>
          <div className="text-2xl font-bold font-mono-code text-slate-100 mt-1">
            $1,406,183.70
          </div>
          <span className="text-xs text-slate-400 font-mono-code">Ledger Accounting State</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block font-mono-code">
            Observed On-Chain / Custody TVL
          </span>
          <div className="text-2xl font-bold font-mono-code text-indigo-300 mt-1">
            $1,405,883.70
          </div>
          <span className="text-xs text-slate-400 font-mono-code">Live Subgraph Query</span>
        </div>

        <div className={`border rounded-xl p-4 shadow-lg ${
          totalDelta !== 0 ? 'bg-amber-950/30 border-amber-800/80' : 'bg-emerald-950/30 border-emerald-800/80'
        }`}>
          <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider block font-mono-code">
            Net Reconciliation Delta
          </span>
          <div className={`text-2xl font-bold font-mono-code mt-1 ${
            totalDelta !== 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {totalDelta < 0 ? '-' : '+'}${Math.abs(totalDelta).toFixed(2)} USD
          </div>
          <span className="text-xs text-slate-300 font-mono-code">
            {totalDelta !== 0 ? 'Requires Subgraph Sync' : 'Zero Variance Matched'}
          </span>
        </div>
      </div>

      {/* System Topology Component Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code flex items-center gap-2 pb-2 border-b border-slate-800">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>System Topology Bridge Network</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono-code text-xs">
          {[
            { title: 'Core Accounting Ledger', status: 'SYNCHRONIZED', icon: Database, color: 'text-emerald-400' },
            { title: 'Lido Subgraph Indexer', status: 'INDEX LAG (Delta -$300)', icon: Server, color: 'text-amber-400' },
            { title: 'Circle Custody Portal', status: 'SYNCHRONIZED', icon: ShieldCheck, color: 'text-emerald-400' },
            { title: 'NASDAQ DMA Broker Gateway', status: 'SYNCHRONIZED', icon: ArrowRightLeft, color: 'text-emerald-400' },
          ].map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-slate-200">{node.title}</span>
                </div>
                <span className={`text-[11px] block ${node.color}`}>{node.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Level Discrepancy Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code pb-3 border-b border-slate-800">
          Asset-Level Discrepancy Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                <th className="py-2.5 px-3">Asset Target</th>
                <th className="py-2.5 px-3">Custodian / Bridge</th>
                <th className="py-2.5 px-3 text-right">Expected TVL</th>
                <th className="py-2.5 px-3 text-right">Observed TVL</th>
                <th className="py-2.5 px-3 text-right">Delta ($)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
              {discrepancies.map((disc) => (
                <tr key={disc.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-100">{disc.asset}</td>
                  <td className="py-3 px-3 text-slate-400">{disc.location}</td>
                  <td className="py-3 px-3 text-right text-slate-200">${disc.expectedTvl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right text-indigo-300 font-semibold">${disc.observedTvl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className={`py-3 px-3 text-right font-bold ${
                    disc.delta !== 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {disc.delta < 0 ? '' : '+'}${disc.delta.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      disc.status === 'UNRESOLVED' 
                        ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {disc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {disc.status === 'UNRESOLVED' ? (
                      <button
                        onClick={() => onResolveDiscrepancy(disc.id)}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition"
                      >
                        Force Sync Ledger
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Synced</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  FileCheck, 
  Code 
} from 'lucide-react';
import { AuditEvent } from '../types/sigil';

interface AuditTabProps {
  auditLogs: AuditEvent[];
}

export const AuditTab: React.FC<AuditTabProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [inspectedLog, setInspectedLog] = useState<AuditEvent | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || log.eventType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Cryptographic Evidence Context */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/60 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100 font-mono-code uppercase">
              Immutable Cryptographic Audit Evidence Log
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Mission ID: <strong className="font-mono-code text-indigo-300">M-8492-AX</strong> • Smart contract state captured with SHA-256 state hashes.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
          <Key className="w-4 h-4 text-indigo-400" />
          <span>Keystore Proof: <strong className="text-emerald-400">VERIFIED (2048-bit RSA)</strong></span>
        </div>
      </div>

      {/* Audit Log Table & Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table */}
        <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 ${
          inspectedLog ? 'lg:col-span-8' : 'lg:col-span-12'
        }`}>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code">
              Audit Timeline Events ({filteredLogs.length})
            </span>

            <div className="flex items-center gap-3 flex-wrap font-mono-code text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search audit events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Event Types</option>
                <option value="PROPOSAL_AUTHORIZATION">Proposal Governance</option>
                <option value="EXECUTION_RECEIPT">Execution Receipt</option>
                <option value="RECONCILIATION_SYNC">Reconciliation Sync</option>
                <option value="SMART_CONTRACT_DEPLOY">Smart Contract Deploy</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono-code text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Audit ID</th>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Actor / Worker</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono-code">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id}
                    onClick={() => setInspectedLog(log)}
                    className={`hover:bg-slate-800/60 cursor-pointer transition ${
                      inspectedLog?.id === log.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-indigo-400">{log.id}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
                        {log.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">{log.actor}</td>
                    <td className="py-3 px-3 text-slate-200 max-w-xs truncate">{log.description}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        log.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Selected Log Inspector */}
        {inspectedLog && (
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Audit Detail {inspectedLog.id}</span>
              </h3>
              <button 
                onClick={() => setInspectedLog(null)}
                className="text-xs text-slate-400 hover:text-slate-100 font-mono-code"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-300 font-bold">{inspectedLog.description}</div>
                <div className="text-slate-400 text-[11px]">Actor: {inspectedLog.actor}</div>
                <div className="text-slate-400 text-[11px]">Timestamp: {inspectedLog.timestamp}</div>
              </div>

              {/* SHA-256 Cryptographic Hash */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">
                  SHA-256 Cryptographic State Hash
                </span>
                <div className="text-[10px] text-indigo-300 break-all font-mono-code p-2 bg-slate-900 rounded border border-slate-800">
                  {inspectedLog.hash}
                </div>
                <button
                  onClick={() => handleCopyHash(inspectedLog.hash)}
                  className="w-full mt-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  {copiedHash === inspectedLog.hash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Hash</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy State Hash</span>
                    </>
                  )}
                </button>
              </div>

              {/* Raw JSON Payload */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block uppercase font-bold flex items-center gap-1">
                  <Code className="w-3 h-3 text-indigo-400" />
                  Metadata JSON Payload
                </span>
                <pre className="text-[10px] text-slate-300 bg-slate-900 p-2 rounded overflow-x-auto">
                  {JSON.stringify(inspectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

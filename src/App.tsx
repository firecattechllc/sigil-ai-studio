import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { OverviewTab } from './components/OverviewTab';
import { PortfolioTab } from './components/PortfolioTab';
import { ProposalsTab } from './components/ProposalsTab';
import { LaunchTab } from './components/LaunchTab';
import { ExecutionsTab } from './components/ExecutionsTab';
import { ReconciliationTab } from './components/ReconciliationTab';
import { AuditTab } from './components/AuditTab';
import { NewsTab } from './components/NewsTab';
import { SettingsTab } from './components/SettingsTab';

import { HermesDrawer } from './components/HermesDrawer';
import { SystemHealthModal } from './components/SystemHealthModal';
import { NewProposalModal } from './components/NewProposalModal';

import { 
  SystemState, 
  Position, 
  Proposal, 
  ExecutionReceipt, 
  ReconciliationDiscrepancy, 
  AuditEvent, 
  NewsItem, 
  LaunchControlState 
} from './types/sigil';

import {
  INITIAL_POSITIONS,
  INITIAL_PROPOSALS,
  INITIAL_EXECUTIONS,
  INITIAL_DISCREPANCIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NEWS,
  INITIAL_LAUNCH_CONTROL
} from './data/mockSigilData';

export default function App() {
  // Global State
  const [systemState, setSystemState] = useState<SystemState>('ACTIVE');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Data Collections
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [executions, setExecutions] = useState<ExecutionReceipt[]>(INITIAL_EXECUTIONS);
  const [discrepancies, setDiscrepancies] = useState<ReconciliationDiscrepancy[]>(INITIAL_DISCREPANCIES);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [launchState, setLaunchState] = useState<LaunchControlState>(INITIAL_LAUNCH_CONTROL);

  // Modals & Active Inspector State
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(INITIAL_PROPOSALS[0]);
  const [isSystemHealthOpen, setIsSystemHealthOpen] = useState(false);
  const [isHermesOpen, setIsHermesOpen] = useState(false);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);

  // Helper to append audit log
  const addAuditLog = (
    eventType: AuditEvent['eventType'],
    actor: string,
    description: string,
    severity: AuditEvent['severity'] = 'INFO',
    metadata: Record<string, any> = {}
  ) => {
    const newAudit: AuditEvent = {
      id: `AUD-00${Math.floor(893 + auditLogs.length)}`,
      missionId: 'M-8492-AX',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      eventType,
      actor,
      description,
      hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      severity,
      metadata
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Authorize Proposal
  const handleAuthorizeProposal = (proposalId: string) => {
    const target = proposals.find(p => p.id === proposalId);
    if (!target) return;

    // Update proposal status
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'AUTHORIZED' } : p));

    // Create execution receipt
    const recId = `REC-${Math.floor(9282 + executions.length)}-${['A', 'B', 'C', 'D'][executions.length % 4]}`;
    const newReceipt: ExecutionReceipt = {
      id: recId,
      proposalId: target.id,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      side: target.direction,
      ticker: target.ticker,
      quantity: target.quantity,
      price: target.targetPrice,
      totalValue: target.estimatedValue,
      fee: 15.00,
      status: 'SETTLED',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      executionVenue: 'Institutional DMA Gateway',
      slippageBps: 1.1
    };
    setExecutions(prev => [newReceipt, ...prev]);

    // Update or add position
    setPositions(prev => {
      const existingIndex = prev.findIndex(pos => pos.ticker === target.ticker);
      if (existingIndex >= 0) {
        return prev.map((pos, idx) => {
          if (idx === existingIndex) {
            const addedQty = target.direction === 'BUY' ? target.quantity : -target.quantity;
            const newQty = Math.max(1, pos.quantity + addedQty);
            const newMarketValue = newQty * pos.currentPrice;
            return {
              ...pos,
              quantity: newQty,
              marketValue: newMarketValue,
              unrealizedPnL: (pos.currentPrice - pos.avgPrice) * newQty
            };
          }
          return pos;
        });
      } else {
        const newPos: Position = {
          id: `pos-${target.ticker.toLowerCase()}`,
          ticker: target.ticker,
          name: target.assetName,
          assetClass: 'EQUITY',
          quantity: target.quantity,
          avgPrice: target.targetPrice,
          currentPrice: target.targetPrice,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          marketValue: target.estimatedValue,
          dayChangePercent: 0,
          allocationPercent: 5.0
        };
        return [...prev, newPos];
      }
    });

    // Add Audit Log
    addAuditLog(
      'PROPOSAL_AUTHORIZATION',
      'Executive Governance Signer',
      `Authorized Proposal ${target.id} (${target.direction} ${target.quantity} ${target.ticker} @ $${target.targetPrice}). Receipt ${recId} settled.`,
      'INFO',
      { proposalId, receiptId: recId }
    );
  };

  // Reject Proposal
  const handleRejectProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'REJECTED' } : p));
    addAuditLog(
      'PROPOSAL_AUTHORIZATION',
      'Executive Governance Signer',
      `Rejected Proposal ${proposalId}. Order flow canceled.`,
      'WARNING',
      { proposalId }
    );
  };

  // Paper Trade Simulator Handler
  const handleExecutePaperTrade = (trade: {
    ticker: string;
    name: string;
    assetClass: 'EQUITY' | 'CRYPTO' | 'FX' | 'COMMODITY';
    direction: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => {
    const totalVal = trade.price * trade.quantity;
    const recId = `REC-${Math.floor(9282 + executions.length)}-${['A', 'B', 'C', 'D'][executions.length % 4]}`;

    const newReceipt: ExecutionReceipt = {
      id: recId,
      proposalId: `MANUAL-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      side: trade.direction,
      ticker: trade.ticker,
      quantity: trade.quantity,
      price: trade.price,
      totalValue: totalVal,
      fee: 12.50,
      status: 'SETTLED',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      executionVenue: 'Direct Broker Connection',
      slippageBps: 0.9
    };
    setExecutions(prev => [newReceipt, ...prev]);

    // Position updates
    setPositions(prev => {
      const idx = prev.findIndex(p => p.ticker === trade.ticker);
      if (idx >= 0) {
        return prev.map((p, i) => {
          if (i === idx) {
            const added = trade.direction === 'BUY' ? trade.quantity : -trade.quantity;
            const newQty = Math.max(1, p.quantity + added);
            return {
              ...p,
              quantity: newQty,
              marketValue: newQty * p.currentPrice
            };
          }
          return p;
        });
      } else {
        return [...prev, {
          id: `pos-${trade.ticker.toLowerCase()}`,
          ticker: trade.ticker,
          name: trade.name,
          assetClass: trade.assetClass,
          quantity: trade.quantity,
          avgPrice: trade.price,
          currentPrice: trade.price,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          marketValue: totalVal,
          dayChangePercent: 0.5,
          allocationPercent: 4.5
        }];
      }
    });

    addAuditLog(
      'EXECUTION_RECEIPT',
      'Paper Trade Simulator',
      `Executed ${trade.direction} trade for ${trade.quantity} ${trade.ticker} @ $${trade.price}. Settled receipt ${recId}.`,
      'INFO',
      { receiptId: recId, totalValue: totalVal }
    );
  };

  // Submit New Proposal
  const handleSubmitNewProposal = (newProp: Proposal) => {
    setProposals(prev => [newProp, ...prev]);
    setSelectedProposal(newProp);
    addAuditLog(
      'PROPOSAL_AUTHORIZATION',
      newProp.author,
      `Created trade proposal ${newProp.id} for ${newProp.ticker} (${newProp.direction} ${newProp.quantity} shares). Submitted to Governance.`,
      'INFO',
      { proposalId: newProp.id }
    );
  };

  // Resolve Discrepancy
  const handleResolveDiscrepancy = (discrepancyId: string) => {
    setDiscrepancies(prev => prev.map(d => d.id === discrepancyId ? { ...d, status: 'RESOLVED', delta: 0 } : d));
    addAuditLog(
      'RECONCILIATION_SYNC',
      'Reconciliation Engine',
      `Resolved topology discrepancy ${discrepancyId}. Subgraph index state synchronized with core ledger.`,
      'INFO',
      { discrepancyId }
    );
  };

  // Full Reconciliation Scan
  const handleRunFullReconciliationScan = () => {
    addAuditLog(
      'RECONCILIATION_SYNC',
      'Reconciliation Audit Worker',
      'Executed full cross-chain and custody topology scan. All 4 bridge connections audited.',
      'INFO'
    );
  };

  // Emergency Stop Trigger
  const handleTriggerEmergencyStop = () => {
    setSystemState('BLOCKED');
    setLaunchState(prev => ({ ...prev, automationMode: 'PAUSED', circuitBreakerActive: true }));
    addAuditLog(
      'CIRCUIT_BREAKER_TRIGGER',
      'Executive Emergency Switcher',
      'EMERGENCY STOP ACTIVATED: System state forced to BLOCKED. All automated order flow paused.',
      'CRITICAL'
    );
  };

  // Reset Portfolio
  const handleResetPortfolio = () => {
    setPositions(INITIAL_POSITIONS);
    setProposals(INITIAL_PROPOSALS);
    setExecutions(INITIAL_EXECUTIONS);
    setDiscrepancies(INITIAL_DISCREPANCIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNews(INITIAL_NEWS);
    setLaunchState(INITIAL_LAUNCH_CONTROL);
    setSystemState('ACTIVE');
  };

  const pendingCount = proposals.filter(p => p.status === 'PENDING').length;
  const unresolvedDiscCount = discrepancies.filter(d => d.status === 'UNRESOLVED').length;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header Bar */}
      <Header
        systemState={systemState}
        setSystemState={setSystemState}
        onOpenSystemHealth={() => setIsSystemHealthOpen(true)}
        onOpenHermes={() => setIsHermesOpen(true)}
        onOpenNewProposal={() => setIsNewProposalOpen(true)}
        pendingProposalsCount={pendingCount}
      />

      {/* Main Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingProposalsCount={pendingCount}
        unresolvedDiscrepanciesCount={unresolvedDiscCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab
            positions={positions}
            proposals={proposals}
            executions={executions}
            discrepancies={discrepancies}
            auditLogs={auditLogs}
            launchState={launchState}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectProposal={(prop) => {
              setSelectedProposal(prop);
              setActiveTab('proposals');
            }}
            onAuthorizeProposal={handleAuthorizeProposal}
            onRejectProposal={handleRejectProposal}
            onOpenHermes={() => setIsHermesOpen(true)}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab
            positions={positions}
            onExecutePaperTrade={handleExecutePaperTrade}
          />
        )}

        {activeTab === 'proposals' && (
          <ProposalsTab
            proposals={proposals}
            selectedProposal={selectedProposal}
            onSelectProposal={(prop) => setSelectedProposal(prop)}
            onAuthorizeProposal={handleAuthorizeProposal}
            onRejectProposal={handleRejectProposal}
            onOpenNewProposal={() => setIsNewProposalOpen(true)}
          />
        )}

        {activeTab === 'launch' && (
          <LaunchTab
            launchState={launchState}
            setLaunchState={setLaunchState}
            systemState={systemState}
            setSystemState={setSystemState}
            onTriggerEmergencyStop={handleTriggerEmergencyStop}
          />
        )}

        {activeTab === 'executions' && (
          <ExecutionsTab executions={executions} />
        )}

        {activeTab === 'reconciliation' && (
          <ReconciliationTab
            discrepancies={discrepancies}
            onResolveDiscrepancy={handleResolveDiscrepancy}
            onRunFullReconciliationScan={handleRunFullReconciliationScan}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTab auditLogs={auditLogs} />
        )}

        {activeTab === 'news' && (
          <NewsTab news={news} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab onResetPortfolio={handleResetPortfolio} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-xs text-slate-500 font-mono-code flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">SIGIL MISSION CONTROL</span>
          <span>•</span>
          <span>Institutional v3.5.2</span>
        </div>
        <div>
          Connected to Sigil Enclave • Gemini 2.5 Flash Powered
        </div>
      </footer>

      {/* Modals & Slide-over Drawers */}
      <HermesDrawer
        isOpen={isHermesOpen}
        onClose={() => setIsHermesOpen(false)}
      />

      <SystemHealthModal
        isOpen={isSystemHealthOpen}
        onClose={() => setIsSystemHealthOpen(false)}
        systemState={systemState}
        setSystemState={setSystemState}
      />

      <NewProposalModal
        isOpen={isNewProposalOpen}
        onClose={() => setIsNewProposalOpen(false)}
        onSubmitProposal={handleSubmitNewProposal}
      />
    </div>
  );
}

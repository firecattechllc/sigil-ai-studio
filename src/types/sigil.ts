export type SystemState = 'ACTIVE' | 'DEGRADED' | 'BLOCKED' | 'RECOVERING' | 'STARTUP';

export interface Position {
  id: string;
  ticker: string;
  name: string;
  assetClass: 'EQUITY' | 'CRYPTO' | 'FX' | 'COMMODITY';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  marketValue: number;
  dayChangePercent: number;
  allocationPercent: number;
}

export interface Proposal {
  id: string; // e.g. PRP-8924-X
  ticker: string;
  assetName: string;
  direction: 'BUY' | 'SELL';
  targetPrice: number;
  quantity: number;
  estimatedValue: number;
  riskScore: number; // 1-10
  status: 'PENDING' | 'AUTHORIZED' | 'REJECTED' | 'EXECUTED';
  thesis: string;
  technicalSignals: {
    rsi: number;
    macdStatus: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    volumeRatio: number;
    supportLevel: number;
    resistanceLevel: number;
  };
  hermesInsight: {
    recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'REJECT';
    confidence: number;
    summary: string;
    keyRisks: string[];
    marketCatalysts: string[];
  };
  createdTimestamp: string;
  author: string;
}

export interface ExecutionReceipt {
  id: string; // e.g. REC-9281-A
  proposalId: string;
  timestamp: string;
  side: 'BUY' | 'SELL';
  ticker: string;
  quantity: number;
  price: number;
  totalValue: number;
  fee: number;
  status: 'SETTLED' | 'PENDING' | 'FAILED';
  txHash: string;
  executionVenue: string;
  slippageBps: number;
}

export interface ReconciliationDiscrepancy {
  id: string;
  asset: string;
  expectedTvl: number;
  observedTvl: number;
  delta: number;
  currency: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'IGNORED';
  lastChecked: string;
  location: string;
}

export interface AuditEvent {
  id: string; // e.g. AUD-00124
  missionId: string; // e.g. M-8492-AX
  timestamp: string;
  eventType: 'SMART_CONTRACT_DEPLOY' | 'PROPOSAL_AUTHORIZATION' | 'CIRCUIT_BREAKER_TRIGGER' | 'RECONCILIATION_SYNC' | 'SYSTEM_STATE_CHANGE' | 'EXECUTION_RECEIPT';
  actor: string;
  description: string;
  hash: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metadata: Record<string, any>;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: 'MACRO' | 'M&A' | 'EARNINGS' | 'REGULATORY' | 'ALERT';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactScore: number; // 1-100
  summary: string;
  affectedTickers: string[];
}

export interface LaunchControlState {
  automationMode: 'AUTONOMOUS' | 'SEMI_AUTONOMOUS' | 'MANUAL_ONLY' | 'PAUSED';
  safetyStatus: 'NOMINAL' | 'WARNING' | 'CRITICAL_BLOCK';
  maxDrawdownLimit: number; // e.g. 5.0%
  currentDrawdown: number; // e.g. 1.2%
  maxPositionSizeUsd: number; // e.g. 250,000
  circuitBreakerActive: boolean;
  authorizationTokenExpires: string; // e.g. 2026-08-31
  activeWorkerNodes: number;
  totalWorkerNodes: number;
  brokerStatus: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
}

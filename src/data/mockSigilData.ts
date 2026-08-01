import {
  Position,
  Proposal,
  ExecutionReceipt,
  ReconciliationDiscrepancy,
  AuditEvent,
  NewsItem,
  LaunchControlState
} from '../types/sigil';

export const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos-aapl',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'EQUITY',
    quantity: 1450,
    avgPrice: 224.50,
    currentPrice: 232.80,
    unrealizedPnL: 12035.00,
    unrealizedPnLPercent: 3.69,
    marketValue: 337560.00,
    dayChangePercent: 1.24,
    allocationPercent: 24.1
  },
  {
    id: 'pos-nvda',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    assetClass: 'EQUITY',
    quantity: 2100,
    avgPrice: 118.20,
    currentPrice: 128.45,
    unrealizedPnL: 21525.00,
    unrealizedPnLPercent: 8.67,
    marketValue: 269745.00,
    dayChangePercent: 2.85,
    allocationPercent: 19.2
  },
  {
    id: 'pos-msft',
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    assetClass: 'EQUITY',
    quantity: 620,
    avgPrice: 435.10,
    currentPrice: 448.90,
    unrealizedPnL: 8556.00,
    unrealizedPnLPercent: 3.17,
    marketValue: 278318.00,
    dayChangePercent: -0.42,
    allocationPercent: 19.8
  },
  {
    id: 'pos-eth',
    ticker: 'ETH',
    name: 'Ethereum Staked (stETH)',
    assetClass: 'CRYPTO',
    quantity: 78.5,
    avgPrice: 3120.00,
    currentPrice: 3410.20,
    unrealizedPnL: 22780.70,
    unrealizedPnLPercent: 9.30,
    marketValue: 267700.70,
    dayChangePercent: 4.12,
    allocationPercent: 19.1
  },
  {
    id: 'pos-googl',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    assetClass: 'EQUITY',
    quantity: 1100,
    avgPrice: 172.40,
    currentPrice: 178.60,
    unrealizedPnL: 6820.00,
    unrealizedPnLPercent: 3.59,
    marketValue: 196460.00,
    dayChangePercent: 0.88,
    allocationPercent: 14.0
  },
  {
    id: 'pos-btc',
    ticker: 'BTC',
    name: 'Bitcoin Wrapped (WBTC)',
    assetClass: 'CRYPTO',
    quantity: 0.85,
    avgPrice: 62400.00,
    currentPrice: 67200.00,
    unrealizedPnL: 4080.00,
    unrealizedPnLPercent: 7.69,
    marketValue: 57120.00,
    dayChangePercent: 1.95,
    allocationPercent: 3.8
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'PRP-8924-X',
    ticker: 'AAPL',
    assetName: 'Apple Inc. Equity',
    direction: 'BUY',
    targetPrice: 230.50,
    quantity: 350,
    estimatedValue: 80675.00,
    riskScore: 3.2,
    status: 'PENDING',
    thesis: 'Pre-earnings positioning following institutional supply chain checks indicating robust demand for AI-integrated iPad & M4 hardware refresh. Low implied volatility skew presents optimal risk/reward entry.',
    technicalSignals: {
      rsi: 58.4,
      macdStatus: 'BULLISH',
      volumeRatio: 1.42,
      supportLevel: 224.00,
      resistanceLevel: 238.50
    },
    hermesInsight: {
      recommendation: 'STRONG_BUY',
      confidence: 0.88,
      summary: 'High alpha probability supported by cluster accumulation in dark pools and favorable macro sector rotation.',
      keyRisks: ['Slight earnings implied volatility expansion', 'China broader consumer demand Headwinds'],
      marketCatalysts: ['Upcoming Apple Worldwide Developers Conference followup', 'Quarterly Dividend & Buyback announcement']
    },
    createdTimestamp: '2026-08-01 13:42:10 UTC',
    author: 'Hermes Quant Engine v3.5'
  },
  {
    id: 'PRP-8923-Y',
    ticker: 'TSLA',
    assetName: 'Tesla Inc. Equity',
    direction: 'SELL',
    targetPrice: 215.00,
    quantity: 200,
    estimatedValue: 43000.00,
    riskScore: 6.8,
    status: 'PENDING',
    thesis: 'Hedge position due to momentum breakdown below the 20-day exponential moving average and elevated options call skew ahead of delivery reports.',
    technicalSignals: {
      rsi: 41.2,
      macdStatus: 'BEARISH',
      volumeRatio: 0.89,
      supportLevel: 202.00,
      resistanceLevel: 228.00
    },
    hermesInsight: {
      recommendation: 'HOLD',
      confidence: 0.65,
      summary: 'Mixed signals between tech sector macro momentum and EV delivery sentiment. Recommend reduced position size.',
      keyRisks: ['Regulatory EV credit shifts', 'Elevated beta volatility'],
      marketCatalysts: ['Quarterly EV delivery metrics release']
    },
    createdTimestamp: '2026-08-01 12:15:00 UTC',
    author: 'Risk Oversight Algorithm'
  },
  {
    id: 'PRP-8920-Z',
    ticker: 'ETH',
    assetName: 'Ethereum Staked',
    direction: 'BUY',
    targetPrice: 3380.00,
    quantity: 15.0,
    estimatedValue: 50700.00,
    riskScore: 4.1,
    status: 'AUTHORIZED',
    thesis: 'Systemic yield capture through liquid staking rebalancing following layer 2 gas consumption surge.',
    technicalSignals: {
      rsi: 62.1,
      macdStatus: 'BULLISH',
      volumeRatio: 1.75,
      supportLevel: 3250.00,
      resistanceLevel: 3600.00
    },
    hermesInsight: {
      recommendation: 'BUY',
      confidence: 0.91,
      summary: 'Favorable staking yield differential vs risk-free Treasury rate.',
      keyRisks: ['Validator queue delay', 'Smart contract rebalance slippage'],
      marketCatalysts: ['Proto-danksharding protocol upgrade activation']
    },
    createdTimestamp: '2026-08-01 09:30:22 UTC',
    author: 'DeFi Rebalancer'
  }
];

export const INITIAL_EXECUTIONS: ExecutionReceipt[] = [
  {
    id: 'REC-9281-A',
    proposalId: 'PRP-8919-W',
    timestamp: '2026-08-01 13:10:04 UTC',
    side: 'BUY',
    ticker: 'NVDA',
    quantity: 150,
    price: 127.80,
    totalValue: 19170.00,
    fee: 14.20,
    status: 'SETTLED',
    txHash: '0x8f9a2c3d1e4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0',
    executionVenue: 'NASDAQ Direct Market Access',
    slippageBps: 1.2
  },
  {
    id: 'REC-9280-B',
    proposalId: 'PRP-8918-V',
    timestamp: '2026-08-01 11:45:19 UTC',
    side: 'SELL',
    ticker: 'AMZN',
    quantity: 80,
    price: 184.25,
    totalValue: 14740.00,
    fee: 9.80,
    status: 'SETTLED',
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    executionVenue: 'IEX Smart Router',
    slippageBps: 0.8
  },
  {
    id: 'REC-9279-C',
    proposalId: 'PRP-8915-U',
    timestamp: '2026-08-01 10:02:50 UTC',
    side: 'BUY',
    ticker: 'MSFT',
    quantity: 100,
    price: 446.10,
    totalValue: 44610.00,
    fee: 22.50,
    status: 'SETTLED',
    txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
    executionVenue: 'NYSE Arca Dark Pool',
    slippageBps: 2.1
  },
  {
    id: 'REC-9278-D',
    proposalId: 'PRP-8910-T',
    timestamp: '2026-08-01 08:20:11 UTC',
    side: 'BUY',
    ticker: 'ETH',
    quantity: 12.5,
    price: 3390.00,
    totalValue: 42375.00,
    fee: 38.00,
    status: 'SETTLED',
    txHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    executionVenue: 'Uniswap v3 Liquid Engine',
    slippageBps: 3.5
  }
];

export const INITIAL_DISCREPANCIES: ReconciliationDiscrepancy[] = [
  {
    id: 'DISC-001',
    asset: 'ETH Liquid Staking Pool',
    expectedTvl: 268000.70,
    observedTvl: 267700.70,
    delta: -300.00,
    currency: 'USD',
    severity: 'MEDIUM',
    status: 'UNRESOLVED',
    lastChecked: '2026-08-01 13:50:00 UTC',
    location: 'Lido Staking Router Subgraph'
  },
  {
    id: 'DISC-002',
    asset: 'USDC Treasury Reserve',
    expectedTvl: 125000.00,
    observedTvl: 125000.00,
    delta: 0.00,
    currency: 'USD',
    severity: 'LOW',
    status: 'RESOLVED',
    lastChecked: '2026-08-01 13:00:00 UTC',
    location: 'Circle Institutional Custody'
  },
  {
    id: 'DISC-003',
    asset: 'WBTC Vault Bridge',
    expectedTvl: 57120.00,
    observedTvl: 57120.00,
    delta: 0.00,
    currency: 'USD',
    severity: 'LOW',
    status: 'RESOLVED',
    lastChecked: '2026-08-01 12:30:00 UTC',
    location: 'BitGo Custody Portal'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-00892',
    missionId: 'M-8492-AX',
    timestamp: '2026-08-01 13:52:14 UTC',
    eventType: 'RECONCILIATION_SYNC',
    actor: 'Automated Reconciliation Worker #4',
    description: 'System topology scan completed. Observed TVL delta -$300 USD detected on ETH Liquid Pool.',
    hash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    severity: 'WARNING',
    metadata: { expected: 268000.7, observed: 267700.7, delta: -300 }
  },
  {
    id: 'AUD-00891',
    missionId: 'M-8492-AX',
    timestamp: '2026-08-01 13:42:10 UTC',
    eventType: 'PROPOSAL_AUTHORIZATION',
    actor: 'Hermes Quant Engine v3.5',
    description: 'Generated Proposal PRP-8924-X for AAPL Equity (350 shares @ $230.50). Submitted to Governance Queue.',
    hash: '0x8f9a2c3d1e4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0',
    severity: 'INFO',
    metadata: { proposalId: 'PRP-8924-X', ticker: 'AAPL', qty: 350 }
  },
  {
    id: 'AUD-00890',
    missionId: 'M-8492-AX',
    timestamp: '2026-08-01 13:10:04 UTC',
    eventType: 'EXECUTION_RECEIPT',
    actor: 'Broker Connector NASDAQ DMA',
    description: 'Settled trade execution receipt REC-9281-A (BUY 150 NVDA @ $127.80).',
    hash: '0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e',
    severity: 'INFO',
    metadata: { receiptId: 'REC-9281-A', valueUsd: 19170.0 }
  },
  {
    id: 'AUD-00889',
    missionId: 'M-8492-AX',
    timestamp: '2026-08-01 08:00:00 UTC',
    eventType: 'SMART_CONTRACT_DEPLOY',
    actor: 'System Admin Auth Token 0x73A...119',
    description: 'Sigil Mission Control v3.5 smart contract state verification and risk parameter check passed.',
    hash: '0x9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
    severity: 'INFO',
    metadata: { contractAddress: '0x73A219f8C22108d44002e', version: 'v3.5.2' }
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'NEWS-001',
    title: 'Federal Reserve Signals Favorable Rate Path Amid Stabilizing Inflation Metrics',
    source: 'Bloomberg Terminal',
    timestamp: '25 min ago',
    category: 'MACRO',
    sentiment: 'BULLISH',
    impactScore: 88,
    summary: 'Central bank officials noted easing yield curve pressures and steady labor market trends, encouraging equity risk allocation across major indices.',
    affectedTickers: ['AAPL', 'MSFT', 'GOOGL', 'NVDA']
  },
  {
    id: 'NEWS-002',
    title: 'NVIDIA Announces Expanded Enterprise AI Architecture & Cloud Partnerships',
    source: 'Reuters Financial',
    timestamp: '1 hour ago',
    category: 'M&A',
    sentiment: 'BULLISH',
    impactScore: 92,
    summary: 'Multi-billion dollar server infrastructure commitments expected to drive Q3 data center revenue guidance beyond previous consensus targets.',
    affectedTickers: ['NVDA', 'MSFT']
  },
  {
    id: 'NEWS-003',
    title: 'Global Regulatory Body Issues Updated Framework for Institutional Digital Asset Custody',
    source: 'Financial Times',
    timestamp: '3 hours ago',
    category: 'REGULATORY',
    sentiment: 'NEUTRAL',
    impactScore: 74,
    summary: 'New guidelines clarify staked asset segregation requirements, reducing legal friction for institutional DeFi liquid staking providers.',
    affectedTickers: ['ETH', 'BTC']
  }
];

export const INITIAL_LAUNCH_CONTROL: LaunchControlState = {
  automationMode: 'SEMI_AUTONOMOUS',
  safetyStatus: 'NOMINAL',
  maxDrawdownLimit: 5.0,
  currentDrawdown: 1.2,
  maxPositionSizeUsd: 250000,
  circuitBreakerActive: false,
  authorizationTokenExpires: '2026-08-31T23:59:59Z',
  activeWorkerNodes: 8,
  totalWorkerNodes: 8,
  brokerStatus: 'CONNECTED'
};

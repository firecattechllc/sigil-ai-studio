import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Rocket, 
  Receipt, 
  Scale, 
  ShieldCheck, 
  Newspaper, 
  Settings 
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'portfolio' 
  | 'proposals' 
  | 'launch' 
  | 'executions' 
  | 'reconciliation' 
  | 'audit' 
  | 'news' 
  | 'settings';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingProposalsCount: number;
  unresolvedDiscrepanciesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingProposalsCount,
  unresolvedDiscrepanciesCount
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { 
      id: 'proposals', 
      label: 'Proposals', 
      icon: FileText,
      badge: pendingProposalsCount > 0 ? pendingProposalsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    { id: 'launch', label: 'Launch Control', icon: Rocket },
    { id: 'executions', label: 'Executions', icon: Receipt },
    { 
      id: 'reconciliation', 
      label: 'Reconciliation', 
      icon: Scale,
      badge: unresolvedDiscrepanciesCount > 0 ? unresolvedDiscrepanciesCount : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
    { id: 'news', label: 'News & Briefs', icon: Newspaper },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-slate-950/80 border-b border-slate-800/80 sticky top-[57px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none flex items-center gap-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono-code border font-bold ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

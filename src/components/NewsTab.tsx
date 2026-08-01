import React, { useState } from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Globe, 
  Search, 
  Send, 
  Bot, 
  Zap,
  Activity
} from 'lucide-react';
import { NewsItem } from '../types/sigil';

interface NewsTabProps {
  news: NewsItem[];
}

export const NewsTab: React.FC<NewsTabProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const filteredNews = news.filter(n => {
    if (selectedCategory === 'ALL') return true;
    return n.category === selectedCategory;
  });

  const handleGenerateAiBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setAiBriefing(null);

    try {
      const res = await fetch('/api/gemini/ask-hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Generate a quantitative intelligence brief regarding: ${customPrompt}`,
          context: { newsArticlesCount: news.length, currentTvl: '$1.42M' }
        })
      });
      const data = await res.json();
      setAiBriefing(data.reply || 'Generated brief complete.');
    } catch (err) {
      console.error(err);
      setAiBriefing('Failed to contact Hermes AI engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Market Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-500 block text-[10px]">S&P 500 Index (SPX)</span>
          <span className="text-slate-100 font-bold text-sm">5,620.40</span>
          <span className="text-emerald-400 font-semibold block text-[11px]">+0.42%</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-500 block text-[10px]">NASDAQ 100 (NDX)</span>
          <span className="text-slate-100 font-bold text-sm">19,840.10</span>
          <span className="text-emerald-400 font-semibold block text-[11px]">+0.88%</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-500 block text-[10px]">VIX Volatility Index</span>
          <span className="text-slate-100 font-bold text-sm">14.20</span>
          <span className="text-emerald-400 font-semibold block text-[11px]">-2.10%</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-500 block text-[10px]">US 10Y Yield</span>
          <span className="text-slate-100 font-bold text-sm">3.92%</span>
          <span className="text-slate-400 block text-[11px]">-1.15 bps</span>
        </div>
      </div>

      {/* Main Grid: Global News & Hermes Custom Brief Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Global Feed (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase font-mono-code flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-indigo-400" />
              <span>Global Intelligence Feed</span>
            </h2>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono-code text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="MACRO">Macro Economics</option>
              <option value="M&A">M&A / Sector</option>
              <option value="REGULATORY">Regulatory</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-code">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-400">{item.source}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.sentiment === 'BULLISH' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    item.sentiment === 'BEARISH' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {item.sentiment} ({item.impactScore} Impact)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center gap-2 pt-1 font-mono-code text-[11px]">
                  <span className="text-slate-500">Affected Tickers:</span>
                  {item.affectedTickers.map(t => (
                    <span key={t} className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                      ${t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini AI Intelligence Brief Generator (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-900/60 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase font-mono-code">
                Gemini Market Intelligence Digest
              </h3>
              <p className="text-[10px] text-indigo-300 font-mono-code">
                Generates AI macro thesis & catalyst breakdown
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateAiBrief} className="space-y-3">
            <textarea
              rows={3}
              placeholder="E.g. Analyze potential liquidity and option volatility impact if Apple announces expanded cloud AI partnership..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-sans text-slate-200 focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={isGenerating || !customPrompt.trim()}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono-code text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-950 disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Intelligence...' : 'Generate Gemini Brief'}</span>
            </button>
          </form>

          {aiBriefing && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-800/80 space-y-2">
              <span className="text-[10px] font-mono-code text-indigo-400 font-bold uppercase block">
                Hermes Generative Brief Output:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {aiBriefing}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

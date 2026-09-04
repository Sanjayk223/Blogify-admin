import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  Eye, 
  Share2, 
  Calculator,
  QrCode,
  Zap,
  Info
} from 'lucide-react';
import { ShortLink, AdSettings, User } from '../types';

interface DashboardProps {
  user: User;
  links: ShortLink[];
  adSettings: AdSettings;
  onShorten: (url: string, alias?: string, title?: string) => ShortLink | null;
  onOpenTestBypass: (link?: ShortLink) => void;
  onGoToWallet: () => void;
  onGoToLinks: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  links,
  adSettings,
  onShorten,
  onOpenTestBypass,
  onGoToWallet,
  onGoToLinks
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newlyCreated, setNewlyCreated] = useState<ShortLink | null>(null);
  const [calculatorViews, setCalculatorViews] = useState<number>(2000);
  const [errorMsg, setErrorMsg] = useState('');

  const handleShortenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!urlInput.trim()) {
      setErrorMsg('Please paste a valid URL to shorten');
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const created = onShorten(formattedUrl, aliasInput.trim() || undefined);
    if (created) {
      setNewlyCreated(created);
      setUrlInput('');
      setAliasInput('');
    } else {
      setErrorMsg('Alias already taken. Please try another custom alias.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculations for stats
  const totalViews = links.reduce((sum, l) => sum + l.views, 0);
  const calculatedEarnings = (calculatorViews / 1000) * adSettings.cpmRate;

  return (
    <div className="p-4 space-y-5">
      {/* User Greeting & Quick Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-5 border border-indigo-500/30 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
              <span>Namaste, {user.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1 tracking-tight">
              {adSettings.currency}{user.balance.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400">Available for Instant UPI Payout</div>
          </div>
          <button
            id="withdraw-cta-dashboard"
            onClick={onGoToWallet}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Withdraw UPI</span>
          </button>
        </div>

        {/* Quick 3 metrics strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-indigo-800/40 text-center">
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">CPM Rate</div>
            <div className="text-xs font-bold text-amber-400 mt-0.5">{adSettings.currency}{adSettings.cpmRate}<span className="text-[9px] font-normal text-slate-400">/1k</span></div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Clicks</div>
            <div className="text-xs font-bold text-sky-400 mt-0.5">{totalViews.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Paid</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">{adSettings.currency}{user.totalWithdrawn.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* URL Shorten Form Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Shorten New URL & Earn</span>
          </h2>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
            3-Step Monetized
          </span>
        </div>

        <form onSubmit={handleShortenSubmit} className="space-y-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Destination URL (Destination Link)</label>
            <input
              id="input-original-url"
              type="text"
              placeholder="https://example.com/movie-download-or-pdf"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Custom Alias (Optional)</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">short.io/</span>
                <input
                  id="input-custom-alias"
                  type="text"
                  placeholder="my-link"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full ml-1"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                id="btn-shorten-submit"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shorten & Get Link</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2 rounded-lg">
              {errorMsg}
            </p>
          )}
        </form>

        {/* Newly created link result notification */}
        {newlyCreated && (
          <div className="mt-3 p-3 bg-indigo-950/50 border border-indigo-500/40 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1.5">
              <span>🎉 Link Ready for Sharing!</span>
              <span className="text-[10px] text-slate-400 font-normal">Earn {adSettings.currency}{(adSettings.cpmRate / 1000).toFixed(2)} / view</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-indigo-300 truncate flex-1">
                https://shortearn.in/{newlyCreated.shortCode}
              </span>
              <button
                id="copy-new-link-btn"
                onClick={() => copyToClipboard(`https://shortearn.in/${newlyCreated.shortCode}`, newlyCreated.id)}
                className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-90"
                title="Copy Link"
              >
                {copiedId === newlyCreated.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                id="test-new-link-btn"
                onClick={() => onOpenTestBypass(newlyCreated)}
                className="px-2 py-1 text-[11px] font-bold rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-90 flex items-center gap-1"
                title="Test 3-Step Countdown Ads"
              >
                <Sparkles className="w-3 h-3" />
                <span>Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3-Step Interstitial Preview Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-Page Ad Countdown Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Users pass Step 1 (10s) → Step 2 (8s + captcha) → Step 3 (6s) with full adslots.
          </p>
        </div>
        <button
          id="btn-open-preview-flow"
          onClick={() => onOpenTestBypass(links[0])}
          className="whitespace-nowrap px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
        >
          Try Demo Flow
        </button>
      </div>

      {/* Live Earnings Calculator Widget */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Earnings Calculator</span>
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {calculatorViews.toLocaleString()} Views = {adSettings.currency}{calculatedEarnings.toFixed(2)}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2.5">
          Estimate your earnings at currently active CPM rate of {adSettings.currency}{adSettings.cpmRate} per 1,000 views.
        </p>
        <input
          id="calculator-slider"
          type="range"
          min="500"
          max="50000"
          step="500"
          value={calculatorViews}
          onChange={(e) => setCalculatorViews(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>500 views ({adSettings.currency}{(500/1000 * adSettings.cpmRate).toFixed(0)})</span>
          <span>10k views ({adSettings.currency}{(10000/1000 * adSettings.cpmRate).toFixed(0)})</span>
          <span>50k views ({adSettings.currency}{(50000/1000 * adSettings.cpmRate).toFixed(0)})</span>
        </div>
      </div>

      {/* Recent Links Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Recent Short Links ({links.length})</span>
          </h3>
          <button 
            id="view-all-links-btn"
            onClick={onGoToLinks}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {links.slice(0, 3).map((link) => (
            <div 
              key={link.id}
              className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-white truncate">{link.title || link.shortCode}</div>
                  <div className="text-[11px] font-mono text-indigo-400 truncate mt-0.5">
                    shortearn.in/{link.shortCode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    {adSettings.currency}{link.earnings.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Eye className="w-3 h-3" />
                    <span>{link.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                <span className="text-slate-500 text-[10px]">{link.createdAt}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    id={`copy-link-${link.id}`}
                    onClick={() => copyToClipboard(`https://shortearn.in/${link.shortCode}`, link.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium"
                  >
                    {copiedId === link.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === link.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    id={`test-flow-${link.id}`}
                    onClick={() => onOpenTestBypass(link)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Test Flow</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

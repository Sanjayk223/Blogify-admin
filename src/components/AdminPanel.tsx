import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Clock, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight,
  UserCheck,
  Link2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { AdSettings, Withdrawal, ShortLink, User } from '../types';

interface AdminPanelProps {
  adSettings: AdSettings;
  onUpdateAdSettings: (newSettings: AdSettings) => void;
  withdrawals: Withdrawal[];
  onApproveWithdrawal: (id: string, utrNumber: string) => void;
  onRejectWithdrawal: (id: string, reason: string) => void;
  links: ShortLink[];
  onDeleteLink: (id: string) => void;
  onSwitchToUser: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adSettings,
  onUpdateAdSettings,
  withdrawals,
  onApproveWithdrawal,
  onRejectWithdrawal,
  links,
  onDeleteLink,
  onSwitchToUser
}) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'withdrawals' | 'finance' | 'links'>('withdrawals');
  
  // Settings Form State
  const [settings, setSettings] = useState<AdSettings>({ ...adSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Withdrawal action state
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [customUtr, setCustomUtr] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApprove = (w: Withdrawal) => {
    const genUtr = customUtr.trim() || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    onApproveWithdrawal(w.id, genUtr);
    setSelectedWithdrawal(null);
    setCustomUtr('');
  };

  const handleReject = (w: Withdrawal) => {
    const reason = rejectReason.trim() || 'Invalid UPI ID or verification check failed';
    onRejectWithdrawal(w.id, reason);
    setSelectedWithdrawal(null);
    setRejectReason('');
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  return (
    <div className="p-4 space-y-4">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-4 rounded-2xl border border-rose-500/30 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Admin Control Panel</span>
          </div>
          <h1 className="text-base font-black text-white mt-0.5">Platform Management & Ads Engine</h1>
        </div>
        <button
          id="btn-return-user-mode"
          onClick={onSwitchToUser}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-xl transition border border-slate-700"
        >
          Exit to User
        </button>
      </div>

      {/* Admin Sub-navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          id="admin-tab-withdrawals"
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition relative whitespace-nowrap ${
            activeTab === 'withdrawals'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>UPI Payout Requests</span>
          {pendingWithdrawals.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>

        <button
          id="admin-tab-ads"
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3-Page Adslots & Timers</span>
        </button>

        <button
          id="admin-tab-finance"
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'finance'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Rates & CPM</span>
        </button>

        <button
          id="admin-tab-links"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>All Links ({links.length})</span>
        </button>
      </div>

      {/* 1. UPI WITHDRAWALS MANAGEMENT TAB */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Pending UPI Payouts ({pendingWithdrawals.length})
            </h2>
            <span className="text-[10px] text-slate-400">1-Click Approve with UTR Ref</span>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <div className="text-center py-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-white">All payouts are processed!</p>
              <p className="text-[11px] text-slate-400">No pending withdrawal requests in queue.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingWithdrawals.map((w) => (
                <div 
                  key={w.id}
                  className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{w.userName}</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.2 rounded-full font-bold">
                          Pending UPI Payout
                        </span>
                      </div>
                      <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
                        UPI ID: {w.upiId}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Holder: {w.upiName || 'N/A'} • Mobile: {w.phone || 'N/A'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-white">
                        {adSettings.currency}{w.amount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">{w.requestedAt}</div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      id={`btn-approve-${w.id}`}
                      onClick={() => handleApprove(w)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Generate UTR</span>
                    </button>
                    <button
                      id={`btn-reject-${w.id}`}
                      onClick={() => handleReject(w)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 font-semibold text-xs transition"
                    >
                      Reject Payout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past completed withdrawals archive list */}
          <div className="mt-6 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Payouts History
            </h3>
            {withdrawals.filter(w => w.status !== 'pending').slice(0, 5).map((w) => (
              <div key={w.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{w.userName} — {w.upiId}</div>
                  <div className="text-[10px] text-slate-500">UTR: {w.utrNumber || 'N/A'} • {w.processedAt || w.requestedAt}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{adSettings.currency}{w.amount.toFixed(2)}</span>
                  <span className={`text-[10px] block font-semibold ${w.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {w.status === 'approved' ? '✓ Paid' : '✗ Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ADSLOTS & 3-PAGE COUNTDOWN CONFIGURATION TAB */}
      {activeTab === 'ads' && (
        <form onSubmit={handleSaveSettings} className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3-Page Countdown Timers</span>
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Page 1 Timer (Sec)
                </label>
                <input
                  id="input-step1-timer"
                  type="number"
                  min="3"
                  max="60"
                  value={settings.step1Timer}
                  onChange={(e) => setSettings({ ...settings, step1Timer: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Page 2 Timer (Sec)
                </label>
                <input
                  id="input-step2-timer"
                  type="number"
                  min="3"
                  max="60"
                  value={settings.step2Timer}
                  onChange={(e) => setSettings({ ...settings, step2Timer: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Page 3 Timer (Sec)
                </label>
                <input
                  id="input-step3-timer"
                  type="number"
                  min="3"
                  max="60"
                  value={settings.step3Timer}
                  onChange={(e) => setSettings({ ...settings, step3Timer: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white text-center font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300">Enable Popunder Ad</span>
                <input
                  id="toggle-popunder"
                  type="checkbox"
                  checked={settings.enablePopunder}
                  onChange={(e) => setSettings({ ...settings, enablePopunder: e.target.checked })}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300">Anti-Bot Captcha</span>
                <input
                  id="toggle-captcha"
                  type="checkbox"
                  checked={settings.enableCaptcha}
                  onChange={(e) => setSettings({ ...settings, enableCaptcha: e.target.checked })}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Adslot HTML / Tag code blocks */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Adslots HTML & Script Codes</span>
            </h2>

            {/* Slot 1 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                AdSlot 1 (Page 1 Top Banner 728x90 / Responsive)
              </label>
              <textarea
                id="textarea-step1-top-ad"
                rows={3}
                value={settings.step1TopAd}
                onChange={(e) => setSettings({ ...settings, step1TopAd: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Slot 2 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                AdSlot 2 (Page 1 Bottom Native / In-Feed)
              </label>
              <textarea
                id="textarea-step1-bottom-ad"
                rows={3}
                value={settings.step1BottomAd}
                onChange={(e) => setSettings({ ...settings, step1BottomAd: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-amber-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Slot 3 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                AdSlot 3 (Page 2 Interstitial 300x250)
              </label>
              <textarea
                id="textarea-step2-mid-ad"
                rows={3}
                value={settings.step2MidAd}
                onChange={(e) => setSettings({ ...settings, step2MidAd: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-emerald-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Slot 4 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                AdSlot 4 (Page 3 Final Download Top Banner)
              </label>
              <textarea
                id="textarea-step3-top-ad"
                rows={3}
                value={settings.step3TopAd}
                onChange={(e) => setSettings({ ...settings, step3TopAd: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-purple-300 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AdSlots & Timers saved successfully!</span>
            </div>
          )}

          <button
            id="btn-save-ad-settings"
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Adslots & Timers Configuration</span>
          </button>
        </form>
      )}

      {/* 3. FINANCE & CPM RATES TAB */}
      {activeTab === 'finance' && (
        <form onSubmit={handleSaveSettings} className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Platform CPM Rate & Thresholds</span>
            </h2>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Publisher CPM Rate (Per 1,000 Verified Views) in {settings.currency}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">{settings.currency}</span>
                <input
                  id="input-cpm-rate"
                  type="number"
                  min="50"
                  max="5000"
                  value={settings.cpmRate}
                  onChange={(e) => setSettings({ ...settings, cpmRate: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white font-bold"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Each verified 3-step visitor completion awards the link owner: {settings.currency}{(settings.cpmRate / 1000).toFixed(3)}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Minimum Withdrawal Threshold ({settings.currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">{settings.currency}</span>
                <input
                  id="input-min-withdrawal"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white font-bold"
                />
              </div>
            </div>
          </div>

          <button
            id="btn-save-finance-settings"
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <Save className="w-4 h-4" />
            <span>Update CPM & Minimum Payout</span>
          </button>
        </form>
      )}

      {/* 4. ALL PLATFORM LINKS OVERVIEW */}
      {activeTab === 'links' && (
        <div className="space-y-2.5 animate-in fade-in">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            All Platform Short Links ({links.length})
          </h2>

          <div className="space-y-2">
            {links.map((link) => (
              <div key={link.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="truncate flex-1 pr-2">
                  <div className="font-bold text-white truncate">{link.title || link.shortCode}</div>
                  <div className="text-[10px] font-mono text-indigo-400">/{link.shortCode} → {link.originalUrl}</div>
                  <div className="text-[10px] text-slate-500">Views: {link.views} • Earned: {adSettings.currency}{link.earnings.toFixed(2)}</div>
                </div>
                <button
                  id={`admin-delete-link-${link.id}`}
                  onClick={() => {
                    if (confirm(`Remove link /${link.shortCode}?`)) {
                      onDeleteLink(link.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

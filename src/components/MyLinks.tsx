import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Search, 
  QrCode, 
  Trash2, 
  Eye, 
  Plus, 
  X,
  Share2
} from 'lucide-react';
import { ShortLink, AdSettings } from '../types';

interface MyLinksProps {
  links: ShortLink[];
  adSettings: AdSettings;
  onShorten: (url: string, alias?: string, title?: string) => ShortLink | null;
  onDeleteLink: (id: string) => void;
  onOpenTestBypass: (link: ShortLink) => void;
}

export const MyLinks: React.FC<MyLinksProps> = ({
  links,
  adSettings,
  onShorten,
  onDeleteLink,
  onOpenTestBypass
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<ShortLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredLinks = links.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newUrl.trim()) {
      setErrorMsg('Please enter a destination URL');
      return;
    }
    let formatted = newUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) formatted = 'https://' + formatted;

    const res = onShorten(formatted, newAlias.trim() || undefined, newTitle.trim() || undefined);
    if (res) {
      setNewUrl('');
      setNewAlias('');
      setNewTitle('');
      setIsCreating(false);
    } else {
      setErrorMsg('Custom alias is already in use. Pick another one.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">Manage Short Links</h1>
          <p className="text-[11px] text-slate-400">Total {links.length} active monetized links</p>
        </div>
        <button
          id="btn-open-create-link"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-600/25 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Link</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          id="search-links-input"
          type="text"
          placeholder="Search by title, short code, or URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Create Link Modal / Drawer */}
      {isCreating && (
        <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white">Create New Monetized Link</h2>
            <button 
              id="close-create-modal"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-2.5">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Destination URL *</label>
              <input
                id="modal-url-input"
                type="text"
                placeholder="https://example.com/target-page"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Link Title (Optional)</label>
                <input
                  id="modal-title-input"
                  type="text"
                  placeholder="e.g. My Telegram Channel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Custom Alias (Optional)</label>
                <input
                  id="modal-alias-input"
                  type="text"
                  placeholder="e.g. viral-pdf"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="modal-submit-btn"
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                Create & Monetize
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-2.5">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">No short links match your search.</p>
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div 
              key={link.id}
              className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 shadow space-y-2.5 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-white truncate">{link.title || link.shortCode}</div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono mt-0.5">
                    <span>https://shortearn.in/{link.shortCode}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span className="truncate">{link.originalUrl}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    {adSettings.currency}{link.earnings.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>{link.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="text-[10px] text-slate-500">
                  {link.createdAt}
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Copy Button */}
                  <button
                    id={`links-copy-${link.id}`}
                    onClick={() => copyToClipboard(`https://shortearn.in/${link.shortCode}`, link.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition active:scale-95"
                  >
                    {copiedId === link.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === link.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* QR Code Button */}
                  <button
                    id={`links-qr-${link.id}`}
                    onClick={() => setSelectedQr(link)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                    title="Show QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>

                  {/* Test 3-Step Ads Flow */}
                  <button
                    id={`links-test-${link.id}`}
                    onClick={() => onOpenTestBypass(link)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition active:scale-95"
                    title="Experience 3-step ad countdown"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Test Flow</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    id={`links-delete-${link.id}`}
                    onClick={() => {
                      if (confirm('Delete this short link? Traffic will no longer redirect.')) {
                        onDeleteLink(link.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Scan QR to Open Link</span>
              <button 
                id="close-qr-modal"
                onClick={() => setSelectedQr(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-inner">
              {/* Simulated crisp QR code visual with SVG */}
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* Corner squares */}
                <rect x="10" y="10" width="24" height="24" stroke="black" strokeWidth="4" fill="none" />
                <rect x="16" y="16" width="12" height="12" fill="black" />
                <rect x="66" y="10" width="24" height="24" stroke="black" strokeWidth="4" fill="none" />
                <rect x="72" y="16" width="12" height="12" fill="black" />
                <rect x="10" y="66" width="24" height="24" stroke="black" strokeWidth="4" fill="none" />
                <rect x="16" y="72" width="12" height="12" fill="black" />
                {/* Random QR pixels pattern */}
                <rect x="42" y="12" width="6" height="6" fill="black" />
                <rect x="52" y="12" width="6" height="6" fill="black" />
                <rect x="42" y="24" width="6" height="6" fill="black" />
                <rect x="52" y="30" width="6" height="6" fill="black" />
                <rect x="12" y="44" width="6" height="6" fill="black" />
                <rect x="24" y="44" width="6" height="6" fill="black" />
                <rect x="36" y="44" width="6" height="6" fill="black" />
                <rect x="48" y="44" width="6" height="6" fill="black" />
                <rect x="60" y="44" width="6" height="6" fill="black" />
                <rect x="72" y="44" width="6" height="6" fill="black" />
                <rect x="84" y="44" width="6" height="6" fill="black" />
                <rect x="42" y="60" width="6" height="6" fill="black" />
                <rect x="54" y="66" width="6" height="6" fill="black" />
                <rect x="42" y="78" width="6" height="6" fill="black" />
                <rect x="66" y="78" width="6" height="6" fill="black" />
                <rect x="78" y="72" width="6" height="6" fill="black" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-mono text-indigo-400 truncate">
                shortearn.in/{selectedQr.shortCode}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Share this QR on WhatsApp, Posters, or YouTube community posts!
              </p>
            </div>

            <button
              id="copy-from-qr-modal"
              onClick={() => {
                copyToClipboard(`https://shortearn.in/${selectedQr.shortCode}`, 'qr');
                setSelectedQr(null);
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow"
            >
              Copy Link & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Save, 
  ShieldCheck, 
  AlertCircle,
  IndianRupee,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { User, Withdrawal, AdSettings } from '../types';

interface WalletViewProps {
  user: User;
  withdrawals: Withdrawal[];
  adSettings: AdSettings;
  onUpdateUpi: (upiId: string, upiName: string, phone: string) => void;
  onRequestWithdrawal: (amount: number) => { success: boolean; message: string };
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  withdrawals,
  adSettings,
  onUpdateUpi,
  onRequestWithdrawal
}) => {
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [upiId, setUpiId] = useState(user.upiId);
  const [upiName, setUpiName] = useState(user.upiName);
  const [phone, setPhone] = useState(user.phone);

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Calculate pending amount
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. mobile@oksbi, user@paytm)');
      return;
    }
    onUpdateUpi(upiId.trim(), upiName.trim(), phone.trim());
    setIsEditingUpi(false);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    if (!user.upiId) {
      setWithdrawError('Please save your UPI ID settings first before withdrawing.');
      return;
    }

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawError('Please enter a valid withdrawal amount.');
      return;
    }

    if (amt < adSettings.minWithdrawal) {
      setWithdrawError(`Minimum withdrawal amount is ${adSettings.currency}${adSettings.minWithdrawal}`);
      return;
    }

    if (amt > user.balance) {
      setWithdrawError(`Insufficient balance. You have ${adSettings.currency}${user.balance.toFixed(2)} available.`);
      return;
    }

    setIsSubmittingWithdraw(true);
    const result = onRequestWithdrawal(amt);
    setIsSubmittingWithdraw(false);

    if (result.success) {
      setWithdrawSuccess(result.message);
      setWithdrawAmount('');
    } else {
      setWithdrawError(result.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Wallet Balance Hero Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 p-5 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">UPI Earnings Wallet</span>
              <div className="text-[10px] text-slate-400">100% Direct Bank UPI Payouts</div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
            Min: {adSettings.currency}{adSettings.minWithdrawal}
          </span>
        </div>

        <div className="mt-4">
          <div className="text-[11px] text-slate-400 font-medium">Available Balance</div>
          <div className="text-3xl font-black text-white mt-0.5 tracking-tight flex items-baseline gap-1">
            <span>{adSettings.currency}</span>
            <span>{user.balance.toFixed(2)}</span>
          </div>
        </div>

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/40 text-center text-xs">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">Pending Payout</span>
            <span className="text-xs font-bold text-amber-400 mt-0.5 block">
              {adSettings.currency}{pendingAmount.toFixed(2)}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">Total Paid</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
              {adSettings.currency}{user.totalWithdrawn.toFixed(2)}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">Lifetime Earned</span>
            <span className="text-xs font-bold text-sky-400 mt-0.5 block">
              {adSettings.currency}{user.totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Request Form Card */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          <span>Request UPI Withdrawal</span>
        </h2>

        <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Withdrawal Amount ({adSettings.currency})
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold text-sm">
                {adSettings.currency}
              </span>
              <input
                id="input-withdraw-amount"
                type="number"
                step="any"
                placeholder={`Min ${adSettings.minWithdrawal}`}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-20 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                id="btn-withdraw-all"
                onClick={() => setWithdrawAmount(user.balance.toString())}
                className="absolute right-2 px-2.5 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition"
              >
                Max All
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Pauout UPI ID:</span>
                <span className="font-mono text-emerald-400 font-medium truncate block">
                  {user.upiId || 'No UPI ID Added'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Name: {user.upiName || 'N/A'}</span>
          </div>

          {withdrawError && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          {withdrawSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{withdrawSuccess}</span>
            </div>
          )}

          <button
            id="btn-submit-withdrawal"
            type="submit"
            disabled={isSubmittingWithdraw || user.balance < adSettings.minWithdrawal}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Submit Withdrawal Request</span>
          </button>
        </form>
      </div>

      {/* UPI Transaction Settings Card */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>UPI Payout Settings</span>
          </h2>
          <button
            id="btn-toggle-upi-edit"
            onClick={() => setIsEditingUpi(!isEditingUpi)}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingUpi ? 'Cancel' : 'Edit UPI'}</span>
          </button>
        </div>

        {isEditingUpi ? (
          <form onSubmit={handleSaveUpi} className="space-y-2.5 animate-in fade-in">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                Virtual Payment Address (UPI ID) *
              </label>
              <input
                id="input-upi-id"
                type="text"
                placeholder="e.g. 9876543210@paytm or name@oksbi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Beneficiary Name
                </label>
                <input
                  id="input-upi-name"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Registered Mobile No
                </label>
                <input
                  id="input-upi-phone"
                  type="text"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              id="btn-save-upi"
              type="submit"
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save UPI Details</span>
            </button>
          </form>
        ) : (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Active UPI ID:</span>
              <span className="font-mono text-white font-bold">{user.upiId || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Account Holder:</span>
              <span className="text-white font-medium">{user.upiName || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Mobile:</span>
              <span className="text-white font-medium">{user.phone || 'Not set'}</span>
            </div>
          </div>
        )}
      </div>

      {/* UPI Withdrawals & Transaction History */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Transaction History ({withdrawals.length})
        </h3>

        <div className="space-y-2">
          {withdrawals.length === 0 ? (
            <div className="text-center py-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No transactions yet. Start sharing links to earn!
            </div>
          ) : (
            withdrawals.map((w) => (
              <div 
                key={w.id}
                className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 shadow space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>UPI Transfer</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        w.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : w.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {w.status === 'approved' ? 'Paid / Success' : w.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      To: {w.upiId}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      {adSettings.currency}{w.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">{w.requestedAt}</div>
                  </div>
                </div>

                {w.utrNumber && (
                  <div className="text-[10px] bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 p-2 rounded-lg flex items-center justify-between">
                    <span>Bank Ref / UTR: <strong className="font-mono">{w.utrNumber}</strong></span>
                    <span>✓ Transferred</span>
                  </div>
                )}

                {w.note && !w.utrNumber && (
                  <div className="text-[10px] text-slate-400 italic bg-slate-950 p-2 rounded-lg">
                    Note: {w.note}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

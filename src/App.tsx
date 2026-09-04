import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Dashboard } from './components/Dashboard';
import { MyLinks } from './components/MyLinks';
import { WalletView } from './components/WalletView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminPanel } from './components/AdminPanel';
import { ThreeStepVisitor } from './components/ThreeStepVisitor';
import { PhpSourceExport } from './components/PhpSourceExport';
import { 
  User, 
  ShortLink, 
  Withdrawal, 
  AdSettings, 
  ViewLog, 
  UserRole 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_AD_SETTINGS, 
  INITIAL_LINKS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_VIEW_LOGS 
} from './data/initialData';

export default function App() {
  // Persistence with LocalStorage
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('se_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [role, setRole] = useState<UserRole>('user');

  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('se_ad_settings');
    return saved ? JSON.parse(saved) : INITIAL_AD_SETTINGS;
  });

  const [links, setLinks] = useState<ShortLink[]>(() => {
    const saved = localStorage.getItem('se_links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem('se_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [viewLogs, setViewLogs] = useState<ViewLog[]>(() => {
    const saved = localStorage.getItem('se_view_logs');
    return saved ? JSON.parse(saved) : INITIAL_VIEW_LOGS;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMockup, setIsMobileMockup] = useState<boolean>(true);

  // Active 3-step visitor test modal
  const [activeVisitorLink, setActiveVisitorLink] = useState<ShortLink | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('se_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('se_ad_settings', JSON.stringify(adSettings));
  }, [adSettings]);

  useEffect(() => {
    localStorage.setItem('se_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('se_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('se_view_logs', JSON.stringify(viewLogs));
  }, [viewLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Shorten URL Handler
  const handleShorten = (url: string, alias?: string, title?: string): ShortLink | null => {
    const code = alias || Math.random().toString(36).substring(2, 8);
    
    // Check if alias already exists
    if (links.some(l => l.shortCode.toLowerCase() === code.toLowerCase())) {
      return null;
    }

    // Default title from domain
    let autoTitle = title;
    if (!autoTitle) {
      try {
        const parsed = new URL(url);
        autoTitle = parsed.hostname.replace('www.', '') + ' Direct Download';
      } catch {
        autoTitle = 'Monetized Download Link';
      }
    }

    const newLink: ShortLink = {
      id: 'link_' + Date.now(),
      userId: user.id,
      originalUrl: url,
      shortCode: code,
      title: autoTitle,
      views: 0,
      earnings: 0,
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    };

    setLinks(prev => [newLink, ...prev]);
    showToast(`✓ Short link created: shortearn.in/${code}`);
    return newLink;
  };

  // 2. Delete Short Link Handler
  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    showToast('Short link removed.');
  };

  // 3. Update User UPI Profile
  const handleUpdateUpi = (upiId: string, upiName: string, phone: string) => {
    setUser(prev => ({
      ...prev,
      upiId,
      upiName,
      phone
    }));
    showToast('✓ UPI settings saved successfully!');
  };

  // 4. Request UPI Withdrawal
  const handleRequestWithdrawal = (amount: number): { success: boolean; message: string } => {
    if (amount > user.balance) {
      return { success: false, message: 'Insufficient balance for withdrawal.' };
    }

    if (amount < adSettings.minWithdrawal) {
      return { 
        success: false, 
        message: `Minimum withdrawal is ${adSettings.currency}${adSettings.minWithdrawal}` 
      };
    }

    const newWithdrawal: Withdrawal = {
      id: 'wdr_' + Date.now(),
      userId: user.id,
      userName: user.name,
      upiId: user.upiId,
      upiName: user.upiName,
      phone: user.phone,
      amount: amount,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Deduct balance from user
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount
    }));

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    showToast(`✓ Withdrawal request of ${adSettings.currency}${amount.toFixed(2)} submitted to Admin!`);
    return { 
      success: true, 
      message: `Request for ${adSettings.currency}${amount.toFixed(2)} submitted! Admin will process via UPI.` 
    };
  };

  // 5. Admin Approves UPI Withdrawal
  const handleApproveWithdrawal = (id: string, utrNumber: string) => {
    const target = withdrawals.find(w => w.id === id);
    if (!target) return;

    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: 'approved',
          utrNumber,
          processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return w;
    }));

    // Update user's totalWithdrawn statistic
    setUser(prev => ({
      ...prev,
      totalWithdrawn: prev.totalWithdrawn + target.amount
    }));

    showToast(`✓ Payout of ${adSettings.currency}${target.amount} approved! Bank UTR: ${utrNumber}`);
  };

  // 6. Admin Rejects UPI Withdrawal (Refunds balance)
  const handleRejectWithdrawal = (id: string, reason: string) => {
    const target = withdrawals.find(w => w.id === id);
    if (!target) return;

    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: 'rejected',
          note: reason,
          processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return w;
    }));

    // Refund balance back to user
    setUser(prev => ({
      ...prev,
      balance: prev.balance + target.amount
    }));

    showToast(`Withdrawal rejected. ${adSettings.currency}${target.amount} refunded back to wallet.`);
  };

  // 7. Admin Updates Ad Settings & CPM
  const handleUpdateAdSettings = (newSettings: AdSettings) => {
    setAdSettings(newSettings);
    showToast('✓ Adslots, CPM rate & timers updated successfully!');
  };

  // 8. 3-Step Visitor Completion (View credit awarded!)
  const handleCompleteVisitorView = (linkId: string, earnedAmount: number) => {
    // 1. Credit publisher wallet
    setUser(prev => ({
      ...prev,
      balance: prev.balance + earnedAmount,
      totalEarnings: prev.totalEarnings + earnedAmount
    }));

    // 2. Increment link clicks & earnings
    setLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        return {
          ...l,
          views: l.views + 1,
          earnings: l.earnings + earnedAmount
        };
      }
      return l;
    }));

    // 3. Add to live view logs
    const newLog: ViewLog = {
      id: 'vl_' + Date.now(),
      linkId,
      shortCode: links.find(l => l.id === linkId)?.shortCode || 'link',
      ip: `103.${Math.floor(100 + Math.random() * 800)}.*.* (Live Verified)`,
      referrer: 'Mobile Gateway',
      device: 'Mobile (Android)',
      earnedAmount,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verified: true
    };

    setViewLogs(prev => [newLog, ...prev]);
    showToast(`🎉 Verified View Complete! +${adSettings.currency}${earnedAmount.toFixed(2)} added to UPI Wallet!`);
  };

  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <MobileFrame
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      role={role}
      setRole={setRole}
      isMobileMockup={isMobileMockup}
      setIsMobileMockup={setIsMobileMockup}
      pendingWithdrawalsCount={pendingWithdrawalsCount}
      onOpenTestBypass={() => setActiveVisitorLink(links[0] || null)}
    >
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Router */}
      {currentTab === 'dashboard' && (
        <Dashboard
          user={user}
          links={links}
          adSettings={adSettings}
          onShorten={handleShorten}
          onOpenTestBypass={(link) => setActiveVisitorLink(link || links[0])}
          onGoToWallet={() => setCurrentTab('wallet')}
          onGoToLinks={() => setCurrentTab('links')}
        />
      )}

      {currentTab === 'links' && (
        <MyLinks
          links={links}
          adSettings={adSettings}
          onShorten={handleShorten}
          onDeleteLink={handleDeleteLink}
          onOpenTestBypass={(link) => setActiveVisitorLink(link)}
        />
      )}

      {currentTab === 'wallet' && (
        <WalletView
          user={user}
          withdrawals={withdrawals}
          adSettings={adSettings}
          onUpdateUpi={handleUpdateUpi}
          onRequestWithdrawal={handleRequestWithdrawal}
        />
      )}

      {currentTab === 'analytics' && (
        <AnalyticsView
          links={links}
          adSettings={adSettings}
          viewLogs={viewLogs}
        />
      )}

      {currentTab === 'admin' && (
        <AdminPanel
          adSettings={adSettings}
          onUpdateAdSettings={handleUpdateAdSettings}
          withdrawals={withdrawals}
          onApproveWithdrawal={handleApproveWithdrawal}
          onRejectWithdrawal={handleRejectWithdrawal}
          links={links}
          onDeleteLink={handleDeleteLink}
          onSwitchToUser={() => {
            setRole('user');
            setCurrentTab('dashboard');
          }}
        />
      )}

      {currentTab === 'php' && (
        <PhpSourceExport />
      )}

      {/* 3-Step Countdown Visitor Gateway Modal */}
      {activeVisitorLink && (
        <ThreeStepVisitor
          link={activeVisitorLink}
          adSettings={adSettings}
          onCompleteView={handleCompleteVisitorView}
          onClose={() => setActiveVisitorLink(null)}
        />
      )}
    </MobileFrame>
  );
}

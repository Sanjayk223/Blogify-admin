import React from 'react';
import { 
  Home, 
  Link2, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  FileCode, 
  Smartphone, 
  Maximize2, 
  Sparkles,
  UserCheck,
  Shield
} from 'lucide-react';
import { UserRole } from '../types';

interface MobileFrameProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isMobileMockup: boolean;
  setIsMobileMockup: (val: boolean) => void;
  pendingWithdrawalsCount: number;
  children: React.ReactNode;
  onOpenTestBypass: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentTab,
  setCurrentTab,
  role,
  setRole,
  isMobileMockup,
  setIsMobileMockup,
  pendingWithdrawalsCount,
  children,
  onOpenTestBypass
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Controls Bar for testing & responsive preview */}
      <header className="w-full max-w-6xl px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-sky-400 flex items-center justify-center font-black text-white shadow-md shadow-indigo-500/20">
            SE
          </div>
          <div>
            <span className="font-bold text-white tracking-wide text-sm flex items-center gap-1.5">
              ShortEarn Mobile
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-medium">
                Live Earning
              </span>
            </span>
          </div>
        </div>

        {/* Global Controls: Role Switcher, 3-Step Live Test, Mockup Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="test-ad-flow-btn"
            onClick={onOpenTestBypass}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
            title="Experience the 3-page ad countdown bypass flow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test 3-Step Ad Flow</span>
            <span className="sm:hidden">Test Ads</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-full p-0.5">
            <button
              id="role-user-btn"
              onClick={() => {
                setRole('user');
                if (currentTab === 'admin') setCurrentTab('dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                role === 'user' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>User</span>
            </button>
            <button
              id="role-admin-btn"
              onClick={() => {
                setRole('admin');
                setCurrentTab('admin');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                role === 'admin' 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
              {pendingWithdrawalsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {pendingWithdrawalsCount}
                </span>
              )}
            </button>
          </div>

          {/* Viewport Toggle: Mobile App Frame vs Expanded View */}
          <button
            id="toggle-mockup-btn"
            onClick={() => setIsMobileMockup(!isMobileMockup)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition hidden md:flex items-center"
            title={isMobileMockup ? 'Switch to Full Screen layout' : 'Switch to Mobile App frame'}
          >
            {isMobileMockup ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center items-start py-2 sm:py-6 px-0 sm:px-4">
        <div 
          className={`w-full transition-all duration-300 ${
            isMobileMockup 
              ? 'max-w-[430px] min-h-[844px] bg-slate-950 sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 shadow-2xl overflow-hidden flex flex-col relative sm:ring-1 sm:ring-slate-700/50' 
              : 'max-w-4xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative'
          }`}
        >
          {/* Mobile Status Bar Header (Only when in mockup mode) */}
          {isMobileMockup && (
            <div className="w-full px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold text-slate-400 border-b border-slate-900 select-none bg-slate-950">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Dynamic Screen Content */}
          <div className="flex-1 overflow-y-auto pb-24 text-slate-200">
            {children}
          </div>

          {/* Bottom App Navigation Bar */}
          <nav className="absolute bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
            <div className="flex items-center justify-around max-w-md mx-auto">
              <button
                id="nav-tab-dashboard"
                onClick={() => setCurrentTab('dashboard')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  currentTab === 'dashboard'
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition ${currentTab === 'dashboard' ? 'bg-indigo-500/20' : ''}`}>
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">Home</span>
              </button>

              <button
                id="nav-tab-links"
                onClick={() => setCurrentTab('links')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  currentTab === 'links'
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition ${currentTab === 'links' ? 'bg-indigo-500/20' : ''}`}>
                  <Link2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">Links</span>
              </button>

              <button
                id="nav-tab-wallet"
                onClick={() => setCurrentTab('wallet')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                  currentTab === 'wallet'
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition ${currentTab === 'wallet' ? 'bg-emerald-500/20' : ''}`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">UPI Wallet</span>
              </button>

              <button
                id="nav-tab-analytics"
                onClick={() => setCurrentTab('analytics')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  currentTab === 'analytics'
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition ${currentTab === 'analytics' ? 'bg-indigo-500/20' : ''}`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">Stats</span>
              </button>

              {role === 'admin' ? (
                <button
                  id="nav-tab-admin"
                  onClick={() => setCurrentTab('admin')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                    currentTab === 'admin'
                      ? 'text-rose-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition ${currentTab === 'admin' ? 'bg-rose-500/20' : ''}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5">Admin</span>
                  {pendingWithdrawalsCount > 0 && (
                    <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              ) : (
                <button
                  id="nav-tab-php-export"
                  onClick={() => setCurrentTab('php')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                    currentTab === 'php'
                      ? 'text-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition ${currentTab === 'php' ? 'bg-sky-500/20' : ''}`}>
                    <FileCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5">PHP Files</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
};

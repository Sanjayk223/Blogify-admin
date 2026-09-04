import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Eye, 
  Calendar,
  Share2
} from 'lucide-react';
import { ShortLink, AdSettings, ViewLog } from '../types';

interface AnalyticsViewProps {
  links: ShortLink[];
  adSettings: AdSettings;
  viewLogs: ViewLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  links,
  adSettings,
  viewLogs
}) => {
  const totalViews = links.reduce((s, l) => s + l.views, 0);
  const totalEarnings = links.reduce((s, l) => s + l.earnings, 0);

  // Mock 7-day data for charts
  const weeklyData = [
    { day: 'Mon', views: 240, earnings: 108.0 },
    { day: 'Tue', views: 380, earnings: 171.0 },
    { day: 'Wed', views: 510, earnings: 229.5 },
    { day: 'Thu', views: 420, earnings: 189.0 },
    { day: 'Fri', views: 680, earnings: 306.0 },
    { day: 'Sat', views: 890, earnings: 400.5 },
    { day: 'Sun', views: 720, earnings: 324.0 },
  ];

  const maxViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">Traffic & Earnings Analytics</h1>
          <p className="text-[11px] text-slate-400">Real-time breakdown of validated visitor clicks</p>
        </div>
        <div className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Tracking</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Clicks</span>
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white mt-1">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+14.2% this week</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Earned</span>
            <span className="text-xs font-bold text-emerald-400">{adSettings.currency}</span>
          </div>
          <div className="text-xl font-black text-white mt-1">
            {adSettings.currency}{totalEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Avg: {adSettings.currency}{(adSettings.cpmRate / 1000).toFixed(2)} / view
          </div>
        </div>
      </div>

      {/* 7-Day Performance Bar Chart */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Daily Traffic Performance</span>
          </div>
          <span className="text-[10px] text-slate-400">Past 7 Days</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-6 pb-1 px-1">
          {weeklyData.map((item, idx) => {
            const heightPercent = Math.round((item.views / maxViews) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-400 transition opacity-0 group-hover:opacity-100">
                  {item.views}
                </div>
                <div className="w-full bg-slate-800/80 rounded-t-lg h-24 flex items-end overflow-hidden">
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-600 group-hover:to-teal-300"
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Sources & Devices Breakdown */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Devices</span>
          </span>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>Android Mobile</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>iOS iPhone</span>
                <span className="font-bold">14%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>Desktop PC</span>
                <span className="font-bold">8%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Referrers</span>
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 text-[11px]">Telegram</span>
              <span className="font-bold text-white">42%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 text-[11px]">WhatsApp</span>
              <span className="font-bold text-white">31%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 text-[11px]">YouTube</span>
              <span className="font-bold text-white">18%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 text-[11px]">Direct</span>
              <span className="font-bold text-white">9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Verified Click Logs */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Live Click Logs (Recent)</span>
          <span className="text-[10px] text-emerald-400 font-normal">Auto-credited</span>
        </h3>

        <div className="space-y-2">
          {viewLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-indigo-300 font-semibold">{log.shortCode}</span>
                  <span className="text-[10px] text-slate-400 font-normal">• {log.referrer}</span>
                </div>
                <div className="text-[10px] text-slate-500">{log.ip} • {log.device}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">+{adSettings.currency}{log.earnedAmount.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500">{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

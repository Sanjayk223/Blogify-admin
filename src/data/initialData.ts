import { User, ShortLink, Withdrawal, AdSettings, ViewLog } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_101',
  name: 'Rahul Sharma',
  email: 'rahul.earner@gmail.com',
  role: 'user',
  upiId: 'rahulsharma@oksbi',
  upiName: 'Rahul Sharma',
  phone: '9876543210',
  balance: 342.50,
  totalEarnings: 1285.00,
  totalWithdrawn: 942.50,
  createdAt: '2026-08-15'
};

export const INITIAL_AD_SETTINGS: AdSettings = {
  cpmRate: 450, // ₹450 per 1000 views = ₹0.45 per view
  minWithdrawal: 50, // Minimum ₹50
  currency: '₹',
  step1Timer: 10,
  step2Timer: 8,
  step3Timer: 6,
  enablePopunder: true,
  enableCaptcha: true,
  step1TopAd: `<div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
    <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">Sponsored Ad (728x90)</span>
    <p class="text-sm font-bold text-slate-800 mt-1">⚡ Earn Daily ₹2000 With ShortEarn Pro</p>
    <p class="text-xs text-slate-500">Fast UPI daily payouts • 24/7 Support • Register Free Now</p>
    <a href="#" class="mt-2 inline-block px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-indigo-700">Check Offer →</a>
  </div>`,
  step1BottomAd: `<div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
    <span class="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Native Ad Banner</span>
    <p class="text-sm font-bold text-amber-900 mt-1">🎮 Play Fantasy Cricket & Win Real Cash!</p>
    <p class="text-xs text-amber-700">Instant ₹100 Welcome Bonus upon signup.</p>
  </div>`,
  step2MidAd: `<div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
    <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Interstitial Ad Slot (300x250)</span>
    <p class="text-base font-bold text-emerald-950 mt-1">📱 Best Cloud Hosting for PHP & Apps</p>
    <p class="text-xs text-emerald-700 mt-1">99.9% Uptime with Free SSL & Daily Backups.</p>
    <button class="mt-2 px-4 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg shadow">Claim 70% Discount</button>
  </div>`,
  step3TopAd: `<div class="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
    <span class="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Sponsored Ad Slot</span>
    <p class="text-sm font-bold text-purple-950 mt-1">🚀 Fast 5G Unlimited Data Recharge Plan</p>
    <p class="text-xs text-purple-600">Exclusive online discounts on mobile prepaid packs.</p>
  </div>`,
  step3FinalAd: `<div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
    <span class="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Final Link Ad</span>
    <p class="text-sm font-bold text-rose-950 mt-1">🎁 Scan to Download Latest Android APK</p>
    <p class="text-xs text-rose-600">Safe, verified, and malware-free apps repository.</p>
  </div>`
};

export const INITIAL_LINKS: ShortLink[] = [
  {
    id: 'link_1',
    userId: 'usr_101',
    originalUrl: 'https://drive.google.com/file/d/sample-movie-or-notes/view',
    shortCode: 'movie2026',
    title: 'Study Materials & High Speed Drive Download',
    views: 1420,
    earnings: 639.00,
    createdAt: '2026-08-28',
    active: true
  },
  {
    id: 'link_2',
    userId: 'usr_101',
    originalUrl: 'https://telegram.me/joinchat/official_tech_updates',
    shortCode: 'teletech',
    title: 'Telegram VIP Tech Deals Channel',
    views: 890,
    earnings: 400.50,
    createdAt: '2026-09-01',
    active: true
  },
  {
    id: 'link_3',
    userId: 'usr_101',
    originalUrl: 'https://youtube.com/watch?v=full_react_tutorial',
    shortCode: 'reactcode',
    title: 'Full Stack Masterclass Source Code',
    views: 546,
    earnings: 245.70,
    createdAt: '2026-09-02',
    active: true
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wdr_101',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    upiId: 'rahulsharma@oksbi',
    upiName: 'Rahul Sharma',
    phone: '9876543210',
    amount: 500.00,
    status: 'approved',
    utrNumber: 'UPI429019284712',
    note: 'Bank transfer completed via SBI UPI',
    requestedAt: '2026-08-25 14:30',
    processedAt: '2026-08-25 16:10'
  },
  {
    id: 'wdr_102',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    upiId: 'rahulsharma@oksbi',
    upiName: 'Rahul Sharma',
    phone: '9876543210',
    amount: 442.50,
    status: 'approved',
    utrNumber: 'UPI430119481239',
    note: 'Instant payout via PhonePe UPI',
    requestedAt: '2026-08-31 10:15',
    processedAt: '2026-08-31 11:00'
  },
  {
    id: 'wdr_103',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    upiId: 'rahulsharma@oksbi',
    upiName: 'Rahul Sharma',
    phone: '9876543210',
    amount: 150.00,
    status: 'pending',
    note: 'In review by admin',
    requestedAt: '2026-09-03 19:40'
  }
];

export const INITIAL_VIEW_LOGS: ViewLog[] = [
  {
    id: 'vl_1',
    linkId: 'link_1',
    shortCode: 'movie2026',
    ip: '103.212.**.** (Delhi, IN)',
    referrer: 'Telegram',
    device: 'Mobile (Android)',
    earnedAmount: 0.45,
    timestamp: '2026-09-04 09:12',
    verified: true
  },
  {
    id: 'vl_2',
    linkId: 'link_1',
    shortCode: 'movie2026',
    ip: '157.34.**.** (Mumbai, IN)',
    referrer: 'WhatsApp',
    device: 'Mobile (iOS)',
    earnedAmount: 0.45,
    timestamp: '2026-09-04 08:45',
    verified: true
  },
  {
    id: 'vl_3',
    linkId: 'link_2',
    shortCode: 'teletech',
    ip: '49.36.**.** (Bangalore, IN)',
    referrer: 'YouTube',
    device: 'Desktop (Chrome)',
    earnedAmount: 0.45,
    timestamp: '2026-09-04 07:30',
    verified: true
  },
  {
    id: 'vl_4',
    linkId: 'link_3',
    shortCode: 'reactcode',
    ip: '106.208.**.** (Kolkata, IN)',
    referrer: 'Direct',
    device: 'Mobile (Android)',
    earnedAmount: 0.45,
    timestamp: '2026-09-04 06:15',
    verified: true
  }
];

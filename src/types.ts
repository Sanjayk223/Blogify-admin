export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  upiId: string;
  upiName: string;
  phone: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  createdAt: string;
}

export interface ShortLink {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  title: string;
  views: number;
  earnings: number;
  createdAt: string;
  active: boolean;
}

export interface ViewLog {
  id: string;
  linkId: string;
  shortCode: string;
  ip: string;
  referrer: string;
  device: string;
  earnedAmount: number;
  timestamp: string;
  verified: boolean;
}

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  upiId: string;
  upiName: string;
  phone: string;
  amount: number;
  status: WithdrawalStatus;
  utrNumber?: string;
  note?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface AdSettings {
  cpmRate: number; // e.g. 450 (INR per 1000 views = ₹0.45 / view)
  minWithdrawal: number; // e.g. 50 (INR)
  currency: string; // '₹'
  step1Timer: number; // in seconds (e.g. 10)
  step2Timer: number; // in seconds (e.g. 8)
  step3Timer: number; // in seconds (e.g. 6)
  enablePopunder: boolean;
  enableCaptcha: boolean;
  // Ad banners & contents
  step1TopAd: string;
  step1BottomAd: string;
  step2MidAd: string;
  step3TopAd: string;
  step3FinalAd: string;
}

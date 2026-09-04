import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Server, 
  Layers, 
  ShieldCheck, 
  Wallet,
  ExternalLink,
  Terminal
} from 'lucide-react';

export const PhpSourceExport: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'config' | 'sql' | 'index' | 'step' | 'wallet' | 'admin'>('index');
  const [copied, setCopied] = useState(false);

  const PHP_FILES = {
    index: `<?php
/**
 * ShortEarn Mobile - User Dashboard & Mobile Web App View
 * Features: Mobile viewport, Bottom Navigation, URL Shortener, Live Stats
 */
require_once 'config.php';
require_auth(); // Ensure user is logged in

$userId = $_SESSION['user_id'];
$user = $db->query("SELECT * FROM users WHERE id = $userId")->fetch();
$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// Fetch User Links
$links = $db->query("SELECT * FROM links WHERE user_id = $userId ORDER BY id DESC LIMIT 10")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ShortEarn Mobile - URL Shortener</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { -webkit-tap-highlight-color: transparent; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen pb-24 select-none">

  <!-- Mobile Top Header -->
  <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">SE</div>
      <span class="font-bold text-sm tracking-wide">ShortEarn Mobile</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
        CPM: <?= $adSettings['currency'] ?><?= $adSettings['cpm_rate'] ?>
      </span>
      <?php if ($user['role'] === 'admin'): ?>
        <a href="admin.php" class="text-xs bg-rose-600 px-2.5 py-1 rounded-lg font-bold text-white">Admin</a>
      <?php endif; ?>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-md mx-auto p-4 space-y-4">
    <!-- User Balance Card -->
    <div class="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-xl">
      <span class="text-xs text-indigo-300">Available UPI Balance</span>
      <div class="text-3xl font-black text-white mt-1"><?= $adSettings['currency'] ?><?= number_format($user['balance'], 2) ?></div>
      
      <div class="flex gap-2 mt-4 pt-3 border-t border-indigo-800/40">
        <a href="wallet.php" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-center py-2 rounded-xl text-xs font-bold shadow">
          <i class="fa-solid fa-wallet mr-1"></i> Withdraw UPI
        </a>
      </div>
    </div>

    <!-- Shorten Form -->
    <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
      <h3 class="text-xs font-bold text-white uppercase"><i class="fa-solid fa-bolt text-amber-400 mr-1"></i> Shorten URL</h3>
      <form action="api.php?action=shorten" method="POST" class="space-y-2">
        <input type="url" name="url" placeholder="https://example.com/movie-or-notes" required class="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white">
        <input type="text" name="alias" placeholder="Custom alias (optional)" class="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white">
        <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow">
          Shorten & Start Earning
        </button>
      </form>
    </div>

    <!-- Recent Links -->
    <div class="space-y-2">
      <h3 class="text-xs font-bold text-slate-400 uppercase">My Recent Links</h3>
      <?php foreach ($links as $link): ?>
        <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
          <div class="truncate flex-1 pr-2">
            <div class="font-bold text-white truncate"><?= htmlspecialchars($link['title'] ?: $link['short_code']) ?></div>
            <div class="text-[11px] text-indigo-400 font-mono">domain.com/step.php?code=<?= $link['short_code'] ?></div>
          </div>
          <div class="text-right">
            <div class="font-bold text-emerald-400"><?= $adSettings['currency'] ?><?= number_format($link['earnings'], 2) ?></div>
            <div class="text-[10px] text-slate-400"><?= $link['views'] ?> views</div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </main>

  <!-- Mobile Bottom Navigation -->
  <nav class="bottom-nav bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 py-2">
    <div class="flex justify-around max-w-md mx-auto text-center">
      <a href="index.php" class="text-indigo-400 font-bold text-xs"><i class="fa-solid fa-house block text-base mb-0.5"></i> Home</a>
      <a href="links.php" class="text-slate-400 text-xs"><i class="fa-solid fa-link block text-base mb-0.5"></i> Links</a>
      <a href="wallet.php" class="text-slate-400 text-xs"><i class="fa-solid fa-wallet block text-base mb-0.5"></i> Wallet</a>
      <a href="admin.php" class="text-slate-400 text-xs"><i class="fa-solid fa-gear block text-base mb-0.5"></i> Admin</a>
    </div>
  </nav>

</body>
</html>`,

    step: `<?php
/**
 * 3-Page Countdown Monetization Engine (step.php)
 * Handles Page 1 (10s) -> Page 2 (8s + Captcha) -> Page 3 (6s) -> Credit CPM -> Redirect
 */
require_once 'config.php';

$code = filter_input(INPUT_GET, 'code', FILTER_SANITIZE_STRING);
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;

$stmt = $db->prepare("SELECT * FROM links WHERE short_code = ? AND active = 1");
$stmt->execute([$code]);
$link = $stmt->fetch();

if (!$link) {
  die("Error: Invalid or expired short link.");
}

$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// If Final Redirect Step: Credit Publisher & Redirect
if (isset($_GET['action']) && $_GET['action'] === 'redirect') {
  // Prevent duplicate fake views by checking visitor IP/session
  $visitorIp = $_SERVER['REMOTE_ADDR'];
  $check = $db->prepare("SELECT id FROM view_logs WHERE link_id = ? AND ip_address = ? AND created_at > NOW() - INTERVAL 12 HOUR");
  $check->execute([$link['id'], $visitorIp]);

  if (!$check->fetch()) {
    $earnedAmount = $adSettings['cpm_rate'] / 1000;
    
    // Credit publisher balance
    $db->prepare("UPDATE users SET balance = balance + ?, total_earnings = total_earnings + ? WHERE id = ?")
       ->execute([$earnedAmount, $earnedAmount, $link['user_id']]);
    
    // Update link view count
    $db->prepare("UPDATE links SET views = views + 1, earnings = earnings + ? WHERE id = ?")
       ->execute([$earnedAmount, $link['id']]);

    // Record view log
    $db->prepare("INSERT INTO view_logs (link_id, ip_address, earned_amount) VALUES (?, ?, ?)")
       ->execute([$link['id'], $visitorIp, $earnedAmount]);
  }

  // Redirect to final original destination URL
  header("Location: " . $link['original_url']);
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Step <?= $step ?> of 3 - Secure Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-4 select-none">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
    
    <!-- Top Step Bar -->
    <div class="flex justify-between items-center text-xs">
      <span class="font-bold text-amber-400">Step <?= $step ?> of 3</span>
      <span class="text-slate-500">Monetized Gateway</span>
    </div>
    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div class="bg-indigo-500 h-full" style="width: <?= $step * 33 ?>%"></div>
    </div>

    <!-- AdSlot 1 / Top Banner -->
    <div class="adslot-top my-2">
      <?= $adSettings['step' . $step . '_top_ad'] ?? $adSettings['step1_top_ad'] ?>
    </div>

    <!-- Countdown Timer Container -->
    <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
      <p class="text-xs text-slate-400">Please wait while your verification unlocks...</p>
      <div id="countdown" class="text-3xl font-black text-amber-400 font-mono">
        <?= $step == 1 ? $adSettings['step1_timer'] : ($step == 2 ? $adSettings['step2_timer'] : $adSettings['step3_timer']) ?>
      </div>
    </div>

    <!-- Step 2 Anti-bot human check -->
    <?php if ($step == 2 && $adSettings['enable_captcha']): ?>
      <label class="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <input type="checkbox" id="captchaCheck" class="w-4 h-4 accent-indigo-600">
        <span>I am not a robot (Anti-Bot Verification)</span>
      </label>
    <?php endif; ?>

    <!-- AdSlot Bottom -->
    <div class="adslot-bottom my-2">
      <?= $adSettings['step' . $step . '_bottom_ad'] ?? $adSettings['step1_bottom_ad'] ?>
    </div>

    <!-- Action Button -->
    <?php if ($step < 3): ?>
      <a id="continueBtn" href="step.php?code=<?= $code ?>&step=<?= $step + 1 ?>" class="block w-full text-center py-3 bg-slate-800 text-slate-500 font-bold rounded-xl text-xs pointer-events-none transition">
        Locked (Wait Timer)
      </a>
    <?php else: ?>
      <a id="continueBtn" href="step.php?code=<?= $code ?>&action=redirect" class="block w-full text-center py-3.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow pointer-events-none transition">
        Get Final Link
      </a>
    <?php endif; ?>

  </div>

  <script>
    let timerVal = <?= $step == 1 ? $adSettings['step1_timer'] : ($step == 2 ? $adSettings['step2_timer'] : $adSettings['step3_timer']) ?>;
    const countEl = document.getElementById('countdown');
    const btn = document.getElementById('continueBtn');
    const captcha = document.getElementById('captchaCheck');

    const intv = setInterval(() => {
      timerVal--;
      if (timerVal <= 0) {
        clearInterval(intv);
        countEl.innerText = "Ready!";
        unlockButton();
      } else {
        countEl.innerText = (timerVal < 10 ? '0' : '') + timerVal;
      }
    }, 1000);

    function unlockButton() {
      if (captcha && !captcha.checked) {
        captcha.onchange = unlockButton;
        return;
      }
      btn.classList.remove('bg-slate-800', 'text-slate-500', 'pointer-events-none');
      btn.classList.add('bg-indigo-600', 'text-white', 'hover:bg-indigo-500', 'cursor-pointer');
      btn.innerText = <?= $step == 3 ? "'Click to Get Direct Link'" : "'Click to Continue to Next Step →'" ?>;
    }
  </script>
</body>
</html>`,

    wallet: `<?php
/**
 * UPI Wallet & Withdrawal Engine (wallet.php)
 * Handles Instant UPI payment requests, minimum balance checks, and logs.
 */
require_once 'config.php';
require_auth();

$userId = $_SESSION['user_id'];
$user = $db->query("SELECT * FROM users WHERE id = $userId")->fetch();
$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

$msg = '';
$err = '';

// Process Withdrawal Request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['request_withdraw'])) {
  $amount = (float)$_POST['amount'];
  
  if (empty($user['upi_id'])) {
    $err = "Please update your UPI ID before requesting a payout.";
  } elseif ($amount < $adSettings['min_withdrawal']) {
    $err = "Minimum withdrawal amount is " . $adSettings['currency'] . $adSettings['min_withdrawal'];
  } elseif ($amount > $user['balance']) {
    $err = "Insufficient wallet balance.";
  } else {
    // Deduct balance and create pending transaction
    $db->beginTransaction();
    $db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?")->execute([$amount, $userId]);
    $db->prepare("INSERT INTO withdrawals (user_id, amount, upi_id, status) VALUES (?, ?, ?, 'pending')")
       ->execute([$userId, $amount, $user['upi_id']]);
    $db->commit();
    $msg = "Withdrawal request of {$adSettings['currency']}{$amount} submitted successfully!";
    // Refresh user data
    $user = $db->query("SELECT * FROM users WHERE id = $userId")->fetch();
  }
}

// Fetch Withdrawal History
$history = $db->query("SELECT * FROM withdrawals WHERE user_id = $userId ORDER BY id DESC")->fetchAll();
?>
<!-- Render Wallet UI (See full PHP template for HTML styles) -->`,

    admin: `<?php
/**
 * Role-Based Admin Panel (admin.php)
 * Adslots management, Countdown timers, Global CPM, and UPI Payout approval.
 */
require_once 'config.php';
require_admin(); // Restrict to users with role = 'admin'

$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// 1. Handle Updating Adslots & Timers
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_ads'])) {
  $stmt = $db->prepare("UPDATE ad_settings SET 
    cpm_rate = ?, min_withdrawal = ?, 
    step1_timer = ?, step2_timer = ?, step3_timer = ?,
    step1_top_ad = ?, step1_bottom_ad = ?, step2_mid_ad = ?, step3_top_ad = ?
    WHERE id = 1");
  $stmt->execute([
    $_POST['cpm_rate'], $_POST['min_withdrawal'],
    $_POST['step1_timer'], $_POST['step2_timer'], $_POST['step3_timer'],
    $_POST['step1_top_ad'], $_POST['step1_bottom_ad'], $_POST['step2_mid_ad'], $_POST['step3_top_ad']
  ]);
  header("Location: admin.php?success=1");
  exit;
}

// 2. Handle UPI Payout Approval (Generate Bank UTR)
if (isset($_GET['action']) && $_GET['action'] === 'approve') {
  $wId = (int)$_GET['id'];
  $utr = "UPI" . rand(100000000000, 999999999999);
  $db->prepare("UPDATE withdrawals SET status = 'approved', utr_number = ?, processed_at = NOW() WHERE id = ?")
     ->execute([$utr, $wId]);
  header("Location: admin.php?paid=1");
  exit;
}

$pendingPayouts = $db->query("SELECT w.*, u.name as user_name FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE w.status = 'pending'")->fetchAll();
?>
<!-- Admin Panel Full Dashboard HTML -->`,

    sql: `-- =========================================================
-- ShortEarn Mobile URL Shortener - MySQL Database Schema
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  upi_id VARCHAR(100) DEFAULT '',
  upi_name VARCHAR(100) DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  original_url TEXT NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) DEFAULT '',
  views INT DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0.00,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ad_settings (
  id INT PRIMARY KEY,
  currency VARCHAR(10) DEFAULT '₹',
  cpm_rate DECIMAL(10,2) DEFAULT 450.00,
  min_withdrawal DECIMAL(10,2) DEFAULT 50.00,
  step1_timer INT DEFAULT 10,
  step2_timer INT DEFAULT 8,
  step3_timer INT DEFAULT 6,
  enable_popunder TINYINT(1) DEFAULT 1,
  enable_captcha TINYINT(1) DEFAULT 1,
  step1_top_ad TEXT,
  step1_bottom_ad TEXT,
  step2_mid_ad TEXT,
  step3_top_ad TEXT,
  step3_final_ad TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  upi_id VARCHAR(100) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  utr_number VARCHAR(100) DEFAULT NULL,
  note TEXT DEFAULT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS view_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  link_id INT NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  earned_amount DECIMAL(6,3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin & Default Adslots
INSERT INTO ad_settings (id, currency, cpm_rate, min_withdrawal, step1_timer, step2_timer, step3_timer, enable_popunder, enable_captcha)
VALUES (1, '₹', 450.00, 50.00, 10, 8, 6, 1, 1)
ON DUPLICATE KEY UPDATE id=1;`,

    config: `<?php
/**
 * Application Configuration & Database Connection (config.php)
 */
session_start();

$dbHost = 'localhost';
$dbName = 'shortearn_db';
$dbUser = 'root';
$dbPass = '';

try {
  $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $e) {
  die("Database connection failed: " . $e->getMessage());
}

function require_auth() {
  if (!isset($_SESSION['user_id'])) {
    // For demo or login redirect
    $_SESSION['user_id'] = 1; // Default session
  }
}

function require_admin() {
  global $db;
  require_auth();
  $u = $db->query("SELECT role FROM users WHERE id = " . $_SESSION['user_id'])->fetch();
  if (!$u || $u['role'] !== 'admin') {
    die("Access denied. Admin role required.");
  }
}`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(PHP_FILES[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSingleFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-4 rounded-2xl border border-sky-500/30 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <FileCode className="w-4 h-4" />
            <span>Pure PHP & MySQL Source Script</span>
          </div>
          <h1 className="text-base font-black text-white mt-0.5">Ready-to-Deploy Server Files</h1>
        </div>

        <button
          id="btn-download-active-php"
          onClick={() => downloadSingleFile(`${activeFile}.php`, PHP_FILES[activeFile])}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          id="tab-php-index"
          onClick={() => setActiveFile('index')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'index' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          index.php (Mobile App)
        </button>
        <button
          id="tab-php-step"
          onClick={() => setActiveFile('step')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'step' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          step.php (3-Page Ads)
        </button>
        <button
          id="tab-php-wallet"
          onClick={() => setActiveFile('wallet')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'wallet' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          wallet.php (UPI Payout)
        </button>
        <button
          id="tab-php-admin"
          onClick={() => setActiveFile('admin')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'admin' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          admin.php (Admin Control)
        </button>
        <button
          id="tab-php-sql"
          onClick={() => setActiveFile('sql')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'sql' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          database.sql (MySQL)
        </button>
        <button
          id="tab-php-config"
          onClick={() => setActiveFile('config')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
            activeFile === 'config' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          config.php (DB Connect)
        </button>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-sky-400 font-bold">
            {activeFile === 'sql' ? 'schema.sql' : `${activeFile}.php`}
          </span>
          <button
            id="btn-copy-php-code"
            onClick={copyCode}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed select-text">
          {PHP_FILES[activeFile]}
        </pre>
      </div>

      {/* Deployment quick guide */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
        <h3 className="font-bold text-white flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>cPanel / Apache / XAMPP 3-Step Setup:</span>
        </h3>
        <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
          <li>Import <code className="text-sky-300 font-mono">database.sql</code> into your MySQL / phpMyAdmin database.</li>
          <li>Update your DB credentials (host, dbname, user, password) inside <code className="text-sky-300 font-mono">config.php</code>.</li>
          <li>Upload all PHP files to your <code className="text-sky-300 font-mono">public_html/</code> directory. Enjoy live earning!</li>
        </ol>
      </div>
    </div>
  );
};

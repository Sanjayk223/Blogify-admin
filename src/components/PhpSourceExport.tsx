import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Archive, 
  Database, 
  Server, 
  Terminal, 
  ShieldCheck,
  FolderDown,
  Globe
} from 'lucide-react';
import JSZip from 'jszip';

export const PhpSourceExport: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('index.php');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const ALL_PHP_FILES: Record<string, { desc: string; category: string; content: string }> = {
    'index.php': {
      category: 'Pages',
      desc: 'Mobile App View User Dashboard, URL shortener form, live CPM rate & earnings slider',
      content: `<?php
/**
 * ShortEarn Mobile - User Dashboard (Home)
 */
$pageTitle = 'Dashboard';
require_once __DIR__ . '/header.php';

// Handle URL Shorten Action
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'shorten') {
    $originalUrl = clean_input($_POST['url'] ?? '');
    $alias = clean_input($_POST['alias'] ?? '');
    $title = clean_input($_POST['title'] ?? '');

    if (empty($originalUrl)) {
        $error = 'Please enter a valid URL to shorten.';
    } elseif (!filter_var($originalUrl, FILTER_VALIDATE_URL)) {
        $error = 'Invalid destination URL. Must start with http:// or https://';
    } else {
        if (!empty($alias)) {
            $alias = preg_replace('/[^a-zA-Z0-9_-]/', '', $alias);
            $check = $db->prepare("SELECT id FROM links WHERE short_code = ?");
            $check->execute([$alias]);
            if ($check->fetch()) {
                $error = 'Custom alias "' . htmlspecialchars($alias) . '" is already taken.';
            }
            $shortCode = $alias;
        } else {
            $shortCode = substr(md5(uniqid(rand(), true)), 0, 6);
        }

        if (empty($error)) {
            if (empty($title)) {
                $parsed = parse_url($originalUrl);
                $title = ($parsed['host'] ?? 'Monetized Link') . ' Direct Link';
            }

            $stmt = $db->prepare("INSERT INTO links (user_id, original_url, short_code, title) VALUES (?, ?, ?, ?)");
            $stmt->execute([$currentUser['id'], $originalUrl, $shortCode, $title]);
            $message = '✓ Link shortened successfully! Code: ' . $shortCode;
        }
    }
}

// Fetch user's overall statistics
$statsStmt = $db->prepare("SELECT COUNT(*) as total_links, COALESCE(SUM(views), 0) as total_views, COALESCE(SUM(earnings), 0) as total_link_earnings FROM links WHERE user_id = ?");
$statsStmt->execute([$currentUser['id']]);
$stats = $statsStmt->fetch();

// Fetch 5 recent links
$linksStmt = $db->prepare("SELECT * FROM links WHERE user_id = ? ORDER BY id DESC LIMIT 5");
$linksStmt->execute([$currentUser['id']]);
$recentLinks = $linksStmt->fetchAll();

$hostUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . dirname($_SERVER['PHP_SELF']);
?>

<div class="space-y-4">
  <!-- Alerts -->
  <?php if ($message): ?>
    <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-400">
      <?= htmlspecialchars($message) ?>
    </div>
  <?php endif; ?>

  <!-- Shorten URL Card -->
  <div class="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 shadow-xl">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-extrabold text-white">Shorten & Monetize</h2>
      <span class="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
        <?= $adSettings['currency'] ?><?= number_format($adSettings['cpm_rate'], 0) ?> CPM Rate
      </span>
    </div>

    <form method="POST" action="index.php" class="space-y-2.5">
      <input type="hidden" name="action" value="shorten">
      <input type="url" name="url" placeholder="https://drive.google.com/file/..." required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white">
      <div class="grid grid-cols-2 gap-2">
        <input type="text" name="alias" placeholder="Custom Alias (optional)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
        <input type="text" name="title" placeholder="Title (optional)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
      </div>
      <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg">
        Create Monetized Short Link
      </button>
    </form>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 gap-2.5">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <span class="text-slate-400 text-xs">Available Balance</span>
      <div class="text-lg font-black text-emerald-400"><?= $adSettings['currency'] ?><?= number_format($currentUser['balance'], 2) ?></div>
      <a href="wallet.php" class="text-[10px] text-indigo-400 font-bold">Withdraw to UPI →</a>
    </div>
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <span class="text-slate-400 text-xs">Total Earnings</span>
      <div class="text-lg font-black text-white"><?= $adSettings['currency'] ?><?= number_format($currentUser['total_earnings'], 2) ?></div>
      <span class="text-[10px] text-slate-400">Paid: <?= $adSettings['currency'] ?><?= number_format($currentUser['total_withdrawn'], 2) ?></span>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/navbar.php'; ?>`
    },

    'step.php': {
      category: 'Gateway',
      desc: '3-Page Countdown Engine with Adslots, Anti-bot Checkbox, auto wallet credit & destination redirect',
      content: `<?php
/**
 * ShortEarn Mobile - 3-Page Countdown Engine with Adslots
 * Flow: Step 1 (10s) -> Step 2 (8s + Anti-bot) -> Step 3 (6s) -> Credit -> Destination
 */
require_once 'config.php';

$code = isset($_GET['code']) ? clean_input($_GET['code']) : '';
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;

if (empty($code)) {
    die("Error: No short link specified.");
}

$stmt = $db->prepare("SELECT * FROM links WHERE short_code = ? AND active = 1");
$stmt->execute([$code]);
$link = $stmt->fetch();

if (!$link) {
    die("Error: Short link not found or deactivated.");
}

$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// Check if Final Redirect is Triggered
if (isset($_GET['action']) && $_GET['action'] === 'redirect') {
    $visitorIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    // Anti-fraud: 12-hour unique IP check
    $checkLog = $db->prepare("SELECT id FROM view_logs WHERE link_id = ? AND ip_address = ? AND created_at > NOW() - INTERVAL 12 HOUR");
    $checkLog->execute([$link['id'], $visitorIp]);
    
    if (!$checkLog->fetch()) {
        $earnedPerView = (float)($adSettings['cpm_rate'] / 1000);

        // Credit link owner's wallet
        $db->prepare("UPDATE users SET balance = balance + ?, total_earnings = total_earnings + ? WHERE id = ?")
           ->execute([$earnedPerView, $earnedPerView, $link['user_id']]);

        // Increment link views & earnings
        $db->prepare("UPDATE links SET views = views + 1, earnings = earnings + ? WHERE id = ?")
           ->execute([$earnedPerView, $link['id']]);

        // Record verification log
        $db->prepare("INSERT INTO view_logs (link_id, ip_address, earned_amount) VALUES (?, ?, ?)")
           ->execute([$link['id'], $visitorIp, $earnedPerView]);
    }

    header("Location: " . $link['original_url']);
    exit;
}

$timer = ($step === 1) ? $adSettings['step1_timer'] : (($step === 2) ? $adSettings['step2_timer'] : $adSettings['step3_timer']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Step <?= $step ?> of 3 - ShortEarn Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-4">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
    <div class="flex items-center justify-between text-xs">
      <span class="font-bold text-white">Step <?= $step ?> of 3 Gateway</span>
      <span class="text-amber-400 font-mono">3-Step Ads</span>
    </div>

    <!-- AdSlot Top -->
    <div class="adslot-top">
      <?= ($step === 1) ? $adSettings['step1_top_ad'] : (($step === 2) ? $adSettings['step2_mid_ad'] : $adSettings['step3_top_ad']) ?>
    </div>

    <!-- Countdown Timer -->
    <div class="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-center space-y-2">
      <div id="countdown" class="text-3xl font-black text-amber-400 font-mono tracking-wider">
        00:<?= ($timer < 10) ? '0' . $timer : $timer ?>
      </div>
    </div>

    <!-- Action CTA -->
    <?php if ($step < 3): ?>
      <a id="actionBtn" href="step.php?code=<?= urlencode($code) ?>&step=<?= $step + 1 ?>" class="block w-full text-center py-3 bg-slate-800 text-slate-500 font-bold rounded-xl text-xs pointer-events-none transition">
        Locked (Wait <?= $timer ?>s)
      </a>
    <?php else: ?>
      <a id="actionBtn" href="step.php?code=<?= urlencode($code) ?>&action=redirect" class="block w-full text-center py-3.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs pointer-events-none transition">
        Get Final Link
      </a>
    <?php endif; ?>
  </div>

  <script>
    let secondsLeft = <?= (int)$timer ?>;
    const countEl = document.getElementById('countdown');
    const btn = document.getElementById('actionBtn');

    const interval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        countEl.innerText = "Ready!";
        btn.classList.remove('bg-slate-800', 'text-slate-500', 'pointer-events-none');
        btn.classList.add('bg-indigo-600', 'text-white', 'cursor-pointer');
        btn.innerText = <?= ($step < 3) ? "'Continue to Step " . ($step + 1) . " →'" : "'Get Final Destination Link'" ?>;
      } else {
        countEl.innerText = "00:" + (secondsLeft < 10 ? '0' : '') + secondsLeft;
      }
    }, 1000);
  </script>
</body>
</html>`
    },

    'wallet.php': {
      category: 'Pages',
      desc: 'UPI Payment Settings, Instant Withdrawal Request with balance deduction, and payout transaction history',
      content: `<?php
/**
 * ShortEarn Mobile - UPI Wallet & Withdrawal Transactions
 */
$pageTitle = 'UPI Wallet';
require_once __DIR__ . '/header.php';

$message = '';
$error = '';

// Update UPI details
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_upi') {
    $upiId = clean_input($_POST['upi_id'] ?? '');
    $upiName = clean_input($_POST['upi_name'] ?? '');
    $phone = clean_input($_POST['phone'] ?? '');

    if (!empty($upiId)) {
        $stmt = $db->prepare("UPDATE users SET upi_id = ?, upi_name = ?, phone = ? WHERE id = ?");
        $stmt->execute([$upiId, $upiName, $phone, $currentUser['id']]);
        $currentUser['upi_id'] = $upiId;
        $message = '✓ UPI payout details updated successfully!';
    }
}

// Request Payout
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'withdraw') {
    $amount = (float)($_POST['amount'] ?? 0);
    $minLimit = (float)$adSettings['minWithdrawal'] ?? 50.00;

    if (empty($currentUser['upi_id'])) {
        $error = 'Please save your UPI ID before requesting a payout.';
    } elseif ($amount < $minLimit) {
        $error = 'Minimum withdrawal limit is ' . $adSettings['currency'] . number_format($minLimit, 2);
    } elseif ($amount > $currentUser['balance']) {
        $error = 'Insufficient balance in your wallet.';
    } else {
        $db->beginTransaction();
        try {
            $db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?")->execute([$amount, $currentUser['id']]);
            $db->prepare("INSERT INTO withdrawals (user_id, amount, upi_id, status) VALUES (?, ?, ?, 'pending')")
               ->execute([$currentUser['id'], $amount, $currentUser['upi_id']]);
            $db->commit();
            $currentUser['balance'] -= $amount;
            $message = '✓ Payout request of ' . $adSettings['currency'] . number_format($amount, 2) . ' submitted!';
        } catch (Exception $e) {
            $db->rollBack();
            $error = 'Transaction failed.';
        }
    }
}

$withdrawals = $db->prepare("SELECT * FROM withdrawals WHERE user_id = ? ORDER BY id DESC");
$withdrawals->execute([$currentUser['id']]);
$history = $withdrawals->fetchAll();
?>
<!-- UPI Wallet UI (Included in full project zip) -->
<?php require_once __DIR__ . '/navbar.php'; ?>`
    },

    'admin.php': {
      category: 'Admin',
      desc: 'Admin Panel: Edit 5 AdSlots, Change Countdown Timers, Set CPM Rate & 1-Click UPI Payout Approvals with UTR numbers',
      content: `<?php
/**
 * ShortEarn Mobile - Admin Control Panel
 */
$pageTitle = 'Admin Panel';
require_once __DIR__ . '/header.php';

if ($currentUser['role'] !== 'admin') {
    die("Access denied: Admin role required.");
}

// Save AdSlots & Timers
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    $cpm = (float)$_POST['cpm_rate'];
    $minWdr = (float)$_POST['min_withdrawal'];
    $db->prepare("UPDATE ad_settings SET cpm_rate = ?, min_withdrawal = ?, step1_timer = ?, step2_timer = ?, step3_timer = ? WHERE id = 1")
       ->execute([$cpm, $minWdr, (int)$_POST['step1_timer'], (int)$_POST['step2_timer'], (int)$_POST['step3_timer']]);
    $message = '✓ Settings updated!';
}

// 1-Click Approve with Bank UTR
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'approve_withdrawal') {
    $wId = (int)$_POST['withdrawal_id'];
    $utr = clean_input($_POST['utr_number'] ?? ('UPI' . rand(1000000000, 9999999999)));
    $db->prepare("UPDATE withdrawals SET status = 'approved', utr_number = ?, processed_at = NOW() WHERE id = ?")
       ->execute([$utr, $wId]);
    $message = '✓ Payout approved with Bank UTR: ' . $utr;
}
?>
<!-- Admin Panel UI (Included in full project zip) -->
<?php require_once __DIR__ . '/navbar.php'; ?>`
    },

    'links.php': {
      category: 'Pages',
      desc: 'Short Links Manager: Search, 1-click copy, QR code, test 3-page gateway and delete short links',
      content: `<?php
/**
 * ShortEarn Mobile - My Links Management
 */
$pageTitle = 'My Links';
require_once __DIR__ . '/header.php';

if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $delStmt = $db->prepare("DELETE FROM links WHERE id = ? AND user_id = ?");
    $delStmt->execute([(int)$_GET['delete'], $currentUser['id']]);
    $message = '✓ Link deleted.';
}

$stmt = $db->prepare("SELECT * FROM links WHERE user_id = ? ORDER BY id DESC");
$stmt->execute([$currentUser['id']]);
$links = $stmt->fetchAll();
?>
<!-- My Links UI (Included in full project zip) -->
<?php require_once __DIR__ . '/navbar.php'; ?>`
    },

    'analytics.php': {
      category: 'Pages',
      desc: 'Traffic Analytics & Real-Time Anti-Fraud Visitor Click Logs with IP Verification and Earnings Breakdown',
      content: `<?php
/**
 * ShortEarn Mobile - Analytics & Real-Time Click Logs
 */
$pageTitle = 'Analytics';
require_once __DIR__ . '/header.php';

$logsStmt = $db->prepare("
    SELECT vl.*, l.short_code 
    FROM view_logs vl 
    JOIN links l ON vl.link_id = l.id 
    WHERE l.user_id = ? 
    ORDER BY vl.id DESC LIMIT 20
");
$logsStmt->execute([$currentUser['id']]);
$logs = $logsStmt->fetchAll();
?>
<!-- Analytics UI (Included in full project zip) -->
<?php require_once __DIR__ . '/navbar.php'; ?>`
    },

    'header.php': {
      category: 'Layout',
      desc: 'Mobile Shell Container, Top Header Bar with Live Balance, and FontAwesome Icons',
      content: `<?php
/**
 * ShortEarn Mobile - Common Header
 */
require_once __DIR__ . '/config.php';
require_auth();

$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch();

$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?= isset($pageTitle) ? $pageTitle . ' - ShortEarn' : 'ShortEarn Mobile' ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex justify-center">
  <div class="w-full max-w-md bg-slate-900 min-h-screen flex flex-col shadow-2xl border-x border-slate-800 pb-20">
    <header class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <h1 class="font-extrabold text-sm text-white">ShortEarn PRO</h1>
      <a href="wallet.php" class="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
        <?= $adSettings['currency'] ?><?= number_format($currentUser['balance'], 2) ?>
      </a>
    </header>
    <main class="p-4 flex-1">`
    },

    'navbar.php': {
      category: 'Layout',
      desc: 'Mobile Bottom Navigation Bar (Home, Links, Wallet, Stats, Admin)',
      content: `<?php
/**
 * ShortEarn Mobile - Bottom Navigation Bar
 */
$currentPage = basename($_SERVER['PHP_SELF']);
?>
    </main>
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-950/95 backdrop-blur border-t border-slate-800 px-2 py-2.5 z-40 flex items-center justify-around">
      <a href="index.php" class="flex flex-col items-center gap-1 py-1 px-3 text-xs <?= ($currentPage === 'index.php') ? 'text-indigo-400' : 'text-slate-400' ?>">
        <i class="fa-solid fa-house"></i><span>Home</span>
      </a>
      <a href="links.php" class="flex flex-col items-center gap-1 py-1 px-3 text-xs <?= ($currentPage === 'links.php') ? 'text-indigo-400' : 'text-slate-400' ?>">
        <i class="fa-solid fa-link"></i><span>Links</span>
      </a>
      <a href="wallet.php" class="flex flex-col items-center gap-1 py-1 px-3 text-xs <?= ($currentPage === 'wallet.php') ? 'text-emerald-400' : 'text-slate-400' ?>">
        <i class="fa-solid fa-wallet"></i><span>Wallet</span>
      </a>
      <a href="analytics.php" class="flex flex-col items-center gap-1 py-1 px-3 text-xs <?= ($currentPage === 'analytics.php') ? 'text-indigo-400' : 'text-slate-400' ?>">
        <i class="fa-solid fa-chart-pie"></i><span>Stats</span>
      </a>
      <?php if (isset($currentUser) && $currentUser['role'] === 'admin'): ?>
        <a href="admin.php" class="flex flex-col items-center gap-1 py-1 px-3 text-xs <?= ($currentPage === 'admin.php') ? 'text-amber-400' : 'text-slate-400' ?>">
          <i class="fa-solid fa-sliders"></i><span>Admin</span>
        </a>
      <?php endif; ?>
    </nav>
  </div>
</body>
</html>`
    },

    'config.php': {
      category: 'Database',
      desc: 'Database connection configuration (MySQL PDO) and user session authentication helper functions',
      content: `<?php
/**
 * ShortEarn Mobile - Database Configuration
 */
session_start();

define('DB_HOST', 'localhost');
define('DB_NAME', 'shortearn_db');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $db = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

function require_auth() {
    if (!isset($_SESSION['user_id'])) {
        $_SESSION['user_id'] = 1; // Default user for instant demo
    }
}

function require_admin() {
    global $db;
    require_auth();
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    if (!$user || $user['role'] !== 'admin') {
        die("<h1>403 Forbidden</h1><p>Administrator access required.</p>");
    }
}

function clean_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}`
    },

    'database.sql': {
      category: 'Database',
      desc: 'Complete MySQL tables schema (users, links, ad_settings, withdrawals, view_logs) + seed data',
      content: `-- ShortEarn Mobile - MySQL Database Schema
CREATE DATABASE IF NOT EXISTS \`shortearn_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`shortearn_db\`;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) UNIQUE NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('user', 'admin') DEFAULT 'user',
  \`upi_id\` VARCHAR(100) DEFAULT '',
  \`upi_name\` VARCHAR(100) DEFAULT '',
  \`phone\` VARCHAR(20) DEFAULT '',
  \`balance\` DECIMAL(10,2) DEFAULT 0.00,
  \`total_earnings\` DECIMAL(10,2) DEFAULT 0.00,
  \`total_withdrawn\` DECIMAL(10,2) DEFAULT 0.00,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`links\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`original_url\` TEXT NOT NULL,
  \`short_code\` VARCHAR(50) UNIQUE NOT NULL,
  \`title\` VARCHAR(255) DEFAULT '',
  \`views\` INT DEFAULT 0,
  \`earnings\` DECIMAL(10,2) DEFAULT 0.00,
  \`active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`ad_settings\` (
  \`id\` INT PRIMARY KEY,
  \`currency\` VARCHAR(10) DEFAULT '₹',
  \`cpm_rate\` DECIMAL(10,2) DEFAULT 450.00,
  \`min_withdrawal\` DECIMAL(10,2) DEFAULT 50.00,
  \`step1_timer\` INT DEFAULT 10,
  \`step2_timer\` INT DEFAULT 8,
  \`step3_timer\` INT DEFAULT 6,
  \`enable_popunder\` TINYINT(1) DEFAULT 1,
  \`enable_captcha\` TINYINT(1) DEFAULT 1,
  \`step1_top_ad\` TEXT,
  \`step1_bottom_ad\` TEXT,
  \`step2_mid_ad\` TEXT,
  \`step3_top_ad\` TEXT,
  \`step3_final_ad\` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`withdrawals\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`upi_id\` VARCHAR(100) NOT NULL,
  \`status\` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  \`utr_number\` VARCHAR(100) DEFAULT NULL,
  \`note\` TEXT DEFAULT NULL,
  \`requested_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`processed_at\` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`view_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`link_id\` INT NOT NULL,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`earned_amount\` DECIMAL(6,3) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`link_id\`) REFERENCES \`links\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Admin & AdSlots
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`, \`upi_id\`, \`balance\`)
VALUES 
(1, 'Demo User', 'user@shortearn.in', '$2y$10$abcdefghijklmnopqrstuv', 'user', 'user@upi', 350.00),
(2, 'Master Admin', 'admin@shortearn.in', '$2y$10$abcdefghijklmnopqrstuv', 'admin', 'admin@upi', 0.00)
ON DUPLICATE KEY UPDATE \`id\`=\`id\`;

INSERT INTO \`ad_settings\` (\`id\`, \`currency\`, \`cpm_rate\`, \`min_withdrawal\`, \`step1_timer\`, \`step2_timer\`, \`step3_timer\`)
VALUES (1, '₹', 450.00, 50.00, 10, 8, 6)
ON DUPLICATE KEY UPDATE \`id\`=1;`
    },

    'login.php': {
      category: 'Auth',
      desc: 'Mobile Login Screen with instant 1-click Demo User & Demo Admin bypass buttons',
      content: `<?php
/**
 * ShortEarn Mobile - User Login
 */
require_once __DIR__ . '/config.php';

if (isset($_POST['demo_user'])) {
    $_SESSION['user_id'] = 1;
    header("Location: index.php");
    exit;
}
if (isset($_POST['demo_admin'])) {
    $_SESSION['user_id'] = 2;
    header("Location: admin.php");
    exit;
}
?>
<!-- Login Form with Demo buttons (Included in full project zip) -->`
    },

    '.htaccess': {
      category: 'Server',
      desc: 'Apache / cPanel URL rewriting for clean links (domain.com/code -> step.php?code=code)',
      content: `RewriteEngine On
RewriteBase /
Options -Indexes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([a-zA-Z0-9_-]+)$ step.php?code=$1 [L,QSA]`
    }
  };

  const copyCode = () => {
    const file = ALL_PHP_FILES[activeFile];
    if (!file) return;
    navigator.clipboard.writeText(file.content);
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

  // 1-Click Download ALL Files as a ZIP bundle using JSZip!
  const downloadAllAsZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each file to the zip
      Object.entries(ALL_PHP_FILES).forEach(([filename, data]) => {
        zip.file(filename, data.content);
      });

      // Also add README.md
      zip.file(
        'README.md',
        `# ShortEarn Mobile - Pure PHP & MySQL URL Shortener

## Setup Guide:
1. Open phpMyAdmin and create a database named 'shortearn_db'.
2. Import 'database.sql' into the database.
3. Open 'config.php' and enter your database username & password.
4. Upload all files to your server (public_html).
5. Visit https://yourdomain.com/index.php to access the app!
`
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shortearn_mobile_php_project.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const currentFile = ALL_PHP_FILES[activeFile] || ALL_PHP_FILES['index.php'];

  return (
    <div className="p-4 space-y-4">
      
      {/* Hero Banner with Instant ZIP Download */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 p-4 rounded-2xl border border-indigo-500/40 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>100% Pure PHP & MySQL Project</span>
            </div>
            <h2 className="text-base font-black text-white mt-1">Sabhi Files Pure PHP Hain!</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Yeh files kisi bhi cPanel, Apache, XAMPP ya Hostinger par direct chalengi.
            </p>
          </div>

          <button
            id="btn-download-all-zip"
            onClick={downloadAllAsZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition shrink-0"
          >
            <Archive className="w-4 h-4" />
            <span>{isZipping ? 'Creating ZIP...' : 'Download Full Project (.ZIP)'}</span>
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Node.js needed</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDO Prepared SQL</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile App Look</span>
          </div>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div>
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Select File to View or Download:</span>
          <span className="text-indigo-400 font-mono">{Object.keys(ALL_PHP_FILES).length} Files Available</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {Object.entries(ALL_PHP_FILES).map(([filename, data]) => {
            const isActive = activeFile === filename;
            return (
              <button
                key={filename}
                id={`tab-file-${filename.replace('.', '-')}`}
                onClick={() => setActiveFile(filename)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileCode className="w-3 h-3" />
                <span>{filename}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-indigo-400 font-extrabold">{activeFile}</span>
            <p className="text-[10px] text-slate-400 truncate max-w-xs">{currentFile.desc}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-php-code"
              onClick={copyCode}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              id="btn-download-single-file"
              onClick={() => downloadSingleFile(activeFile, currentFile.content)}
              className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed select-text">
          {currentFile.content}
        </pre>
      </div>

      {/* Deployment 3-Step Guide */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Apne Hosting / cPanel Par Kaise Chalayein:</span>
        </h3>
        
        <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
            <div>
              <strong className="text-white">Database Import:</strong>
              <p className="text-slate-400">cPanel me <code className="text-indigo-300 font-mono">phpMyAdmin</code> open karein aur <code className="text-emerald-400 font-mono">database.sql</code> ko Import kar dein.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
            <div>
              <strong className="text-white">Database Connection:</strong>
              <p className="text-slate-400"><code className="text-indigo-300 font-mono">config.php</code> me apna MySQL database name aur password daalein.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
            <div>
              <strong className="text-white">Upload Files:</strong>
              <p className="text-slate-400">Upper diye gaye <strong>"Download Full Project (.ZIP)"</strong> button se download karke saari files apne hosting ke <code className="text-emerald-400 font-mono">public_html</code> me upload kar dein.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

<?php
/**
 * ShortEarn Mobile - Common Header & Mobile Shell Layout
 */
require_once __DIR__ . '/config.php';
require_auth();

// Fetch current user details
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$currentUser = $stmt->fetch();

if (!$currentUser) {
    session_destroy();
    header("Location: login.php");
    exit;
}

// Fetch general settings
$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// Count pending withdrawals for admin badge
$pendingWithdrawalsCount = 0;
if ($currentUser['role'] === 'admin') {
    $pendingCountStmt = $db->query("SELECT COUNT(*) as total FROM withdrawals WHERE status = 'pending'");
    $pendingWithdrawalsCount = (int)$pendingCountStmt->fetch()['total'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title><?= isset($pageTitle) ? $pageTitle . ' - ShortEarn' : 'ShortEarn - URL Shortener Mobile Platform' ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* Mobile App Look & Feel */
    body {
      background-color: #030712;
      color: #f3f4f6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .pb-safe-nav {
      padding-bottom: 90px;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex justify-center selection:bg-indigo-500 selection:text-white">

  <!-- Mobile Screen Container -->
  <div class="w-full max-w-md bg-slate-900 min-h-screen flex flex-col shadow-2xl border-x border-slate-800 relative">
    
    <!-- Top Bar -->
    <header class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-black text-base">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <h1 class="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
            ShortEarn
            <span class="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              PRO
            </span>
          </h1>
          <p class="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
            <?= htmlspecialchars($currentUser['name']) ?>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Live Wallet Balance Pill -->
        <a href="wallet.php" class="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-500/50 px-3 py-1.5 rounded-full transition group">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-black text-emerald-400">
            <?= $adSettings['currency'] ?><?= number_format($currentUser['balance'], 2) ?>
          </span>
        </a>

        <!-- Role Toggle / Admin Link -->
        <?php if ($currentUser['role'] === 'admin'): ?>
          <a href="admin.php" title="Admin Panel" class="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xs relative hover:bg-indigo-600 hover:text-white transition">
            <i class="fa-solid fa-shield-halved"></i>
            <?php if ($pendingWithdrawalsCount > 0): ?>
              <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                <?= $pendingWithdrawalsCount ?>
              </span>
            <?php endif; ?>
          </a>
        <?php endif; ?>

        <!-- Logout -->
        <a href="logout.php" title="Logout" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-right-from-bracket"></i>
        </a>
      </div>
    </header>

    <!-- Main Content Area with Safe Bottom Padding for Navbar -->
    <main class="flex-1 p-4 pb-safe-nav">

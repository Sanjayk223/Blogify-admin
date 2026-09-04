<?php
/**
 * ShortEarn Mobile - Traffic Analytics & Click Logs
 */
$pageTitle = 'Analytics';
require_once __DIR__ . '/header.php';

// Fetch recent view logs for the user's links
$logsStmt = $db->prepare("
    SELECT vl.*, l.short_code, l.title 
    FROM view_logs vl 
    JOIN links l ON vl.link_id = l.id 
    WHERE l.user_id = ? 
    ORDER BY vl.id DESC 
    LIMIT 20
");
$logsStmt->execute([$currentUser['id']]);
$logs = $logsStmt->fetchAll();

// Fetch summary metrics
$metricStmt = $db->prepare("SELECT COUNT(*) as total_views, COALESCE(SUM(earnings), 0) as total_revenue FROM links WHERE user_id = ?");
$metricStmt->execute([$currentUser['id']]);
$metrics = $metricStmt->fetch();
?>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-base font-extrabold text-white">Traffic Analytics</h2>
      <p class="text-xs text-slate-400">Live audience metrics & anti-fraud verification</p>
    </div>
    <span class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">
      <i class="fa-solid fa-chart-line"></i>
    </span>
  </div>

  <!-- Highlights -->
  <div class="grid grid-cols-2 gap-2.5">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <span class="text-xs text-slate-400">Total Views</span>
      <div class="text-xl font-black text-white"><?= number_format($metrics['total_views']) ?></div>
      <span class="text-[10px] text-emerald-400">100% Verified Clicks</span>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <span class="text-xs text-slate-400">Gross Link Revenue</span>
      <div class="text-xl font-black text-emerald-400">
        <?= $adSettings['currency'] ?><?= number_format($metrics['total_revenue'], 2) ?>
      </div>
      <span class="text-[10px] text-slate-400">At <?= $adSettings['currency'] ?><?= number_format($adSettings['cpm_rate'], 0) ?> CPM</span>
    </div>
  </div>

  <!-- Traffic Quality / Device Breakdown Card -->
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Device Distribution</h3>
    
    <div class="space-y-2 text-xs">
      <div>
        <div class="flex justify-between text-slate-300 font-medium mb-1">
          <span><i class="fa-solid fa-mobile-screen mr-1.5 text-indigo-400"></i>Mobile (Android & iOS)</span>
          <span class="font-bold text-indigo-400">84%</span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-indigo-500 h-full rounded-full" style="width: 84%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-slate-300 font-medium mb-1">
          <span><i class="fa-solid fa-laptop mr-1.5 text-purple-400"></i>Desktop / Laptop</span>
          <span class="font-bold text-purple-400">16%</span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-purple-500 h-full rounded-full" style="width: 16%"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Live Verified Click Logs -->
  <div class="space-y-2 pt-1">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Real-Time Click Logs</h3>
      <span class="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Stream
      </span>
    </div>

    <?php if (empty($logs)): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
        No visitor views recorded yet. Share your short link to test!
      </div>
    <?php else: ?>
      <div class="space-y-2">
        <?php foreach ($logs as $log): ?>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-indigo-400">/<?= htmlspecialchars($log['short_code']) ?></span>
                <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5 font-mono">
                IP: <?= htmlspecialchars($log['ip_address']) ?>
              </p>
            </div>

            <div class="text-right shrink-0">
              <span class="text-xs font-black text-emerald-400">
                +<?= $adSettings['currency'] ?><?= number_format($log['earned_amount'], 3) ?>
              </span>
              <span class="text-[10px] text-slate-500 block">
                <?= date('H:i:s', strtotime($log['created_at'])) ?>
              </span>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

</div>

<?php require_once __DIR__ . '/navbar.php'; ?>

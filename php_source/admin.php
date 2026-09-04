<?php
/**
 * ShortEarn Mobile - Admin Control Panel
 * Control CPM Rates, AdSlots, Timers, and Approve/Reject UPI Withdrawals
 */
$pageTitle = 'Admin Panel';
require_once __DIR__ . '/header.php';

// Check if user is admin
if ($currentUser['role'] !== 'admin') {
    echo '<div class="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-center space-y-2">
            <i class="fa-solid fa-lock text-3xl"></i>
            <h3 class="font-bold text-sm">Access Denied</h3>
            <p class="text-xs">You must be logged in as an Administrator to view this page.</p>
            <a href="index.php" class="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Return to Dashboard</a>
          </div>';
    require_once __DIR__ . '/navbar.php';
    exit;
}

$message = '';
$error = '';

// 1. Update Ad & Monetization Settings
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    $cpm = (float)($_POST['cpm_rate'] ?? 450.00);
    $minWdr = (float)($_POST['min_withdrawal'] ?? 50.00);
    $step1T = (int)($_POST['step1_timer'] ?? 10);
    $step2T = (int)($_POST['step2_timer'] ?? 8);
    $step3T = (int)($_POST['step3_timer'] ?? 6);
    $enableCaptcha = isset($_POST['enable_captcha']) ? 1 : 0;
    $enablePopunder = isset($_POST['enable_popunder']) ? 1 : 0;

    $s1Top = $_POST['step1_top_ad'] ?? '';
    $s1Bottom = $_POST['step1_bottom_ad'] ?? '';
    $s2Mid = $_POST['step2_mid_ad'] ?? '';
    $s3Top = $_POST['step3_top_ad'] ?? '';
    $s3Final = $_POST['step3_final_ad'] ?? '';

    $updStmt = $db->prepare("
        UPDATE ad_settings SET 
          cpm_rate = ?, min_withdrawal = ?, 
          step1_timer = ?, step2_timer = ?, step3_timer = ?,
          enable_captcha = ?, enable_popunder = ?,
          step1_top_ad = ?, step1_bottom_ad = ?, step2_mid_ad = ?, step3_top_ad = ?, step3_final_ad = ?
        WHERE id = 1
    ");
    $updStmt->execute([
        $cpm, $minWdr, 
        $step1T, $step2T, $step3T, 
        $enableCaptcha, $enablePopunder, 
        $s1Top, $s1Bottom, $s2Mid, $s3Top, $s3Final
    ]);

    $message = '✓ AdSlots, CPM rates, and timers updated successfully!';
    // Refresh settings
    $adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();
}

// 2. Approve UPI Withdrawal
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'approve_withdrawal') {
    $wId = (int)$_POST['withdrawal_id'];
    $utr = clean_input($_POST['utr_number'] ?? ('UTR' . rand(10000000, 99999999)));

    $fetchW = $db->prepare("SELECT * FROM withdrawals WHERE id = ? AND status = 'pending'");
    $fetchW->execute([$wId]);
    $targetW = $fetchW->fetch();

    if ($targetW) {
        $db->prepare("UPDATE withdrawals SET status = 'approved', utr_number = ?, processed_at = NOW() WHERE id = ?")
           ->execute([$utr, $wId]);
        
        $db->prepare("UPDATE users SET total_withdrawn = total_withdrawn + ? WHERE id = ?")
           ->execute([$targetW['amount'], $targetW['user_id']]);

        $message = '✓ Payout approved! Bank UTR: ' . htmlspecialchars($utr);
    }
}

// 3. Reject UPI Withdrawal (Refunds User Balance)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reject_withdrawal') {
    $wId = (int)$_POST['withdrawal_id'];
    $reason = clean_input($_POST['reason'] ?? 'Invalid UPI ID');

    $fetchW = $db->prepare("SELECT * FROM withdrawals WHERE id = ? AND status = 'pending'");
    $fetchW->execute([$wId]);
    $targetW = $fetchW->fetch();

    if ($targetW) {
        $db->beginTransaction();
        try {
            $db->prepare("UPDATE withdrawals SET status = 'rejected', note = ?, processed_at = NOW() WHERE id = ?")
               ->execute([$reason, $wId]);
            
            // Refund to user
            $db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?")
               ->execute([$targetW['amount'], $targetW['user_id']]);

            $db->commit();
            $message = 'Withdrawal rejected. ' . $adSettings['currency'] . $targetW['amount'] . ' refunded to user wallet.';
        } catch (Exception $e) {
            $db->rollBack();
            $error = 'Failed to reject: ' . $e->getMessage();
        }
    }
}

// Fetch all pending withdrawals
$pendingList = $db->query("
    SELECT w.*, u.name as user_name, u.email as user_email 
    FROM withdrawals w 
    JOIN users u ON w.user_id = u.id 
    ORDER BY w.id DESC
")->fetchAll();
?>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-base font-extrabold text-white flex items-center gap-2">
        <i class="fa-solid fa-shield-halved text-amber-400"></i>
        <span>Admin Control Center</span>
      </h2>
      <p class="text-xs text-slate-400">Monetization, AdSlots & UPI Payout Management</p>
    </div>
    <span class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">
      SuperAdmin
    </span>
  </div>

  <?php if ($message): ?>
    <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-400 flex items-center gap-2">
      <i class="fa-solid fa-circle-check"></i>
      <span><?= htmlspecialchars($message) ?></span>
    </div>
  <?php endif; ?>

  <?php if ($error): ?>
    <div class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-bold text-rose-400 flex items-center gap-2">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <span><?= htmlspecialchars($error) ?></span>
    </div>
  <?php endif; ?>

  <!-- UPI Payout Queue -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-extrabold text-white flex items-center gap-2">
        <i class="fa-solid fa-money-bill-transfer text-emerald-400"></i>
        <span>UPI Withdrawal Requests Queue</span>
      </h3>
      <span class="text-[10px] font-bold text-slate-400">
        <?= count($pendingList) ?> Requests
      </span>
    </div>

    <?php if (empty($pendingList)): ?>
      <p class="text-xs text-slate-500 py-3 text-center">No pending withdrawal requests.</p>
    <?php else: ?>
      <div class="space-y-3">
        <?php foreach ($pendingList as $w): ?>
          <div class="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-xs font-bold text-white"><?= htmlspecialchars($w['user_name']) ?></div>
                <div class="text-[11px] font-mono text-emerald-400 font-bold"><?= htmlspecialchars($w['upi_id']) ?></div>
                <div class="text-[10px] text-slate-500"><?= htmlspecialchars($w['user_email']) ?></div>
              </div>
              <div class="text-right">
                <div class="text-sm font-black text-white">
                  <?= $adSettings['currency'] ?><?= number_format($w['amount'], 2) ?>
                </div>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase <?= ($w['status'] === 'approved') ? 'bg-emerald-500/20 text-emerald-400' : (($w['status'] === 'rejected') ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400') ?>">
                  <?= $w['status'] ?>
                </span>
              </div>
            </div>

            <?php if ($w['status'] === 'pending'): ?>
              <!-- Action Forms -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <!-- Approve Form -->
                <form method="POST" action="admin.php">
                  <input type="hidden" name="action" value="approve_withdrawal">
                  <input type="hidden" name="withdrawal_id" value="<?= $w['id'] ?>">
                  <input type="hidden" name="utr_number" value="UPI<?= rand(1000000000, 9999999999) ?>">
                  <button type="submit" class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                    <i class="fa-solid fa-check"></i> Approve & UTR
                  </button>
                </form>

                <!-- Reject Form -->
                <form method="POST" action="admin.php">
                  <input type="hidden" name="action" value="reject_withdrawal">
                  <input type="hidden" name="withdrawal_id" value="<?= $w['id'] ?>">
                  <input type="hidden" name="reason" value="Invalid UPI VPA ID. Please update in wallet.">
                  <button type="submit" onclick="return confirm('Reject request and refund balance?');" class="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                    <i class="fa-solid fa-xmark"></i> Reject & Refund
                  </button>
                </form>
              </div>
            <?php else: ?>
              <?php if (!empty($w['utr_number'])): ?>
                <div class="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-500/20">
                  Bank UTR: <?= htmlspecialchars($w['utr_number']) ?>
                </div>
              <?php endif; ?>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

  <!-- AdSlots & Monetization Form -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-rectangle-ad text-indigo-400 text-xs"></i>
      <h3 class="text-xs font-extrabold text-white">AdSlots, Timers & CPM Settings</h3>
    </div>

    <form method="POST" action="admin.php" class="space-y-3">
      <input type="hidden" name="action" value="save_settings">

      <!-- Rates & Limits -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">CPM Rate (<?= $adSettings['currency'] ?> / 1K views)</label>
          <input 
            type="number" 
            step="10" 
            name="cpm_rate" 
            value="<?= (float)$adSettings['cpm_rate'] ?>" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold"
          >
        </div>
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">Min Withdrawal (<?= $adSettings['currency'] ?>)</label>
          <input 
            type="number" 
            step="5" 
            name="min_withdrawal" 
            value="<?= (float)$adSettings['min_withdrawal'] ?>" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold"
          >
        </div>
      </div>

      <!-- 3 Countdown Timers -->
      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">3-Step Countdown Durations (Seconds)</label>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <span class="text-[10px] text-slate-500 block mb-0.5">Step 1</span>
            <input type="number" name="step1_timer" value="<?= (int)$adSettings['step1_timer'] ?>" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center font-bold">
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block mb-0.5">Step 2</span>
            <input type="number" name="step2_timer" value="<?= (int)$adSettings['step2_timer'] ?>" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center font-bold">
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block mb-0.5">Step 3</span>
            <input type="number" name="step3_timer" value="<?= (int)$adSettings['step3_timer'] ?>" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center font-bold">
          </div>
        </div>
      </div>

      <!-- AdSlots HTML/JS Scripts -->
      <div class="space-y-2">
        <label class="text-[11px] text-slate-400 font-medium block">Custom Ad Network Code (Google AdSense / Adsterra / Popunder)</label>

        <div>
          <span class="text-[10px] text-slate-400 block mb-1">Step 1: Top Ad Slot (728x90 / Responsive)</span>
          <textarea name="step1_top_ad" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] font-mono text-slate-300 focus:outline-none"><?= htmlspecialchars($adSettings['step1_top_ad']) ?></textarea>
        </div>

        <div>
          <span class="text-[10px] text-slate-400 block mb-1">Step 2: Mid Interstitial Ad Slot (300x250)</span>
          <textarea name="step2_mid_ad" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] font-mono text-slate-300 focus:outline-none"><?= htmlspecialchars($adSettings['step2_mid_ad']) ?></textarea>
        </div>

        <div>
          <span class="text-[10px] text-slate-400 block mb-1">Step 3: Final Link Ad Slot</span>
          <textarea name="step3_final_ad" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] font-mono text-slate-300 focus:outline-none"><?= htmlspecialchars($adSettings['step3_final_ad']) ?></textarea>
        </div>
      </div>

      <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition">
        Save AdSlots & Settings
      </button>
    </form>
  </div>

</div>

<?php require_once __DIR__ . '/navbar.php'; ?>

<?php
/**
 * ShortEarn Mobile - UPI Wallet & Withdrawal Transactions
 */
$pageTitle = 'UPI Wallet';
require_once __DIR__ . '/header.php';

$message = '';
$error = '';

// Handle UPI Profile Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_upi') {
    $upiId = clean_input($_POST['upi_id'] ?? '');
    $upiName = clean_input($_POST['upi_name'] ?? '');
    $phone = clean_input($_POST['phone'] ?? '');

    if (empty($upiId)) {
        $error = 'Please provide a valid UPI ID (e.g. yourname@oksbi, phone@paytm).';
    } else {
        $stmt = $db->prepare("UPDATE users SET upi_id = ?, upi_name = ?, phone = ? WHERE id = ?");
        $stmt->execute([$upiId, $upiName, $phone, $currentUser['id']]);
        $currentUser['upi_id'] = $upiId;
        $currentUser['upi_name'] = $upiName;
        $currentUser['phone'] = $phone;
        $message = '✓ UPI payout details updated successfully!';
    }
}

// Handle Withdrawal Request
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
        // Start transaction
        $db->beginTransaction();
        try {
            // Deduct user balance
            $deductStmt = $db->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
            $deductStmt->execute([$amount, $currentUser['id']]);

            // Insert into withdrawals table
            $wStmt = $db->prepare("INSERT INTO withdrawals (user_id, amount, upi_id, status) VALUES (?, ?, ?, 'pending')");
            $wStmt->execute([$currentUser['id'], $amount, $currentUser['upi_id']]);

            $db->commit();
            $currentUser['balance'] -= $amount;
            $message = '✓ Payout request of ' . $adSettings['currency'] . number_format($amount, 2) . ' submitted to Admin!';
        } catch (Exception $e) {
            $db->rollBack();
            $error = 'Transaction failed: ' . $e->getMessage();
        }
    }
}

// Fetch Withdrawal History
$wHistoryStmt = $db->prepare("SELECT * FROM withdrawals WHERE user_id = ? ORDER BY id DESC");
$wHistoryStmt->execute([$currentUser['id']]);
$withdrawals = $wHistoryStmt->fetchAll();
?>

<div class="space-y-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-base font-extrabold text-white">UPI Earnings Wallet</h2>
      <p class="text-xs text-slate-400">Direct instant payouts to GPay, PhonePe & Paytm</p>
    </div>
    <span class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black">
      <i class="fa-solid fa-indian-rupee-sign"></i>
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

  <!-- Balance Hero Card -->
  <div class="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
    <div class="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
      <span>Withdrawable Balance</span>
      <span class="px-2 py-0.5 bg-emerald-500/20 rounded-full text-[10px] uppercase font-mono">Verified UPI</span>
    </div>

    <div class="text-3xl font-black text-white tracking-tight my-2">
      <?= $adSettings['currency'] ?><?= number_format($currentUser['balance'], 2) ?>
    </div>

    <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
      <div>
        <span class="text-slate-400 block text-[11px]">Total Earned</span>
        <span class="font-extrabold text-slate-200"><?= $adSettings['currency'] ?><?= number_format($currentUser['total_earnings'], 2) ?></span>
      </div>
      <div>
        <span class="text-slate-400 block text-[11px]">Total Paid Out</span>
        <span class="font-extrabold text-slate-200"><?= $adSettings['currency'] ?><?= number_format($currentUser['total_withdrawn'], 2) ?></span>
      </div>
    </div>
  </div>

  <!-- Request Payout Card -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-extrabold text-white flex items-center gap-2">
        <i class="fa-solid fa-arrow-up-right-from-square text-emerald-400"></i>
        <span>Request UPI Withdrawal</span>
      </h3>
      <span class="text-[10px] font-bold text-slate-400">
        Min: <?= $adSettings['currency'] ?><?= number_format($adSettings['minWithdrawal'] ?? 50, 0) ?>
      </span>
    </div>

    <form method="POST" action="wallet.php" class="space-y-2.5">
      <input type="hidden" name="action" value="withdraw">

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Enter Amount (<?= $adSettings['currency'] ?>)</label>
        <div class="relative">
          <span class="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs"><?= $adSettings['currency'] ?></span>
          <input 
            type="number" 
            step="1" 
            min="<?= (int)($adSettings['minWithdrawal'] ?? 50) ?>" 
            max="<?= (float)$currentUser['balance'] ?>" 
            name="amount" 
            placeholder="50" 
            required
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold transition"
          >
        </div>
      </div>

      <div class="text-[11px] text-slate-400 flex items-center justify-between">
        <span>Payout Destination:</span>
        <span class="font-mono text-emerald-400 font-bold">
          <?= htmlspecialchars($currentUser['upi_id'] ?: 'Not configured yet') ?>
        </span>
      </div>

      <button 
        type="submit" 
        <?= (empty($currentUser['upi_id']) || $currentUser['balance'] < ($adSettings['minWithdrawal'] ?? 50)) ? 'disabled' : '' ?>
        class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-paper-plane"></i>
        <span>Withdraw to Bank UPI</span>
      </button>
    </form>
  </div>

  <!-- UPI Payout Settings Form -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-gear text-indigo-400 text-xs"></i>
      <h3 class="text-xs font-extrabold text-white">UPI Payment Settings</h3>
    </div>

    <form method="POST" action="wallet.php" class="space-y-2.5">
      <input type="hidden" name="action" value="update_upi">

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Your UPI ID (VPA)</label>
        <input 
          type="text" 
          name="upi_id" 
          value="<?= htmlspecialchars($currentUser['upi_id'] ?? '') ?>" 
          placeholder="e.g. 9876543210@paytm or name@oksbi" 
          required
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition"
        >
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">Account Name</label>
          <input 
            type="text" 
            name="upi_name" 
            value="<?= htmlspecialchars($currentUser['upi_name'] ?? '') ?>" 
            placeholder="Rahul Sharma" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          >
        </div>
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            value="<?= htmlspecialchars($currentUser['phone'] ?? '') ?>" 
            placeholder="9876543210" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          >
        </div>
      </div>

      <button 
        type="submit" 
        class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition"
      >
        Save UPI Settings
      </button>
    </form>
  </div>

  <!-- Payout History -->
  <div class="space-y-2 pt-1">
    <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Withdrawal History</h3>

    <?php if (empty($withdrawals)): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
        No withdrawal requests yet.
      </div>
    <?php else: ?>
      <div class="space-y-2">
        <?php foreach ($withdrawals as $w): ?>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-white">
                <?= $adSettings['currency'] ?><?= number_format($w['amount'], 2) ?>
              </span>
              
              <?php if ($w['status'] === 'approved'): ?>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <i class="fa-solid fa-check mr-1"></i>Approved / Paid
                </span>
              <?php elseif ($w['status'] === 'rejected'): ?>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <i class="fa-solid fa-xmark mr-1"></i>Rejected
                </span>
              <?php else: ?>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                  <i class="fa-solid fa-hourglass mr-1"></i>Pending Review
                </span>
              <?php endif; ?>
            </div>

            <div class="text-[11px] text-slate-400 font-mono">
              UPI: <?= htmlspecialchars($w['upi_id']) ?>
            </div>

            <?php if (!empty($w['utr_number'])): ?>
              <div class="text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-800 text-emerald-400 font-mono">
                Bank UTR Ref: <?= htmlspecialchars($w['utr_number']) ?>
              </div>
            <?php endif; ?>

            <?php if (!empty($w['note'])): ?>
              <div class="text-[10px] text-rose-400">
                Reason: <?= htmlspecialchars($w['note']) ?>
              </div>
            <?php endif; ?>

            <div class="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Requested: <?= date('M d, Y h:i A', strtotime($w['requested_at'])) ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

</div>

<?php require_once __DIR__ . '/navbar.php'; ?>

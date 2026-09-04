<?php
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

// Fetch Link details
$stmt = $db->prepare("SELECT * FROM links WHERE short_code = ? AND active = 1");
$stmt->execute([$code]);
$link = $stmt->fetch();

if (!$link) {
    die("Error: Short link not found or deactivated.");
}

// Fetch Adslots & Timers
$adSettings = $db->query("SELECT * FROM ad_settings WHERE id = 1")->fetch();

// Check if Final Redirect is Triggered
if (isset($_GET['action']) && $_GET['action'] === 'redirect') {
    $visitorIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    // Anti-fraud: Check if same IP already viewed within last 12 hours
    $checkLog = $db->prepare("SELECT id FROM view_logs WHERE link_id = ? AND ip_address = ? AND created_at > NOW() - INTERVAL 12 HOUR");
    $checkLog->execute([$link['id'], $visitorIp]);
    
    if (!$checkLog->fetch()) {
        $earnedPerView = (float)($adSettings['cpm_rate'] / 1000);

        // Credit link owner's wallet & total earnings
        $db->prepare("UPDATE users SET balance = balance + ?, total_earnings = total_earnings + ? WHERE id = ?")
           ->execute([$earnedPerView, $earnedPerView, $link['user_id']]);

        // Increment link view and earnings
        $db->prepare("UPDATE links SET views = views + 1, earnings = earnings + ? WHERE id = ?")
           ->execute([$earnedPerView, $link['id']]);

        // Record verification log
        $db->prepare("INSERT INTO view_logs (link_id, ip_address, earned_amount) VALUES (?, ?, ?)")
           ->execute([$link['id'], $visitorIp, $earnedPerView]);
    }

    // Direct redirect to destination
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
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 select-none font-sans">

  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
    <!-- Progress Header -->
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold text-white">Step <?= $step ?> of 3 Gateway</span>
      </div>
      <span class="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
        3-Step Ads
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style="width: <?= $step * 33.33 ?>%"></div>
    </div>

    <!-- Top AdSlot -->
    <div class="adslot-top">
      <?= ($step === 1) ? $adSettings['step1_top_ad'] : (($step === 2) ? $adSettings['step2_mid_ad'] : $adSettings['step3_top_ad']) ?>
    </div>

    <!-- Countdown Timer Container -->
    <div class="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-center space-y-2">
      <h2 class="text-sm font-bold text-slate-200">
        <?= ($step === 3) ? 'Generating Your Destination Link...' : 'Verifying Link Security...' ?>
      </h2>
      <p class="text-xs text-slate-400">Please wait while the countdown timer completes.</p>
      
      <div id="countdown" class="text-3xl font-black text-amber-400 font-mono tracking-wider">
        00:<?= ($timer < 10) ? '0' . $timer : $timer ?>
      </div>
    </div>

    <!-- Step 2 Anti-Bot Check -->
    <?php if ($step === 2 && $adSettings['enable_captcha']): ?>
      <label class="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
        <div class="flex items-center gap-2.5">
          <input type="checkbox" id="captchaCheck" class="w-4 h-4 accent-indigo-600 rounded">
          <span class="text-xs font-semibold text-slate-200">I am not a robot (Anti-Bot)</span>
        </div>
        <span class="text-xs text-indigo-400">✓ Security</span>
      </label>
    <?php endif; ?>

    <!-- Bottom AdSlot -->
    <div class="adslot-bottom">
      <?= ($step === 1) ? $adSettings['step1_bottom_ad'] : (($step === 3) ? $adSettings['step3_final_ad'] : '') ?>
    </div>

    <!-- Continue / Redirect CTA Button -->
    <?php if ($step < 3): ?>
      <a id="actionBtn" href="step.php?code=<?= urlencode($code) ?>&step=<?= $step + 1 ?>" 
         class="block w-full text-center py-3 bg-slate-800 text-slate-500 font-bold rounded-xl text-xs pointer-events-none transition">
        Locked (Wait <?= $timer ?>s)
      </a>
    <?php else: ?>
      <a id="actionBtn" href="step.php?code=<?= urlencode($code) ?>&action=redirect" 
         class="block w-full text-center py-3.5 bg-slate-800 text-slate-500 font-black rounded-xl text-xs pointer-events-none transition shadow-xl">
        Generating Final Link (Wait <?= $timer ?>s)
      </a>
    <?php endif; ?>
  </div>

  <script>
    let secondsLeft = <?= (int)$timer ?>;
    const countEl = document.getElementById('countdown');
    const btn = document.getElementById('actionBtn');
    const captcha = document.getElementById('captchaCheck');

    const interval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        countEl.innerText = "Ready!";
        checkAndUnlock();
      } else {
        countEl.innerText = "00:" + (secondsLeft < 10 ? '0' : '') + secondsLeft;
      }
    }, 1000);

    function checkAndUnlock() {
      if (captcha && !captcha.checked) {
        btn.innerText = "Please complete anti-bot check above";
        captcha.onchange = checkAndUnlock;
        return;
      }
      btn.classList.remove('bg-slate-800', 'text-slate-500', 'pointer-events-none');
      <?php if ($step < 3): ?>
        btn.classList.add('bg-indigo-600', 'text-white', 'hover:bg-indigo-500', 'cursor-pointer');
        btn.innerText = "Click Here to Continue (Step <?= $step ?>/3) →";
      <?php else: ?>
        btn.classList.add('bg-emerald-500', 'text-slate-950', 'hover:bg-emerald-400', 'cursor-pointer', 'animate-bounce');
        btn.innerText = "Get Final Link (Direct Redirect)";
      <?php endif; ?>
    }
  </script>
</body>
</html>

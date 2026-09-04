<?php
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
        // Generate short code or validate custom alias
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

// Base domain for links
$hostUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . dirname($_SERVER['PHP_SELF']);
?>

<div class="space-y-4">

  <!-- Notification Alerts -->
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

  <!-- Shorten URL Box Card -->
  <div class="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden">
    <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
          <i class="fa-solid fa-link"></i>
        </span>
        <h2 class="text-sm font-extrabold text-white">Shorten & Monetize</h2>
      </div>
      <span class="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
        <?= $adSettings['currency'] ?><?= number_format($adSettings['cpm_rate'], 0) ?> CPM Rate
      </span>
    </div>

    <form method="POST" action="index.php" class="space-y-2.5">
      <input type="hidden" name="action" value="shorten">

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Destination URL (Destination Link)</label>
        <input 
          type="url" 
          name="url" 
          placeholder="https://drive.google.com/file/d/..." 
          required
          class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        >
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">Custom Alias (Optional)</label>
          <input 
            type="text" 
            name="alias" 
            placeholder="e.g. movie-download" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          >
        </div>
        <div>
          <label class="text-[11px] text-slate-400 font-medium block mb-1">Title (Optional)</label>
          <input 
            type="text" 
            name="title" 
            placeholder="e.g. 4K Movie Link" 
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          >
        </div>
      </div>

      <button 
        type="submit" 
        class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
      >
        <i class="fa-solid fa-bolt"></i>
        <span>Create Monetized Short Link</span>
      </button>
    </form>
  </div>

  <!-- Key Stat Cards Grid -->
  <div class="grid grid-cols-2 gap-2.5">
    <!-- Wallet Balance -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <div class="flex items-center justify-between text-slate-400 text-xs">
        <span>Available Balance</span>
        <i class="fa-solid fa-wallet text-emerald-400"></i>
      </div>
      <div class="text-lg font-black text-emerald-400">
        <?= $adSettings['currency'] ?><?= number_format($currentUser['balance'], 2) ?>
      </div>
      <a href="wallet.php" class="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-bold pt-1">
        Withdraw to UPI →
      </a>
    </div>

    <!-- Total Earnings -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <div class="flex items-center justify-between text-slate-400 text-xs">
        <span>Total Earnings</span>
        <i class="fa-solid fa-sack-dollar text-amber-400"></i>
      </div>
      <div class="text-lg font-black text-white">
        <?= $adSettings['currency'] ?><?= number_format($currentUser['total_earnings'], 2) ?>
      </div>
      <div class="text-[10px] text-slate-400 font-medium">
        Withdrawn: <?= $adSettings['currency'] ?><?= number_format($currentUser['total_withdrawn'], 2) ?>
      </div>
    </div>

    <!-- Total Views -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <div class="flex items-center justify-between text-slate-400 text-xs">
        <span>Total Verified Views</span>
        <i class="fa-solid fa-eye text-indigo-400"></i>
      </div>
      <div class="text-lg font-black text-white">
        <?= number_format($stats['total_views']) ?>
      </div>
      <div class="text-[10px] text-emerald-400 font-medium">
        Across <?= number_format($stats['total_links']) ?> links
      </div>
    </div>

    <!-- Active CPM -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
      <div class="flex items-center justify-between text-slate-400 text-xs">
        <span>Publisher CPM</span>
        <i class="fa-solid fa-chart-line text-purple-400"></i>
      </div>
      <div class="text-lg font-black text-purple-400">
        <?= $adSettings['currency'] ?><?= number_format($adSettings['cpm_rate'], 0) ?>
      </div>
      <div class="text-[10px] text-slate-400 font-medium">
        <?= $adSettings['currency'] ?><?= number_format($adSettings['cpm_rate'] / 1000, 3) ?> per click
      </div>
    </div>
  </div>

  <!-- Earnings Live Calculator Card -->
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-calculator text-indigo-400 text-xs"></i>
        <h3 class="text-xs font-bold text-white">Earnings Calculator</h3>
      </div>
      <span id="calcViewsLabel" class="text-xs font-bold text-indigo-400">10,000 Views</span>
    </div>

    <input 
      type="range" 
      id="viewsSlider" 
      min="1000" 
      max="100000" 
      step="1000" 
      value="10000" 
      class="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
    >

    <div class="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
      <span class="text-xs text-slate-400">Estimated Income:</span>
      <span id="calcEarnings" class="text-base font-black text-emerald-400">
        <?= $adSettings['currency'] ?><?= number_format((10000 * $adSettings['cpm_rate']) / 1000, 2) ?>
      </span>
    </div>
  </div>

  <!-- Recent Links Header -->
  <div class="flex items-center justify-between pt-1">
    <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Your Recent Links</h3>
    <a href="links.php" class="text-xs font-bold text-indigo-400 hover:underline">View All →</a>
  </div>

  <!-- Recent Links List -->
  <div class="space-y-2.5">
    <?php if (empty($recentLinks)): ?>
      <div class="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-1">
        <i class="fa-solid fa-link-slash text-slate-600 text-2xl mb-1"></i>
        <p class="text-xs font-bold text-slate-300">No links created yet</p>
        <p class="text-[11px] text-slate-500">Shorten your first URL using the form above to start earning!</p>
      </div>
    <?php else: ?>
      <?php foreach ($recentLinks as $link): 
        $fullShortUrl = rtrim($hostUrl, '/') . '/step.php?code=' . $link['short_code'];
      ?>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-bold text-white truncate">
                <?= htmlspecialchars($link['title'] ?: 'Shortened Link') ?>
              </h4>
              <p class="text-[11px] font-mono text-indigo-400 truncate">
                <?= htmlspecialchars($fullShortUrl) ?>
              </p>
            </div>
            <span class="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg shrink-0">
              <?= $adSettings['currency'] ?><?= number_format($link['earnings'], 2) ?>
            </span>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <div class="flex items-center gap-3">
              <span><i class="fa-regular fa-eye mr-1 text-slate-500"></i><?= number_format($link['views']) ?> views</span>
              <span><i class="fa-regular fa-calendar mr-1 text-slate-500"></i><?= date('d M', strtotime($link['created_at'])) ?></span>
            </div>

            <div class="flex items-center gap-1.5">
              <!-- Copy Button -->
              <button 
                onclick="copyToClipboard('<?= $fullShortUrl ?>')" 
                title="Copy Link" 
                class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Copy</span>
              </button>

              <!-- Test 3-Step Flow Gateway -->
              <a 
                href="step.php?code=<?= urlencode($link['short_code']) ?>" 
                target="_blank" 
                title="Test 3-Step Ads Countdown" 
                class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
              >
                <i class="fa-solid fa-play text-[10px]"></i>
                <span>Test Flow</span>
              </a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>

</div>

<!-- Earnings Slider Script -->
<script>
  const slider = document.getElementById('viewsSlider');
  const viewsLabel = document.getElementById('calcViewsLabel');
  const earningsLabel = document.getElementById('calcEarnings');
  const cpm = <?= (float)$adSettings['cpm_rate'] ?>;
  const currency = "<?= $adSettings['currency'] ?>";

  if (slider) {
    slider.addEventListener('input', (e) => {
      const views = parseInt(e.target.value);
      viewsLabel.innerText = views.toLocaleString() + ' Views';
      const earned = (views * cpm) / 1000;
      earningsLabel.innerText = currency + earned.toFixed(2);
    });
  }
</script>

<?php require_once __DIR__ . '/navbar.php'; ?>

<?php
/**
 * ShortEarn Mobile - My Links Management
 */
$pageTitle = 'My Links';
require_once __DIR__ . '/header.php';

$message = '';
$error = '';

// Handle Delete Link Action
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $deleteId = (int)$_GET['delete'];
    $delStmt = $db->prepare("DELETE FROM links WHERE id = ? AND user_id = ?");
    $delStmt->execute([$deleteId, $currentUser['id']]);
    $message = '✓ Short link deleted successfully.';
}

// Fetch all links of the current user
$stmt = $db->prepare("SELECT * FROM links WHERE user_id = ? ORDER BY id DESC");
$stmt->execute([$currentUser['id']]);
$links = $stmt->fetchAll();

$hostUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . dirname($_SERVER['PHP_SELF']);
?>

<div class="space-y-4">

  <!-- Header with Counter -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-base font-extrabold text-white">My Short Links</h2>
      <p class="text-xs text-slate-400">Manage, share, and track all your links</p>
    </div>
    <span class="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
      <?= count($links) ?> Total Links
    </span>
  </div>

  <?php if ($message): ?>
    <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-400 flex items-center gap-2">
      <i class="fa-solid fa-circle-check"></i>
      <span><?= htmlspecialchars($message) ?></span>
    </div>
  <?php endif; ?>

  <!-- Search Input for Links -->
  <div class="relative">
    <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-500 text-xs"></i>
    <input 
      type="text" 
      id="searchLinkInput" 
      placeholder="Search links by title or code..." 
      class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
      onkeyup="filterLinks()"
    >
  </div>

  <!-- Links List -->
  <div id="linksContainer" class="space-y-3">
    <?php if (empty($links)): ?>
      <div class="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-2">
        <i class="fa-solid fa-link-slash text-slate-600 text-3xl"></i>
        <h4 class="text-sm font-bold text-slate-300">No links generated yet</h4>
        <p class="text-xs text-slate-500">Go to Home to shorten your first link and share it on Telegram, YouTube, or WhatsApp.</p>
        <a href="index.php" class="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
          + Shorten URL Now
        </a>
      </div>
    <?php else: ?>
      <?php foreach ($links as $link): 
        $fullShortUrl = rtrim($hostUrl, '/') . '/step.php?code=' . $link['short_code'];
      ?>
        <div class="link-item bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3" data-search="<?= strtolower(htmlspecialchars($link['title'] . ' ' . $link['short_code'])) ?>">
          
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-bold text-white truncate">
                <?= htmlspecialchars($link['title'] ?: 'Shortened Link') ?>
              </h4>
              <p class="text-[11px] font-mono text-indigo-400 truncate">
                <?= htmlspecialchars($fullShortUrl) ?>
              </p>
              <p class="text-[10px] text-slate-500 truncate mt-0.5" title="<?= htmlspecialchars($link['original_url']) ?>">
                Original: <?= htmlspecialchars($link['original_url']) ?>
              </p>
            </div>
            
            <div class="text-right shrink-0">
              <span class="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg block">
                <?= $adSettings['currency'] ?><?= number_format($link['earnings'], 2) ?>
              </span>
              <span class="text-[10px] text-slate-400 mt-0.5 block">
                <?= number_format($link['views']) ?> views
              </span>
            </div>
          </div>

          <!-- Actions Toolbar -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span class="text-[10px] text-slate-500">
              <i class="fa-regular fa-clock mr-1"></i><?= date('M d, Y', strtotime($link['created_at'])) ?>
            </span>

            <div class="flex items-center gap-1.5">
              <!-- Copy -->
              <button 
                onclick="copyToClipboard('<?= $fullShortUrl ?>')" 
                class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                title="Copy Link"
              >
                <i class="fa-regular fa-copy"></i>
                <span>Copy</span>
              </button>

              <!-- Test 3-Page Flow -->
              <a 
                href="step.php?code=<?= urlencode($link['short_code']) ?>" 
                target="_blank" 
                class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                title="Test 3-Step Flow in new tab"
              >
                <i class="fa-solid fa-play text-[9px]"></i>
                <span>Test Flow</span>
              </a>

              <!-- Delete -->
              <a 
                href="links.php?delete=<?= $link['id'] ?>" 
                onclick="return confirm('Are you sure you want to delete this short link?');"
                class="w-7 h-7 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg flex items-center justify-center text-xs transition"
                title="Delete Link"
              >
                <i class="fa-regular fa-trash-can"></i>
              </a>
            </div>
          </div>

        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>

</div>

<script>
  function filterLinks() {
    const input = document.getElementById('searchLinkInput').value.toLowerCase();
    const items = document.querySelectorAll('.link-item');
    items.forEach(item => {
      const text = item.getAttribute('data-search');
      if (text.includes(input)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
</script>

<?php require_once __DIR__ . '/navbar.php'; ?>

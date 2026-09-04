<?php
/**
 * ShortEarn Mobile - Bottom Navigation Bar Component
 */
$currentPage = basename($_SERVER['PHP_SELF']);
?>
    </main> <!-- End Main Content -->

    <!-- Mobile Bottom Navigation Bar (Fixed) -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2.5 z-40 shadow-2xl flex items-center justify-around">
      
      <!-- 1. Home / Dashboard -->
      <a href="index.php" class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition <?= ($currentPage === 'index.php') ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-house text-base"></i>
        <span class="text-[10px] font-bold tracking-tight">Home</span>
      </a>

      <!-- 2. My Links -->
      <a href="links.php" class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition <?= ($currentPage === 'links.php') ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-link text-base"></i>
        <span class="text-[10px] font-bold tracking-tight">Links</span>
      </a>

      <!-- 3. Wallet (Center Highlighted) -->
      <a href="wallet.php" class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition <?= ($currentPage === 'wallet.php') ? 'text-emerald-400 bg-emerald-600/10' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-wallet text-base"></i>
        <span class="text-[10px] font-bold tracking-tight">Wallet</span>
      </a>

      <!-- 4. Analytics -->
      <a href="analytics.php" class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition <?= ($currentPage === 'analytics.php') ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-chart-pie text-base"></i>
        <span class="text-[10px] font-bold tracking-tight">Stats</span>
      </a>

      <!-- 5. Admin (Conditional) -->
      <?php if (isset($currentUser) && $currentUser['role'] === 'admin'): ?>
        <a href="admin.php" class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl relative transition <?= ($currentPage === 'admin.php') ? 'text-amber-400 bg-amber-600/10' : 'text-slate-400 hover:text-slate-200' ?>">
          <i class="fa-solid fa-sliders text-base"></i>
          <span class="text-[10px] font-bold tracking-tight">Admin</span>
          <?php if (isset($pendingWithdrawalsCount) && $pendingWithdrawalsCount > 0): ?>
            <span class="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <?php endif; ?>
        </a>
      <?php endif; ?>

    </nav>
  </div> <!-- End Mobile Screen Container -->

  <!-- Toast Notification Script -->
  <script>
    function copyToClipboard(text, msg = 'Link copied to clipboard!') {
      navigator.clipboard.writeText(text).then(() => {
        alert('✓ ' + msg);
      }).catch(() => {
        const temp = document.createElement('input');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        alert('✓ ' + msg);
      });
    }
  </script>
</body>
</html>

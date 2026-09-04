<?php
/**
 * ShortEarn Mobile - User Login Page
 */
require_once __DIR__ . '/config.php';

$error = '';
$message = '';

if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = clean_input($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Quick demo login bypass
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

    if (empty($email) || empty($password)) {
        $error = 'Please fill in both email and password.';
    } else {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            header("Location: index.php");
            exit;
        } else {
            $error = 'Invalid email or password.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Login - ShortEarn Mobile</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">

  <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
    
    <div class="text-center space-y-1">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 mx-auto flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/30">
        <i class="fa-solid fa-bolt"></i>
      </div>
      <h1 class="text-lg font-black text-white">ShortEarn Mobile</h1>
      <p class="text-xs text-slate-400">Log in to monetize links & withdraw via UPI</p>
    </div>

    <?php if ($error): ?>
      <div class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-2">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span><?= htmlspecialchars($error) ?></span>
      </div>
    <?php endif; ?>

    <form method="POST" action="login.php" class="space-y-3">
      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Email Address</label>
        <input 
          type="email" 
          name="email" 
          placeholder="user@shortearn.in" 
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        >
      </div>

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Password</label>
        <input 
          type="password" 
          name="password" 
          placeholder="••••••••" 
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        >
      </div>

      <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition">
        Log In
      </button>

      <!-- 1-Click Demo Buttons -->
      <div class="pt-2 border-t border-slate-800 space-y-1.5">
        <span class="text-[10px] text-slate-500 block text-center">Or instant 1-click demo login:</span>
        <div class="grid grid-cols-2 gap-2">
          <button type="submit" name="demo_user" value="1" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold">
            Demo User
          </button>
          <button type="submit" name="demo_admin" value="1" class="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold">
            Demo Admin
          </button>
        </div>
      </div>
    </form>

    <div class="text-center text-xs text-slate-500">
      Don't have an account? <a href="register.php" class="text-indigo-400 font-bold hover:underline">Register</a>
    </div>

  </div>

</body>
</html>

<?php
/**
 * ShortEarn Mobile - User Registration
 */
require_once __DIR__ . '/config.php';

$error = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = clean_input($_POST['name'] ?? '');
    $email = clean_input($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $upiId = clean_input($_POST['upi_id'] ?? '');

    if (empty($name) || empty($email) || empty($password)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address.';
    } else {
        $check = $db->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            $error = 'An account with this email already exists.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO users (name, email, password, upi_id, upi_name) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $hashedPassword, $upiId, $name]);

            $_SESSION['user_id'] = $db->lastInsertId();
            header("Location: index.php");
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Register - ShortEarn Mobile</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">

  <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
    <div class="text-center space-y-1">
      <h1 class="text-lg font-black text-white">Create ShortEarn Account</h1>
      <p class="text-xs text-slate-400">Start monetizing URLs and get paid via UPI</p>
    </div>

    <?php if ($error): ?>
      <div class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-400">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="register.php" class="space-y-3">
      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Full Name</label>
        <input type="text" name="name" placeholder="Rahul Sharma" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Email Address</label>
        <input type="email" name="email" placeholder="rahul@example.com" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">Password</label>
        <input type="password" name="password" placeholder="Create a strong password" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div>
        <label class="text-[11px] text-slate-400 font-medium block mb-1">UPI ID (Optional)</label>
        <input type="text" name="upi_id" placeholder="9876543210@paytm" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition">
        Register Account
      </button>
    </form>

    <div class="text-center text-xs text-slate-500">
      Already have an account? <a href="login.php" class="text-indigo-400 font-bold hover:underline">Log In</a>
    </div>
  </div>

</body>
</html>

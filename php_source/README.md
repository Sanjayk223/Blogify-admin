# ShortEarn Mobile - URL Shortener PHP Script

A complete mobile-first URL shortener platform with:
- **Mobile App View**: Modern mobile viewport with bottom navigation bar (Home, Links, Wallet, Stats, Admin).
- **Monetization Engine**: 3-Page countdown bypass (Step 1 -> Step 2 -> Step 3) with configurable countdown timers and adslots.
- **UPI Wallet & Withdrawals**: Full UPI transaction settings, withdrawal requests with minimum threshold, and admin 1-click approval with bank UTR reference numbers.
- **Role-Based Admin Panel**: Control CPM rates (₹/1000 views), minimum withdrawal threshold, countdown durations, and inject custom ad network script tags (Google AdSense, PropellerAds, Adsterra, etc.).

## 🚀 Quick Setup Instructions

1. **Create Database**:
   - Open phpMyAdmin or your MySQL CLI.
   - Run the SQL queries inside `database.sql` to generate all tables and default ad configurations.

2. **Configure Database Connection**:
   - Open `config.php` and set your MySQL database name, user, and password:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'shortearn_db');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     ```

3. **Upload Files**:
   - Upload all `.php` and `.sql` files into your web hosting `public_html/` folder.

4. **Login / Access**:
   - User Dashboard: `https://yourdomain.com/index.php`
   - Admin Panel: `https://yourdomain.com/admin.php`
   - Short link testing: `https://yourdomain.com/step.php?code=movie2026`

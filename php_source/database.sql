-- =========================================================
-- ShortEarn Mobile URL Shortener - MySQL Database Schema
-- Run this in phpMyAdmin or MySQL CLI
-- =========================================================

CREATE DATABASE IF NOT EXISTS `shortearn_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shortearn_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `upi_id` VARCHAR(100) DEFAULT '',
  `upi_name` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(20) DEFAULT '',
  `balance` DECIMAL(10,2) DEFAULT 0.00,
  `total_earnings` DECIMAL(10,2) DEFAULT 0.00,
  `total_withdrawn` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Shortened Links Table
CREATE TABLE IF NOT EXISTS `links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `original_url` TEXT NOT NULL,
  `short_code` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(255) DEFAULT '',
  `views` INT DEFAULT 0,
  `earnings` DECIMAL(10,2) DEFAULT 0.00,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Adslots & System Settings Table
CREATE TABLE IF NOT EXISTS `ad_settings` (
  `id` INT PRIMARY KEY,
  `currency` VARCHAR(10) DEFAULT '₹',
  `cpm_rate` DECIMAL(10,2) DEFAULT 450.00,
  `min_withdrawal` DECIMAL(10,2) DEFAULT 50.00,
  `step1_timer` INT DEFAULT 10,
  `step2_timer` INT DEFAULT 8,
  `step3_timer` INT DEFAULT 6,
  `enable_popunder` TINYINT(1) DEFAULT 1,
  `enable_captcha` TINYINT(1) DEFAULT 1,
  `step1_top_ad` TEXT,
  `step1_bottom_ad` TEXT,
  `step2_mid_ad` TEXT,
  `step3_top_ad` TEXT,
  `step3_final_ad` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. UPI Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `upi_id` VARCHAR(100) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `utr_number` VARCHAR(100) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `processed_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Visitor Click Tracking Logs (Anti-Fraud)
CREATE TABLE IF NOT EXISTS `view_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `link_id` INT NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `earned_amount` DECIMAL(6,3) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Settings & Demo Accounts
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `upi_id`, `upi_name`, `phone`, `balance`, `total_earnings`)
VALUES 
(1, 'Rahul Sharma', 'user@shortearn.in', '$2y$10$abcdefghijklmnopqrstuv', 'user', 'rahul@oksbi', 'Rahul Sharma', '9876543210', 350.00, 1250.00),
(2, 'Master Admin', 'admin@shortearn.in', '$2y$10$abcdefghijklmnopqrstuv', 'admin', 'admin@upi', 'ShortEarn Admin', '9876500000', 0.00, 0.00)
ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `ad_settings` (`id`, `currency`, `cpm_rate`, `min_withdrawal`, `step1_timer`, `step2_timer`, `step3_timer`, `enable_popunder`, `enable_captcha`, `step1_top_ad`, `step1_bottom_ad`, `step2_mid_ad`, `step3_top_ad`, `step3_final_ad`)
VALUES (
  1, '₹', 450.00, 50.00, 10, 8, 6, 1, 1,
  '<div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center"><span class="text-xs font-bold text-indigo-600">Sponsored Ad (728x90)</span><p class="text-sm font-bold text-slate-800">Earn Daily ₹2000 With ShortEarn Pro</p></div>',
  '<div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center"><span class="text-xs font-bold text-amber-700">Native Ad Banner</span><p class="text-sm font-bold text-amber-900">Play Fantasy Cricket & Win Cash!</p></div>',
  '<div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"><span class="text-xs font-bold text-emerald-700">Interstitial Ad Slot (300x250)</span><p class="text-base font-bold text-emerald-950">Fast Cloud Hosting for PHP Apps</p></div>',
  '<div class="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center"><span class="text-xs font-bold text-purple-700">Sponsored Ad Slot</span><p class="text-sm font-bold text-purple-950">Unlimited 5G Data Recharge Packs</p></div>',
  '<div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center"><span class="text-xs font-bold text-rose-700">Final Link Ad</span><p class="text-sm font-bold text-rose-950">Download Latest Android APK Free</p></div>'
) ON DUPLICATE KEY UPDATE `id`=1;

<?php
/**
 * ShortEarn Mobile - Database Configuration & Helpers
 */
session_start();

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'shortearn_db');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $db = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// Authentication Check
function require_auth() {
    if (!isset($_SESSION['user_id'])) {
        // Default to user ID 1 for demonstration if not logged in
        $_SESSION['user_id'] = 1;
    }
}

// Admin Authorization Check
function require_admin() {
    global $db;
    require_auth();
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user || $user['role'] !== 'admin') {
        die("<h1>403 Forbidden</h1><p>Access Denied: You must be an administrator to view this page.</p>");
    }
}

// Utility: Clean Input
function clean_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

<?php
// auth.php - Session and authentication check

// If not logged in, redirect to login page
if (!isset($_SESSION['user_id'])) {
    echo "<script>window.location.href = '/intern_mou2/login';</script>";
    exit;
}

// Include database connection in authenticated pages
require_once dirname(__FILE__) . '/../config/db.php';
?>

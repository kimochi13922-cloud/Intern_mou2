<?php
// db.php - Database connection for PHP 5.2.6

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'test';

// Use mysqli instead of deprecated mysql_* functions where possible, or stick to mysqli which is supported in 5.2.6
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Ensure utf8 character set
mysqli_set_charset($conn, "utf8");

// Helper function to escape strings for MariaDB
function escape_string($conn, $str) {
    if ($str === null) return 'NULL';
    return "'" . mysqli_real_escape_string($conn, $str) . "'";
}
?>

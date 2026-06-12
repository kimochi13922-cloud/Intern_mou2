<?php
// logout.php - Destroys session and logs out

session_start();
session_destroy();
echo "<script>window.location.href = '/intern_mou2/login';</script>";
exit;
?>



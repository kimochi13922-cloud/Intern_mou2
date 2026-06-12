<?php
// routing.php
// A simple router script to help PHP serve requests correctly

$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// If the requested path is a directory (like /), serve index.php
if ($path == '/' || $path == '') {
    require 'index.php';
} 
// If the requested path corresponds to an actual file (e.g. style.css, mou_add.php)
elseif (file_exists(__DIR__ . $path)) {
    return false; // Let the web server serve the file as-is
} 
// Otherwise, display a basic 404 message or redirect to index.php
else {
    http_response_code(404);
    echo "<h1>404 Not Found</h1>";
    echo "<p>The page you are looking for could not be found.</p>";
    echo "<a href='/index.php'>Return to Dashboard</a>";
}
?>

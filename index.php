<?php
// CORS Headers to allow cross-origin requests (Pass CORS Policy)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle OPTIONS requests (Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

// Main Router (Front Controller)

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Define the base path for this application
$base_path = '/intern_mou2';

// Strip the base path from the request
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Ensure path starts with /
if (empty($path)) {
    $path = '/';
}

// Make path lowercase for case-insensitive routing
$path = strtolower($path);

// Routing rules
$routes = array(
    '/' => 'views/home.php',
    '/home' => 'views/home.php',
    '/login' => 'views/login.php',
    '/logout' => 'views/logout.php',
    '/mou/list' => 'views/mou_list.php',
    '/mou/add' => 'views/mou_add.php',
    '/mou/detail' => 'views/mou_detail.php',
    '/pdf' => 'views/view_pdf.php'
);

if (array_key_exists($path, $routes)) {
    // Execute the corresponding view
    require $routes[$path];
} else {
    // Handle 404 Not Found
    header("HTTP/1.0 404 Not Found");
    echo "<h1>404 Not Found</h1>";
    echo "<p>The requested page ($path) could not be found.</p>";
    echo "<a href='$base_path/'>Return to Dashboard</a>";
}
?>

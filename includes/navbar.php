<?php
// Get the current path from the request URI for active state mapping
$req_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Strip the base path if present
if (strpos($req_path, '/intern_mou2') === 0) {
    $req_path = substr($req_path, strlen('/intern_mou2'));
}
$req_path = rtrim($req_path, '/');
if (empty($req_path)) {
    $req_path = '/';
}
?>
<nav class="sticky top-0 z-50 px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div class="font-sans text-2xl font-bold text-indigo-600 flex items-center gap-2">
        <img src="/intern_mou2/assets/img/ennulogo.png" alt="logo ennu" width="50" height="50">
        MOU Database
    </div>
    <div class="flex gap-6 items-center">
        <a href="/intern_mou2/home" class="font-medium px-4 py-2 rounded-md transition-all duration-200 <?php echo ($req_path == '/' || $req_path == '/home') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'; ?>">หน้าแรก</a>
        <?php if (isset($_SESSION['user_id'])): ?>
        <a href="/intern_mou2/dashboard" class="font-medium px-4 py-2 rounded-md transition-all duration-200 <?php echo ($req_path == '/dashboard') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'; ?>">Dashboard</a>
        <?php endif; ?>
        <a href="/intern_mou2/mou/list" class="font-medium px-4 py-2 rounded-md transition-all duration-200 <?php echo (strpos($req_path, '/mou/') === 0) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'; ?>">รายการ MOU</a>
        <?php if (isset($_SESSION['user_id'])): ?>
        <a href="/intern_mou2/logout" class="bg-red-100 text-red-500 px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-red-500 hover:text-white">ออกจากระบบ</a>
        <?php else: ?>
        <a href="/intern_mou2/login" class="font-medium px-4 py-2 rounded-md transition-all duration-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">เข้าสู่ระบบ</a>
        <?php endif; ?>
    </div>
</nav>

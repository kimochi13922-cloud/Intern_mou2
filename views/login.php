<?php
session_start();
// login.php - Login form for the MOU system

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if ($username === 'test' && $password === 'test') {
        $_SESSION['auth'] = true;
        $_SESSION['user_id'] = 1; // Variable to test account as requested
        echo "<script>window.location.href = '/intern_mou2/';</script>";
        exit;
    } else {
        $error = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
    }
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>เข้าสู่ระบบ - ระบบจัดการฐานข้อมูล MOU</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body class="font-sans antialiased text-slate-900">
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden transform transition-all duration-300">
            <div class="p-8">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-slate-900 font-['Chakra_Petch']">เข้าสู่ระบบ</h2>
                    <p class="text-slate-500 mt-2">ระบบจัดการฐานข้อมูล MOU</p>
                </div>
                
                <?php if ($error): ?>
                <div class="bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold text-sm mb-6 text-center shadow-sm">
                    <?php echo htmlspecialchars($error, ENT_COMPAT, 'UTF-8'); ?>
                </div>
                <?php endif; ?>

                <form method="POST" action="/intern_mou2/login">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-slate-900 mb-2">ชื่อผู้ใช้งาน</label>
                        <input type="text" name="username" class="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white transition-all shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20" required placeholder="Username" value="test">
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-slate-900 mb-2">รหัสผ่าน</label>
                        <input type="password" name="password" class="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white transition-all shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20" required placeholder="Password" value="test">
                    </div>

                    <div class="mt-8">
                        <button type="submit" class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:-translate-y-px">
                            ลงชื่อเข้าใช้
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>

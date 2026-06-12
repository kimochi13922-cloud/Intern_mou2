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
    <link rel="stylesheet" href="/intern_mou2/assets/css/style.css">
</head>
<body>
    <div class="login-wrapper">
        <div class="card login-card fade-up">
            <div class="card-body">
                <div class="text-center mb-8">
                    <h2>เข้าสู่ระบบ</h2>
                    <p class="text-muted mt-2">ระบบจัดการฐานข้อมูล MOU</p>
                </div>
                
                <?php if ($error): ?>
                <div class="badge badge-danger mb-4" style="display: block; text-align: center; padding: 10px;">
                    <?php echo htmlspecialchars($error, ENT_COMPAT, 'UTF-8'); ?>
                </div>
                <?php endif; ?>

                <form method="POST" action="/intern_mou2/login">
                    <div class="form-group">
                        <label class="form-label">ชื่อผู้ใช้งาน</label>
                        <input type="text" name="username" class="form-control" required placeholder="Username" value="test">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">รหัสผ่าน</label>
                        <input type="password" name="password" class="form-control" required placeholder="Password" value="test">
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ลงชื่อเข้าใช้
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>



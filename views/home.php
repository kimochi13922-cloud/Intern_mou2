<?php
session_start();
// index.php - Home page
require_once 'includes/auth.php';
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>หน้าแรก - ระบบจัดการฐานข้อมูล MOU</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <style>
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    </style>
</head>
<body class="font-sans antialiased text-slate-900 bg-slate-50">
    <div class="min-h-screen flex flex-col">
        <?php include 'includes/navbar.php'; ?>

        <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 fade-up">
            
            <!-- Hero Section -->
            <section class="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 md:p-12 relative overflow-hidden mb-8">
                <div class="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100 mb-4">
                    ระบบจัดการฐานข้อมูล MOU
                </div>
                <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-['Chakra_Petch'] leading-tight">
                    ระบบจัดการฐานข้อมูล <span class="text-indigo-600">MOU</span>
                </h1>
                <p class="text-lg text-slate-500 mb-8 max-w-2xl font-light">
                    รวบรวม จัดเก็บ และเผยแพร่ข้อมูล MOU ทั่วทั้งมหาวิทยาลัย
                </p>
                <div class="flex flex-wrap gap-4">
                    <a href="/intern_mou2/mou/list" class="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm rounded-lg text-white bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-px">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        ดู MOU ทั้งหมด
                    </a>
                    <a href="/intern_mou2/mou/add" class="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm rounded-lg text-indigo-600 bg-white border border-slate-200 transition-all hover:bg-slate-50 hover:shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        เพิ่ม MOU
                    </a>
                </div>
            </section>

        </main>
        
        <!-- FOOTER -->
        <footer class="bg-white border-t border-slate-200 p-8 mt-auto">
            <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                <span class="text-indigo-600 font-bold text-lg font-['Chakra_Petch']">ENNU MouHub</span>
                <p class="text-slate-500 text-sm">© 2569 ENNU MOUHub · ศูนย์กลางข้อตกลงคณะวิศวกรรมศาสตร์มหาวิทยาลัยนเรศวร</p>
            </div>
        </footer>
    </div>
</body>
</html>

<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<nav class="navbar">
    <div class="navbar-brand">
        <img src="/intern_mou2/assets/img/ennulogo.png" alt="logo ennu" width="50" height="50">
        MOU Database
    </div>
    <div class="navbar-menu">
        <a href="/intern_mou2/" class="nav-link <?php echo ($current_page == 'dashboard.php') ? 'active' : ''; ?>">หน้าแรก</a>
        <a href="/intern_mou2/mou/list" class="nav-link <?php echo ($current_page == 'mou_list.php' || $current_page == 'mou_detail.php' || $current_page == 'mou_add.php') ? 'active' : ''; ?>">รายการ MOU</a>
        <a href="/intern_mou2/logout" class="btn-logout">ออกจากระบบ</a>
    </div>
</nav>

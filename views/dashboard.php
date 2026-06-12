<?php
session_start();
// index.php - Dashboard page
require_once 'includes/auth.php';
require_once 'config/db.php';

// Total MOUs
$res = mysqli_query($conn, "SELECT COUNT(*) as total FROM mou_data");
$row = mysqli_fetch_assoc($res);
$total_mous = $row['total'];

// Unique Institutions
$res = mysqli_query($conn, "SELECT COUNT(DISTINCT institution) as total FROM mou_data");
$row = mysqli_fetch_assoc($res);
$unique_institutions = $row['total'];

// Total Activities
$res = mysqli_query($conn, "SELECT COUNT(*) as total FROM activity_data");
$row = mysqli_fetch_assoc($res);
$total_activities = $row['total'];

// Fetch MOUs by nation for the map & list
$res = mysqli_query($conn, "SELECT nation, COUNT(*) as count FROM mou_data GROUP BY nation ORDER BY count DESC");
$map_data = array();
$country_list = array();
$total_nations = 0;

while ($row = mysqli_fetch_assoc($res)) {
    $n = $row['nation'];
    $original_n = $n;
    // Handle Thai language names to English for the map to match Highcharts World Map properties
    if ($n === 'ไทย') $n = 'Thailand';
    if ($n === 'จีน') $n = 'China';
    if ($n === 'ญี่ปุ่น') $n = 'Japan';
    if ($n === 'เกาหลีใต้') $n = 'South Korea';
    if ($n === 'ไต้หวัน') $n = 'Taiwan';
    if ($n === 'สหรัฐอเมริกา') $n = 'United States of America';
    if ($n === 'สหราชอาณาจักร') $n = 'United Kingdom';
    if ($n === 'Other' || empty($n)) continue;
    
    $total_nations++;
    $count = (int)$row['count'];
    
    $map_data[] = array(
        'name' => $n,
        'value' => $count
    );
    
    $country_list[] = array(
        'name' => $original_n,
        'count' => $count
    );
}
$map_data_json = json_encode($map_data);

?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>หน้าแรก - ระบบจัดการฐานข้อมูล MOU</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/intern_mou2/assets/css/style.css">
</head>
<body>
    <div class="app-container">
        <?php include 'includes/navbar.php'; ?>

        <main class="main-content fade-up" style="max-width: 1200px; margin: 0 auto; width: 100%;">
            
            <!-- Hero Section -->
            <section class="hero-section hero-bg">
                <div class="hero-tag">ระบบจัดการฐานข้อมูล MOU</div>
                <h1 class="hero-title">ระบบจัดการฐานข้อมูล <span>MOU</span></h1>
                <p class="hero-subtitle">รวบรวม จัดเก็บ และเผยแพร่ข้อมูล MOU ทั่วทั้งมหาวิทยาลัย</p>
                <div class="hero-actions">
                    <a href="/intern_mou2/mou/list" class="btn" style="background: var(--primary); color: white;">
                        <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        ดู MOU ทั้งหมด
                    </a>
                    <a href="/intern_mou2/mou/add" class="btn" style="background: white; color: var(--primary); border: 1px solid var(--border);">
                        <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        เพิ่ม MOU
                    </a>
                </div>
            </section>

            <!-- STATS BAR -->
            <section class="dashboard-grid stats">
                <div class="stat-card bg-indigo-50">
                    <div class="stat-value text-indigo-600"><?php echo $total_mous; ?></div>
                    <div class="stat-label">ข้อตกลงทั้งหมด</div>
                </div>
                <div class="stat-card bg-cyan-50">
                    <div class="stat-value text-cyan-600"><?php echo $unique_institutions; ?></div>
                    <div class="stat-label">สถาบันที่ร่วม</div>
                </div>
                <div class="stat-card bg-pink-50">
                    <div class="stat-value text-pink-600"><?php echo $total_activities; ?></div>
                    <div class="stat-label">กิจกรรมทั้งหมด</div>
                </div>
                <div class="stat-card bg-emerald-50">
                    <div class="stat-value text-emerald-600"><?php echo $total_nations; ?></div>
                    <div class="stat-label">ประเทศทั้งหมด</div>
                </div>
            </section>

            <!-- HIGHCHARTS MAP & COUNTRY LIST -->
            <section class="dashboard-grid map-section">
                <!-- Map -->
                <div class="card" style="padding: 1rem; position: relative;">
                    <button onclick="window.location.reload();" class="btn" style="position: absolute; top: 1rem; right: 1rem; z-index: 10; padding: 0.5rem 1rem; font-size: 0.875rem; background: white; color: var(--text-main); border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                        <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        รีโหลดข้อมูล
                    </button>
                    <div id="map-container" style="height: 500px; width: 100%;"></div>
                </div>

                <!-- Country List -->
                <div class="card" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
                        <h3 style="font-family: 'Chakra Petch', sans-serif; font-size: 1.125rem;">จำนวนตามประเทศ</h3>
                        <span style="background: #eef2ff; color: #4338ca; padding: 0.25rem 0.5rem; border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 700;">
                            <?php echo count($country_list); ?> ประเทศ
                        </span>
                    </div>
                    
                    <div class="country-list-container">
                        <div class="country-list">
                            <?php if (empty($country_list)): ?>
                                <div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">ไม่มีข้อมูล</div>
                            <?php else: ?>
                                <?php foreach ($country_list as $index => $country): ?>
                                    <div class="country-item">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <div class="country-rank"><?php echo $index + 1; ?></div>
                                            <span class="country-name"><?php echo htmlspecialchars($country['name']); ?></span>
                                        </div>
                                        <span class="country-count"><?php echo $country['count']; ?></span>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- FOOTER -->
        <footer style="background: white; border-top: 1px solid var(--border); padding: 2rem; margin-top: auto;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
                <span style="color: var(--primary); font-weight: 700; font-size: 1.125rem; font-family: 'Chakra Petch', sans-serif;">ENNU MouHub</span>
                <p style="color: var(--text-muted); font-size: 0.875rem;">© 2569 ENNU MOUHub · ศูนย์กลางข้อตกลงคณะวิศวกรรมศาสตร์มหาวิทยาลัยนเรศวร</p>
            </div>
        </footer>
    </div>
    
    <script src="js/highmaps.js"></script>
    <script src="js/world.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const data = <?php echo $map_data_json; ?>;

            Highcharts.mapChart('map-container', {
                chart: {
                    map: 'custom/world',
                    backgroundColor: 'transparent'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    min: 1,
                    minColor: '#eef2ff',
                    maxColor: '#4f46e5'
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b><br/>จำนวน MOU: {point.value}'
                },
                series: [{
                    data: data,
                    joinBy: ['name', 'name'],
                    name: 'MOUs',
                    states: {
                        hover: {
                            color: '#3730a3'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}'
                    }
                }]
            });
        });
    </script>
</body>
</html>




<?php
session_start();
// dashboard.php - Dashboard page
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

// Type counts
$res_mou = mysqli_query($conn, "SELECT COUNT(*) as total FROM mou_data WHERE type = 'MOU' OR type = '' OR type IS NULL");
$row_mou = mysqli_fetch_assoc($res_mou);
$total_type_mou = $row_mou['total'];

$res_moa = mysqli_query($conn, "SELECT COUNT(*) as total FROM mou_data WHERE type = 'MOA'");
$row_moa = mysqli_fetch_assoc($res_moa);
$total_type_moa = $row_moa['total'];

$res_loi = mysqli_query($conn, "SELECT COUNT(*) as total FROM mou_data WHERE type = 'LOI'");
$row_loi = mysqli_fetch_assoc($res_loi);
$total_type_loi = $row_loi['total'];

$res_loa = mysqli_query($conn, "SELECT COUNT(*) as total FROM mou_data WHERE type = 'LOA'");
$row_loa = mysqli_fetch_assoc($res_loa);
$total_type_loa = $row_loa['total'];

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

// Fetch MOUs by year from period
$res_year = mysqli_query($conn, "
    SELECT SUBSTRING_INDEX(period, '-', 1) as year, COUNT(*) as count 
    FROM mou_data 
    WHERE period IS NOT NULL AND period != '' AND period != '0000-00-00'
    GROUP BY year 
    ORDER BY year ASC
");
$year_labels = array();
$year_data = array();
if ($res_year) {
    while ($row_year = mysqli_fetch_assoc($res_year)) {
        $y = intval($row_year['year']);
        if ($y > 0) {
            $th_year = $y < 2500 ? $y + 543 : $y;
            $year_labels[] = (string)$th_year;
            $year_data[] = (int)$row_year['count'];
        }
    }
}
$year_labels_json = json_encode($year_labels);
$year_data_json = json_encode($year_data);

// Fetch Inbound/Outbound activities
$res_inbound = mysqli_query($conn, "SELECT COUNT(*) as total FROM activity_data WHERE activities_type = 'Inbound'");
$row_inbound = mysqli_fetch_assoc($res_inbound);
$total_inbound = $row_inbound['total'];

$res_outbound = mysqli_query($conn, "SELECT COUNT(*) as total FROM activity_data WHERE activities_type = 'Outbound'");
$row_outbound = mysqli_fetch_assoc($res_outbound);
$total_outbound = $row_outbound['total'];

?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - ระบบจัดการฐานข้อมูล MOU</title>
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
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body class="font-sans antialiased text-slate-900 bg-slate-50">
    <div class="min-h-screen flex flex-col">
        <?php include 'includes/navbar.php'; ?>

        <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 fade-up">
            
            <!-- NEW CUSTOM DASHBOARD LAYOUT -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <!-- Left Card: Overview -->
                <div class="bg-gradient-to-br from-[#6c2ff3] to-[#4614d9] rounded-3xl text-white p-8 flex flex-col justify-center items-center text-center shadow-[0_10px_25px_rgba(108,47,243,0.4)] h-full">
                    <div class="text-lg font-medium opacity-90 mb-6 font-['Chakra_Petch']">เอกสารความร่วมมือทั้งหมด</div>
                    <div class="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-['Chakra_Petch']"><?php echo $total_mous; ?></div>
                    
                    <div class="flex flex-col items-center gap-3">
                        <div class="flex items-center gap-3 text-base opacity-90">
                            <div class="w-3 h-3 rounded-sm bg-yellow-300"></div>
                            <span><?php echo $unique_institutions; ?> หน่วยงาน</span>
                        </div>
                        <div class="flex items-center gap-3 text-base opacity-90">
                            <div class="w-3 h-3 rounded-sm bg-white"></div>
                            <span><?php echo $total_activities; ?> กิจกรรม</span>
                        </div>
                        <div class="flex items-center gap-3 text-base opacity-90">
                            <div class="w-3 h-3 rounded-sm bg-pink-400"></div>
                            <span><?php echo $total_nations; ?> ประเทศ</span>
                        </div>
                    </div>
                    
        
                </div>

                <!-- Right Side: Document Types Grid -->
                <div class="lg:col-span-2">
                    <h2 class="text-2xl font-bold mb-6 text-slate-900">ประเภทเอกสาร (Document Types)</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <!-- Card 1: MOU -->
                        <div class="bg-slate-100 rounded-3xl p-6 relative flex flex-col border border-slate-200 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-semibold text-slate-900 text-lg font-['Chakra_Petch']">เอกสาร MOU</span>
                                <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">MOU</span>
                            </div>
                            <div class="flex justify-center items-center flex-1 mb-6">
                                <span class="text-center text-6xl font-bold text-slate-900 font-['Chakra_Petch']"><?php echo $total_type_mou; ?></span>
                            </div>
                        </div>

                        <!-- Card 2: MOA -->
                        <div class="bg-slate-100 rounded-3xl p-6 relative flex flex-col border border-slate-200 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-semibold text-slate-900 text-lg font-['Chakra_Petch']">เอกสาร MOA</span>
                                <span class="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">MOA</span>
                            </div>
                            <div class="flex justify-center items-center flex-1 mb-6">
                                <span class="text-center text-6xl font-bold text-slate-900 font-['Chakra_Petch']"><?php echo $total_type_moa; ?></span>
                            </div>
                        </div>

                        <!-- Card 3: LOI -->
                        <div class="bg-slate-100 rounded-3xl p-6 relative flex flex-col border border-slate-200 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-semibold text-slate-900 text-lg font-['Chakra_Petch']">เอกสาร LOI</span>
                                <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">LOI</span>
                            </div>
                            <div class="flex justify-center items-center flex-1 mb-6">
                                <span class="text-center text-6xl font-bold text-slate-900 font-['Chakra_Petch']"><?php echo $total_type_loi; ?></span>
                            </div>
                        </div>

                        <!-- Card 4: LOA -->
                        <div class="bg-slate-100 rounded-3xl p-6 relative flex flex-col border border-slate-200 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-semibold text-slate-900 text-lg font-['Chakra_Petch']">เอกสาร LOA</span>
                                <span class="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">LOA</span>
                            </div>
                            <div class="flex justify-center items-center flex-1 mb-6">
                                <span class="text-center text-6xl font-bold text-slate-900 font-['Chakra_Petch']"><?php echo $total_type_loa; ?></span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- STATISTICS SECTION (YEAR CHART & INBOUND/OUTBOUND) -->
            <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-up" style="animation-delay: 0.1s;">
                <!-- Year Chart (Left, spans 2 cols) -->
                <div class="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
                    <h2 class="font-['Chakra_Petch'] text-xl font-bold text-slate-900 mb-6">สถิติ MOU ในแต่ละปี</h2>
                    <div class="w-full h-[300px]">
                        <canvas id="yearChart"></canvas>
                    </div>
                </div>
                
                <!-- Inbound/Outbound (Right, spans 1 col) -->
                <div class="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 flex flex-col justify-center relative overflow-hidden">
                    <!-- Decorative Background element -->
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50"></div>
                    
                    <h2 class="font-['Chakra_Petch'] text-xl font-bold text-slate-900 mb-8 relative z-10">รูปแบบกิจกรรม (Activity Types)</h2>
                    
                    <div class="space-y-5 relative z-10">
                        <div class="bg-blue-50/80 rounded-2xl p-5 border border-blue-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-sm">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-lg">Inbound</span>
                            </div>
                            <span class="text-3xl font-black text-blue-700 font-['Chakra_Petch']"><?php echo $total_inbound; ?></span>
                        </div>
                        
                        <div class="bg-amber-50/80 rounded-2xl p-5 border border-amber-100 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-sm">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-lg">Outbound</span>
                            </div>
                            <span class="text-3xl font-black text-amber-700 font-['Chakra_Petch']"><?php echo $total_outbound; ?></span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- HIGHCHARTS MAP & COUNTRY LIST -->
            <section class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <!-- Map -->
                <div class="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative p-4 transition-all duration-300 hover:shadow-xl">
                    <button onclick="window.location.reload();" class="absolute top-4 right-4 z-10 px-4 py-2 text-sm bg-white text-slate-900 border border-slate-200 shadow-sm rounded-lg flex items-center gap-2 hover:bg-slate-50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        รีโหลดข้อมูล
                    </button>
                    <div id="map-container" class="h-[500px] w-full"></div>
                </div>

                <!-- Country List -->
                <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col transition-all duration-300 hover:shadow-xl">
                    <div class="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
                        <h3 class="font-['Chakra_Petch'] text-lg font-bold text-slate-900">จำนวนตามประเทศ</h3>
                        <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold">
                            <?php echo count($country_list); ?> ประเทศ
                        </span>
                    </div>
                    
                    <div class="h-[430px] flex flex-col">
                        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <?php if (empty($country_list)): ?>
                                <div class="text-center text-slate-500 py-8">ไม่มีข้อมูล</div>
                            <?php else: ?>
                                <?php foreach ($country_list as $index => $country): ?>
                                    <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-3 transition-colors hover:bg-indigo-50">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700"><?php echo $index + 1; ?></div>
                                            <span class="font-medium text-slate-900"><?php echo htmlspecialchars($country['name']); ?></span>
                                        </div>
                                        <span class="font-bold text-indigo-600 bg-white px-3 py-1 rounded-md shadow-sm border border-indigo-100"><?php echo $country['count']; ?></span>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
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
    
    <script src="js/highmaps.js"></script>
    <script src="js/world.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Chart.js Year Chart
            const ctx = document.getElementById('yearChart');
            if (ctx) {
                let gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 350);
                gradient.addColorStop(0, 'rgba(108, 47, 243, 0.8)');
                gradient.addColorStop(1, 'rgba(108, 47, 243, 0.1)');

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: <?php echo $year_labels_json; ?>,
                        datasets: [{
                            label: 'จำนวน MOU',
                            data: <?php echo $year_data_json; ?>,
                            backgroundColor: gradient,
                            borderColor: '#6c2ff3',
                            borderWidth: 1,
                            borderRadius: 6,
                            barThickness: 'flex',
                            maxBarThickness: 50
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                titleFont: { family: "'Chakra Petch', sans-serif", size: 14 },
                                bodyFont: { family: "'Google Sans', sans-serif", size: 13 },
                                padding: 12,
                                cornerRadius: 8,
                                displayColors: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { precision: 0, font: { family: "'Google Sans', sans-serif" } },
                                grid: { borderDash: [4, 4], color: '#e2e8f0' }
                            },
                            x: {
                                ticks: { font: { family: "'Chakra Petch', sans-serif", size: 13 } },
                                grid: { display: false }
                            }
                        }
                    }
                });
            }

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

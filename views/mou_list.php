<?php
session_start();
// mou_list.php - List of all MOUs
require_once 'includes/auth.php';
require_once 'config/db.php';

// Fetch all MOUs
$query = "SELECT ID, name, institution, contact, staff, period, status, type, country_check, sign_date, notice_date, approval_date FROM mou_data ORDER BY ID DESC";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>รายการ MOU - ระบบจัดการฐานข้อมูล MOU</title>
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

        <main class="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 fade-up">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900 font-['Chakra_Petch']">รายการข้อมูล MOU</h2>
                    <p class="text-slate-500 mt-2">จัดการข้อมูล MOU ในระบบ</p>
                </div>
                <a href="/intern_mou2/mou/add" class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors shadow-sm">
                    + เพิ่ม MOU ใหม่
                </a>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 p-4 md:p-5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div class="lg:col-span-2">
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ค้นหา (ชื่อ / สถาบัน / ผู้ประสานงาน / ผู้รับผิดชอบ)</label>
                        <input type="text" id="searchInput" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="พิมพ์คำค้นหา..." onkeyup="filterTable()">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ขอบเขต</label>
                        <select id="typeFilter" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" onchange="filterTable()">
                            <option value="">ทั้งหมด</option>
                            <option value="ภายในประเทศ">ภายในประเทศ</option>
                            <option value="ต่างประเทศ">ต่างประเทศ</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ประเภทเอกสาร</label>
                        <select id="mouTypeFilter" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" onchange="filterTable()">
                            <option value="">ทั้งหมด</option>
                            <option value="MOU">MOU</option>
                            <option value="MOA">MOA</option>
                            <option value="LOI">LOI</option>
                            <option value="LOA">LOA</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">สถานะ</label>
                        <div class="flex gap-2">
                            <select id="statusFilter" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" onchange="filterTable()">
                                <option value="">ทั้งหมด</option>
                                <option value="สำเร็จ">สำเร็จ</option>
                                <option value="รอดำเนินการ">รอดำเนินการ</option>
                                <option value="ยังไม่ได้ดำเนินการ">ยังไม่ได้ดำเนินการ</option>
                            </select>
                            <button class="px-3 py-2.5 text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors flex-shrink-0" onclick="resetFilters()" title="ล้างตัวกรอง">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-sm text-slate-500 font-medium mb-4 px-2">
                แสดง <span id="visibleCount" class="text-indigo-600"><?php echo mysqli_num_rows($result); ?></span> จาก <?php echo mysqli_num_rows($result); ?> รายการ
            </div>

            <!-- Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="overflow-x-auto w-full">
                    <table class="w-full text-left text-sm whitespace-nowrap table">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200">
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">ลำดับ</th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(1)">ชื่อ <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(2)">สถาบันที่ร่วม <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(3)">ผู้ประสานงาน <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(4)">ผู้รับผิดชอบ <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(5)">ประเภทเอกสาร <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(6)">ขอบเขต <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-center cursor-pointer hover:bg-slate-100 transition-colors" onclick="sortTable(7)">สถานะ <span class="sort-icon opacity-40 ml-1">&#8597;</span></th>
                                <th class="px-4 py-4"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php if (mysqli_num_rows($result) === 0): ?>
                                <tr>
                                    <td colspan="9" class="px-4 py-8 text-center text-slate-500">ไม่พบข้อมูล</td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $counter = 1;
                                while ($row = mysqli_fetch_assoc($result)): 
                                ?>
                                <tr class="hover:bg-indigo-50/50 transition-colors">
                                    <td class="px-4 py-3 text-slate-500 font-medium"><?php echo $counter++; ?></td>
                                    <td class="px-4 py-3">
                                        <div class="font-semibold text-slate-900 max-w-[250px] truncate" title="<?php echo htmlspecialchars($row['name'], ENT_COMPAT, 'UTF-8'); ?>">
                                            <?php echo htmlspecialchars($row['name'], ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600">
                                        <div class="max-w-[200px] truncate" title="<?php echo htmlspecialchars($row['institution'], ENT_COMPAT, 'UTF-8'); ?>">
                                            <?php echo htmlspecialchars($row['institution'], ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-500">
                                        <div class="max-w-[150px] truncate">
                                            <?php echo htmlspecialchars($row['contact'] ? $row['contact'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-500">
                                        <div class="max-w-[150px] truncate">
                                            <?php echo htmlspecialchars($row['staff'] ? $row['staff'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600 font-medium">
                                        <div class="max-w-[150px] truncate">
                                            <?php echo htmlspecialchars($row['type'] ? $row['type'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600">
                                        <?php 
                                            if ($row['country_check'] == 'Inside') echo 'ภายในประเทศ';
                                            elseif ($row['country_check'] == 'InsideSpecial') echo 'ภายในประเทศ (เฉพาะกิจ)';
                                            elseif ($row['country_check'] == 'Outside') echo 'ต่างประเทศ';
                                            else echo 'พิเศษ';
                                        ?>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <?php 
                                        $computed_status = "รอดำเนินการ";
                                        $statusClass = "bg-amber-100 text-amber-800";
                                        
                                        if (!empty($row['sign_date']) || !empty($row['notice_date'])) {
                                            $computed_status = "สำเร็จ";
                                            $statusClass = "bg-emerald-100 text-emerald-800";
                                        } elseif (empty($row['approval_date'])) {
                                            $computed_status = "ยังไม่ได้ดำเนินการ";
                                            $statusClass = "bg-red-100 text-red-800";
                                        } else {
                                            $computed_status = "รอดำเนินการ";
                                            $statusClass = "bg-amber-100 text-amber-800";
                                        }
                                        ?>
                                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold <?php echo $statusClass; ?>">
                                            <?php echo $computed_status; ?>
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <a href="/intern_mou2/mou/detail?id=<?php echo $row['ID']; ?>" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                                            ดูรายละเอียด
                                        </a>
                                    </td>
                                </tr>
                                <?php endwhile; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            
        </main>
    </div>

    <script>
    const sortDirections = {};
    function sortTable(n) {
        const table = document.querySelector(".table");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        
        dir = sortDirections[n] === "asc" ? "desc" : "asc";
        sortDirections[n] = dir;
        
        const headers = table.querySelectorAll("th");
        headers.forEach(th => {
            const icon = th.querySelector(".sort-icon");
            if (icon) {
                icon.innerHTML = "&#8597;";
                icon.classList.replace('opacity-100', 'opacity-40');
            }
        });
        
        const currentIcon = headers[n].querySelector(".sort-icon");
        if (currentIcon) {
            currentIcon.innerHTML = dir === "asc" ? "&#8593;" : "&#8595;";
            currentIcon.classList.replace('opacity-40', 'opacity-100');
        }

        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                
                if (!x || !y) continue;
                
                let cmpX = x.innerText.toLowerCase().trim();
                let cmpY = y.innerText.toLowerCase().trim();

                if (dir === "asc") {
                    if (cmpX > cmpY) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (cmpX < cmpY) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            }
        }
    }

    function filterTable() {
        const searchVal = document.getElementById("searchInput").value.toLowerCase();
        const typeVal = document.getElementById("typeFilter").value.toLowerCase();
        const mouTypeVal = document.getElementById("mouTypeFilter").value.toLowerCase();
        const statusVal = document.getElementById("statusFilter").value.toLowerCase();
        
        const table = document.querySelector(".table");
        const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        let count = 0;
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].cells.length === 1) continue; // skip "No data" row
            
            let name = rows[i].cells[1].innerText.toLowerCase();
            let inst = rows[i].cells[2].innerText.toLowerCase();
            let contact = rows[i].cells[3].innerText.toLowerCase();
            let staff = rows[i].cells[4].innerText.toLowerCase();
            let mouType = rows[i].cells[5].innerText.toLowerCase();
            let type = rows[i].cells[6].innerText.toLowerCase();
            let status = rows[i].cells[7].innerText.toLowerCase();
            
            let matchSearch = (name.includes(searchVal) || inst.includes(searchVal) || contact.includes(searchVal) || staff.includes(searchVal));
            let matchType = (typeVal === "" || type.includes(typeVal));
            let matchMouType = (mouTypeVal === "" || mouType.includes(mouTypeVal));
            let matchStatus = (statusVal === "" || status.includes(statusVal));
            
            if (matchSearch && matchType && matchMouType && matchStatus) {
                rows[i].style.display = "";
                count++;
            } else {
                rows[i].style.display = "none";
            }
        }
        
        document.getElementById("visibleCount").innerText = count;
    }

    function resetFilters() {
        document.getElementById("searchInput").value = "";
        document.getElementById("typeFilter").value = "";
        document.getElementById("mouTypeFilter").value = "";
        document.getElementById("statusFilter").value = "";
        filterTable();
    }
    </script>
</body>
</html>

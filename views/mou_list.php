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
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/intern_mou2/assets/css/style.css">
</head>
<body>
    <div class="app-container">
        <?php include 'includes/navbar.php'; ?>

        <main class="main-content fade-up">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2>รายการข้อมูล MOU</h2>
                    <p class="text-muted mt-2">จัดการข้อมูล MOU ในระบบ</p>
                </div>
                <a href="/intern_mou2/mou/add" class="btn btn-primary">
                    + เพิ่ม MOU ใหม่
                </a>
            </div>

            <div class="card mb-4" style="padding: 0.75rem 1.25rem;">
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end;">
                    <div style="flex: 1; min-width: 200px;">
                        <label class="form-label" style="margin-bottom: 0.25rem; font-size: 0.75rem; color: #64748b;">ค้นหา (ชื่อ / สถาบัน / ผู้ประสานงาน / ผู้รับผิดชอบ)</label>
                        <input type="text" id="searchInput" class="form-control" style="padding: 0.4rem 0.75rem; font-size: 0.875rem;" placeholder="พิมพ์คำค้นหา..." onkeyup="filterTable()">
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label" style="margin-bottom: 0.25rem; font-size: 0.75rem; color: #64748b;">ขอบเขต</label>
                        <select id="typeFilter" class="form-control" style="padding: 0.4rem 0.75rem; font-size: 0.875rem;" onchange="filterTable()">
                            <option value="">ทั้งหมด</option>
                            <option value="ภายในประเทศ">ภายในประเทศ</option>
                            <option value="ต่างประเทศ">ต่างประเทศ</option>
        
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label" style="margin-bottom: 0.25rem; font-size: 0.75rem; color: #64748b;">ประเภทเอกสาร</label>
                        <select id="mouTypeFilter" class="form-control" style="padding: 0.4rem 0.75rem; font-size: 0.875rem;" onchange="filterTable()">
                            <option value="">ทั้งหมด</option>
                            <option value="MOU">MOU</option>
                            <option value="MOA">MOA</option>
                            <option value="LOI">LOI</option>
                            <option value="LOA">LOA</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label" style="margin-bottom: 0.25rem; font-size: 0.75rem; color: #64748b;">สถานะ</label>
                        <select id="statusFilter" class="form-control" style="padding: 0.4rem 0.75rem; font-size: 0.875rem;" onchange="filterTable()">
                            <option value="">ทั้งหมด</option>
                            <option value="สำเร็จ">สำเร็จ</option>
                            <option value="รอดำเนินการ">รอดำเนินการ</option>
                            <option value="ยังไม่ได้ดำเนินการ">ยังไม่ได้ดำเนินการ</option>
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.75rem; font-size: 0.875rem;" onclick="resetFilters()">
                            <svg style="width: 1rem; height: 1rem; display: inline-block; vertical-align: text-top; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            ล้างตัวกรอง
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-muted mb-4" style="font-size: 0.875rem; color: #64748b; font-weight: 500;">
                แสดง <span id="visibleCount"><?php echo mysqli_num_rows($result); ?></span> จาก <?php echo mysqli_num_rows($result); ?> รายการ
            </div>

            <div class="card">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th style="cursor: pointer;" onclick="sortTable(1)">ชื่อ <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer;" onclick="sortTable(2)">สถาบันที่ร่วม <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer;" onclick="sortTable(3)">ผู้ประสานงาน <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer;" onclick="sortTable(4)">ผู้รับผิดชอบ <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer;" onclick="sortTable(5)">ประเภทเอกสาร <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer;" onclick="sortTable(6)">ขอบเขต <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th style="cursor: pointer; text-align: center;" onclick="sortTable(7)">สถานะ <span class="sort-icon" style="opacity: 0.4;">&#8597;</span></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (mysqli_num_rows($result) === 0): ?>
                                <tr>
                                    <td colspan="8" class="text-center">ไม่พบข้อมูล</td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $counter = 1;
                                while ($row = mysqli_fetch_assoc($result)): 
                                ?>
                                <tr>
                                    <td><?php echo $counter++; ?></td>
                                    <td>
                                        <div style="margin: 0 auto; font-weight: 600; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="<?php echo htmlspecialchars($row['name'], ENT_COMPAT, 'UTF-8'); ?>">
                                            <?php echo htmlspecialchars($row['name'], ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td style="color: #64748b;">
                                        <div style="margin: 0 auto; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            <?php echo htmlspecialchars($row['institution'], ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td style="color: #64748b;">
                                        <div style="margin: 0 auto; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            <?php echo htmlspecialchars($row['contact'] ? $row['contact'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td style="color: #64748b;">
                                        <div style="margin: 0 auto; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            <?php echo htmlspecialchars($row['staff'] ? $row['staff'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td style="color: #64748b;">
                                        <div style="margin: 0 auto; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            <?php echo htmlspecialchars($row['type'] ? $row['type'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                                        </div>
                                    </td>
                                    <td style="color: #64748b;">
                                        <?php 
                                            if ($row['country_check'] == 'Inside') echo 'ภายในประเทศ';
                                            elseif ($row['country_check'] == 'InsideSpecial') echo 'ภายในประเทศ (เฉพาะกิจ)';
                                            elseif ($row['country_check'] == 'Outside') echo 'ต่างประเทศ';
                                            else echo 'พิเศษ';
                                        ?>
                                    </td>
                                    <td style="text-align: center;">
                                        <?php 
                                        $computed_status = "รอดำเนินการ";
                                        $statusClass = "badge-warning";
                                        
                                        if (!empty($row['sign_date']) || !empty($row['notice_date'])) {
                                            $computed_status = "สำเร็จ";
                                            $statusClass = "badge-success";
                                        } elseif (empty($row['approval_date'])) {
                                            $computed_status = "ยังไม่ได้ดำเนินการ";
                                            $statusClass = "badge-danger";
                                        } else {
                                            $computed_status = "รอดำเนินการ";
                                            $statusClass = "badge-warning";
                                        }
                                        ?>
                                        <span class="badge <?php echo $statusClass; ?>">
                                            <?php echo $computed_status; ?>
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <a href="/intern_mou2/mou/detail?id=<?php echo $row['ID']; ?>" style="color: var(--primary); font-weight: 600; font-size: 0.875rem; text-decoration: none;">
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
                icon.style.opacity = "0.4";
            }
        });
        
        const currentIcon = headers[n].querySelector(".sort-icon");
        if (currentIcon) {
            currentIcon.innerHTML = dir === "asc" ? "&#8593;" : "&#8595;";
            currentIcon.style.opacity = "1";
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




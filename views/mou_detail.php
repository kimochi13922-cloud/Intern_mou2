<?php
session_start();
// mou_detail.php - View MOU details and manage activities
require_once 'includes/auth.php';
require_once 'config/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    header("Location: /intern_mou2/mou/list");
    exit;
}

// Fetch MOU data
$query = "SELECT * FROM mou_data WHERE ID = $id";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) === 0) {
    echo "ไม่พบข้อมูล MOU";
    exit;
}

$mou = mysqli_fetch_assoc($result);

// Fetch activities
$act_query = "SELECT * FROM activity_data WHERE ownerid = $id ORDER BY mouid DESC";
$act_result = mysqli_query($conn, $act_query);

// Fetch all images for these activities
$img_query = "SELECT ai.id, ai.activity_id, ai.image_data FROM activity_images ai 
              JOIN activity_data a ON ai.activity_id = a.mouid 
              WHERE a.ownerid = $id";
$img_result = mysqli_query($conn, $img_query);
$activity_images = array();
if ($img_result) {
    while ($row = mysqli_fetch_assoc($img_result)) {
        $activity_images[$row['activity_id']][] = $row;
    }
}

// List of nations for dropdown
$nations = array('Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Timor-Leste', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe');
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>รายละเอียด MOU - ระบบจัดการฐานข้อมูล MOU</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/intern_mou2/assets/css/style.css">
    <script>
        function toggleAddActivity() {
            var form = document.getElementById('add-activity-form');
            if (form.style.display === 'none' || form.style.display === '') {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        }
        function toggleEditActivity(id) {
            var view = document.getElementById('activity-view-' + id);
            var edit = document.getElementById('activity-edit-' + id);
            if (edit.style.display === 'none' || edit.style.display === '') {
                view.style.display = 'none';
                edit.style.display = 'flex';
            } else {
                view.style.display = 'flex';
                edit.style.display = 'none';
            }
        }

        function toggleMouEdit() {
            var view = document.getElementById('mou-view-state');
            var edit = document.getElementById('mou-edit-state');
            if (edit.style.display === 'none' || edit.style.display === '') {
                view.style.display = 'none';
                edit.style.display = 'block';
            } else {
                view.style.display = 'flex';
                edit.style.display = 'none';
            }
        }

        function toggleTitleEdit() {
            var viewState = document.getElementById('title-view-state');
            var editState = document.getElementById('title-edit-state');
            if (viewState.style.display === 'none') {
                viewState.style.display = 'block';
                editState.style.display = 'none';
            } else {
                viewState.style.display = 'none';
                editState.style.display = 'block';
            }
        }

        function toggleNotesEdit() {
            var viewState = document.getElementById('notes-view-state');
            var editState = document.getElementById('notes-edit-state');
            if (viewState.style.display === 'none') {
                viewState.style.display = 'block';
                editState.style.display = 'none';
            } else {
                viewState.style.display = 'none';
                editState.style.display = 'block';
            }
        }

        let isTimelineUnlocked = false;

        function toggleTimelineLock() {
            isTimelineUnlocked = !isTimelineUnlocked;
            var btn = document.getElementById('timeline-lock-btn');
            var items = document.querySelectorAll('.timeline-item');
            
            if (isTimelineUnlocked) {
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/></svg> ปลดล็อคแล้ว';
                btn.classList.add('unlocked');
                btn.style.borderColor = 'var(--primary)';
                btn.style.color = 'var(--primary)';
                btn.style.backgroundColor = '#eef2ff';
                items.forEach(item => {
                    if (item.dataset.clickable === 'true') {
                        item.style.cursor = 'pointer';
                        item.style.opacity = '1';
                    } else {
                        item.style.cursor = 'not-allowed';
                        item.style.opacity = '0.5';
                    }
                });
            } else {
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg> ล็อค';
                btn.classList.remove('unlocked');
                btn.style.borderColor = 'var(--border)';
                btn.style.color = 'var(--text-muted)';
                btn.style.backgroundColor = '#fff';
                items.forEach(item => {
                    item.style.cursor = 'not-allowed';
                    item.style.opacity = '1';
                });
            }
        }

        function openTimelineModal(column, label, dateStr, isClickable) {
            if (!isTimelineUnlocked) return;
            if (!isClickable) {
                alert('กรุณาอัปเดตขั้นตอนก่อนหน้าให้เสร็จสิ้นก่อน');
                return;
            }
            
            document.getElementById('timeline_step_column').value = column;
            document.getElementById('timeline_step_label').value = label;
            document.getElementById('timeline_step_display').value = label;
            
            var clearBtn = document.getElementById('timeline_clear_btn');
            
            if (dateStr) {
                document.getElementById('timeline_step_date').value = dateStr.split(' ')[0];
                clearBtn.style.display = 'inline-flex';
            } else {
                document.getElementById('timeline_step_date').value = new Date().toISOString().split('T')[0];
                clearBtn.style.display = 'none';
            }
            
            // Show PDF upload only for sign stage
            if (column === 'sign_date') {
                document.getElementById('timeline_pdf_group').style.display = 'block';
            } else {
                document.getElementById('timeline_pdf_group').style.display = 'none';
            }
            
            document.getElementById('timeline-action-input').value = 'update_timeline';
            document.getElementById('timeline-modal').style.display = 'flex';
        }

        function clearTimelineStep() {
            if (confirm('คุณต้องการยกเลิกขั้นตอนนี้ และล้างข้อมูลวันที่ใช่หรือไม่? (สถานะจะถูกคำนวณใหม่โดยอัตโนมัติ)')) {
                document.getElementById('timeline-action-input').value = 'clear_timeline_step';
                document.getElementById('timeline-form').submit();
            }
        }
    </script>
    <script src="/intern_mou2/assets/js/activity_filter.js"></script>
</head>
<body>
    <div class="app-container">
        <?php include 'includes/navbar.php'; ?>

        <main class="main-content fade-up" style="max-width: 1000px;">
            <!-- Header Card -->
            <div class="detail-header-card">
                <div class="flex justify-between items-start">
                    <span class="badge-id">ID: <?php echo $mou['ID']; ?></span>
                    <a href="#" class="btn-edit-text" onclick="toggleTitleEdit(); return false;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                        แก้ไขชื่อ
                    </a>
                </div>
                
                <div id="title-view-state">
                    <h1 class="mou-title"><?php echo htmlspecialchars($mou['name'], ENT_COMPAT, 'UTF-8'); ?></h1>
                    <div class="text-muted" style="margin-bottom: 0.5rem;">
                        <?php echo htmlspecialchars($mou['type'] ? $mou['type'] : 'MOU', ENT_COMPAT, 'UTF-8'); ?> • ระยะเวลา <?php echo htmlspecialchars($mou['period'] ? $mou['period'] : '-', ENT_COMPAT, 'UTF-8'); ?>
                    </div>
                </div>

                <form method="POST" action="/intern_mou2/actions/process_mou.php" id="title-edit-state" style="display: none; margin-top: 1rem;">
                    <input type="hidden" name="action" value="update_mou_title">
                    <input type="hidden" name="id" value="<?php echo $id; ?>">
                    <div class="flex gap-2">
                        <input type="text" name="name" class="form-control" style="font-size: 1.25rem; font-weight: 600;" value="<?php echo htmlspecialchars($mou['name'], ENT_COMPAT, 'UTF-8'); ?>" required>
                        <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1.5rem; background: #4f46e5; border-radius: var(--radius-md);">บันทึก</button>
                        <button type="button" class="btn btn-secondary" onclick="toggleTitleEdit();" style="padding: 0.5rem 1.5rem; border-radius: var(--radius-md);">ยกเลิก</button>
                    </div>
                </form>

                <div id="notes-container" style="margin-top: 0.75rem;">
                    <div id="notes-view-state">
                        <?php if (!empty($mou['notes'])): ?>
                        <div class="mou-notes" style="padding: 0.75rem; background: #fefce8; border-left: 4px solid #facc15; color: #854d0e; font-size: 0.875rem; border-radius: 0 4px 4px 0; display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <strong>หมายเหตุ:</strong> <?php echo nl2br(htmlspecialchars($mou['notes'], ENT_COMPAT, 'UTF-8')); ?>
                            </div>
                            <a href="#" class="btn-edit-text" onclick="toggleNotesEdit(); return false;" style="margin-left: 1rem; flex-shrink: 0;">แก้ไข</a>
                        </div>
                        <?php else: ?>
                        <a href="#" class="btn-edit-text" onclick="toggleNotesEdit(); return false;" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                            เพิ่มหมายเหตุ
                        </a>
                        <?php endif; ?>
                    </div>

                    <form method="POST" action="/intern_mou2/actions/process_mou.php" id="notes-edit-state" style="display: none;">
                        <input type="hidden" name="action" value="update_mou_notes">
                        <input type="hidden" name="id" value="<?php echo $id; ?>">
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <textarea name="notes" class="form-control" rows="3" placeholder="หมายเหตุ (ถ้ามี)"><?php echo htmlspecialchars(isset($mou['notes']) ? $mou['notes'] : '', ENT_COMPAT, 'UTF-8'); ?></textarea>
                            <div class="flex gap-2">
                                <button type="submit" class="btn btn-primary" style="padding: 0.25rem 1rem; font-size: 0.875rem; background: #4f46e5;">บันทึกหมายเหตุ</button>
                                <button type="button" class="btn btn-secondary" onclick="toggleNotesEdit();" style="padding: 0.25rem 1rem; font-size: 0.875rem;">ยกเลิก</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Two-Column Grid -->
            <div class="detail-grid">
                <!-- Left: Progress -->
                <div class="section-card">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-3">
                            <div class="section-title" style="margin-right: 0.25rem; margin-bottom:0;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/><path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/></svg>
                                ความคืบหน้า
                            </div>
                            <button id="timeline-lock-btn" type="button" class="btn" onclick="toggleTimelineLock()" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; border-radius: 99px; border: 1px solid var(--border); background: #fff; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
                                ล็อค
                            </button>
                        </div>
                        <?php 
                        $country_check = $mou['country_check'];
                        
                        $TIMELINE_STEPS_INSIDE = array(
                            array('column' => 'approval_date', 'label' => 'นำเข้าพิจารณาในที่ประชุม'),
                            array('column' => 'submit_date', 'label' => 'เสนอต่อกองกฎหมาย'),
                            array('column' => 'analyze_date', 'label' => 'เสนอต่อที่ประชุมคณะกรรมการบริหารมหาวิทยาลัยนเรศวร'),
                            array('column' => 'accept_date', 'label' => 'ผ่านมติคณะกรรมการบริหารมหาวิทยาลัย'),
                            array('column' => 'edit_date', 'label' => 'ส่งกลับคณะเพื่อแก้ไข'),
                            array('column' => 'sign_date', 'label' => 'ลงนาม')
                        );

                        $TIMELINE_STEPS_OUTSIDE = array(
                            array('column' => 'approval_date', 'label' => 'นำเข้าพิจารณาในที่ประชุมประจำคณะฯ'),
                            array('column' => 'submit_date', 'label' => 'ส่งต่อไปยังกองพัฒนาภาษาและกิจการต่างประเทศ'),
                            array('column' => 'edit_date', 'label' => 'ส่งกลับคณะแก้ไข (ถ้ามี)'),
                            array('column' => 'legal_date', 'label' => 'ส่งต่อไปยังกองกฎหมายเพื่อพิจาณา'),
                            array('column' => 'manager_date', 'label' => 'เสนอในที่ประชุมคณะกรรมการบริหารมหาวิทยาลัยนเรศวร'),
                            array('column' => 'council_date', 'label' => 'เสนอในที่ประชุมคณะกรรมการสภามหาวิทยาลัย'),
                            array('column' => 'sign_date', 'label' => 'ลงนาม')
                        );

                        $TIMELINE_STEPS_INSIDE_SPECIAL = array(
                            array('column' => 'approval_date', 'label' => 'นำเข้าพิจารณาในที่ประชุม'),
                            array('column' => 'submit_date', 'label' => 'เสนอต่อกองกฎหมาย'),
                            array('column' => 'edit_date', 'label' => 'ส่งกลับคณะเพื่อแก้ไข'),
                            array('column' => 'sign_date', 'label' => 'ลงนาม'),
                            array('column' => 'notice_date', 'label' => 'แจ้งมติคณะกรรมการบริหารมหาวิทยาลัย')
                        );

                        $timeline_steps = $TIMELINE_STEPS_INSIDE;
                        if ($country_check === 'Outside' || $country_check === 'ต่างประเทศ') {
                            $timeline_steps = $TIMELINE_STEPS_OUTSIDE;
                        } else if ($country_check === 'InsideSpecial' || $country_check === 'ภายในประเทศ ลักษณะเฉพาะกิจ') {
                            $timeline_steps = $TIMELINE_STEPS_INSIDE_SPECIAL;
                        }
                        
                        $completed_count = 0;
                        $active_index = -1;
                        $highest_date_index = -1;
                        $current_status = $mou['status'];
                        
                        foreach($timeline_steps as $index => $step) {
                            if (!empty($mou[$step['column']])) {
                                $completed_count++;
                                $highest_date_index = max($highest_date_index, $index);
                            }
                            if ($current_status == $step['label']) {
                                $active_index = $index;
                            }
                        }
                        
                        if ($active_index === -1) {
                            foreach(array_reverse($timeline_steps, true) as $index => $step) {
                                if (!empty($mou[$step['column']])) {
                                    $active_index = $index;
                                    break;
                                }
                            }
                        }
                        $active_index = max(0, $active_index);
                        $progress_percent = count($timeline_steps) > 0 ? round(($completed_count / count($timeline_steps)) * 100) : 0;
                        ?>
                        <div style="color:var(--danger); font-size:0.875rem; font-weight:600; display:flex; align-items:center; gap:0.25rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"></svg>
                            <?php echo $progress_percent; ?>%
                        </div>
                    </div>
                    <div class="timeline" style="margin-top: 1rem;">
                        <?php 
                        foreach($timeline_steps as $index => $step): 
                            $has_date = !empty($mou[$step['column']]);
                            $is_active = $has_date ? 'active' : '';
                            $step_date = $has_date ? date('d/m/Y', strtotime($mou[$step['column']])) : '';
                            $raw_date = $has_date ? $mou[$step['column']] : '';
                            
                            $text_color = $has_date ? 'var(--text-main)' : 'var(--text-muted)';
                            $is_clickable = ($index <= $highest_date_index + 1);
                        ?>
                        <div class="timeline-item <?php echo $is_active; ?>" 
                             data-clickable="<?php echo $is_clickable ? 'true' : 'false'; ?>"
                             onclick="openTimelineModal('<?php echo $step['column']; ?>', '<?php echo htmlspecialchars($step['label'], ENT_QUOTES); ?>', '<?php echo $raw_date; ?>', <?php echo $is_clickable ? 'true' : 'false'; ?>)" 
                             style="cursor: not-allowed; position: relative; transition: all 0.2s;">
                            <div class="timeline-node"></div>
                            <div class="timeline-content" style="padding-bottom: 0.5rem;">
                                <div class="timeline-text" style="font-size: 0.875rem; color: <?php echo $text_color; ?>; line-height: 1.4;"><?php echo htmlspecialchars($step['label']); ?></div>
                                <?php if($step_date): ?>
                                <div style="font-size: 0.75rem; color: var(--primary); margin-top: 0.25rem; font-weight: 600;"><?php echo $step_date; ?></div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="timeline-footer">
                        คลิกที่ขั้นตอนเพื่ออัปเดตความคืบหน้า
                    </div>
                </div>

                <!-- Right: Details List -->
                <div class="section-card">
                    <div class="flex justify-between items-center mb-4">
                        <div class="section-title" style="margin-bottom:0;">
                            รายละเอียด
                        </div>
                        <a href="#" class="btn-edit-text" onclick="toggleMouEdit(); return false;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                            แก้ไข
                        </a>
                    </div>
                    
                    <div class="detail-list" id="mou-view-state">
                        <div class="detail-row">
                            <div class="detail-label">สถาบันที่ร่วม</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['institution'] ? $mou['institution'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">ผู้ประสานงานและที่อยู่ติดต่อคู่สัญญา</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['contact'] ? $mou['contact'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">ผู้รับผิดชอบ</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['staff'] ? $mou['staff'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">ระยะเวลา</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['period'] ? $mou['period'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">รูปแบบเอกสาร</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['type'] ? $mou['type'] : 'MOU', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">ประเทศ</div>
                            <div class="detail-value"><?php echo htmlspecialchars($mou['nation'] ? $mou['nation'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">ขอบเขตความร่วมมือ</div>
                            <div class="detail-value"><?php 
                                $cc = $mou['country_check'];
                                $cc_display = $cc;
                                if ($cc === 'InsideSpecial') $cc_display = 'ภายในประเทศ ลักษณะเฉพาะกิจ';
                                else if ($cc === 'Outside') $cc_display = 'ต่างประเทศ';
                                else if ($cc === 'Inside') $cc_display = 'ภายในประเทศ';
                                echo htmlspecialchars($cc_display, ENT_COMPAT, 'UTF-8'); 
                            ?></div>
                        </div>
                        <?php if (!empty($mou['mou_pdf'])): ?>
                        <div class="detail-row" style="align-items: center;">
                            <div class="detail-label">เอกสาร MOU</div>
                            <div class="detail-value">
                                <a href="/intern_mou2/pdf?id=<?php echo $id; ?>" target="_blank" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.25rem 0.75rem; font-size:0.875rem; color:#ef4444; border-color:#fca5a5; background:#fef2f2;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.249 0 .45.05.603.151a.89.89 0 0 1 .353.45c.065.195.099.444.099.749 0 .307-.034.557-.101.751a.88.88 0 0 1-.354.446c-.15.101-.351.151-.603.151h-.56V12.495Zm3.743-.645v3.999h.791v-1.558h.906v-.645h-.906v-1.151h1.159v-.645H7.896Z"/></svg>
                                    ดูไฟล์ PDF
                                </a>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>

                    <form method="POST" action="/intern_mou2/actions/process_mou.php" id="mou-edit-state" style="display: none; padding-top: 1rem;">
                        <input type="hidden" name="action" value="update_mou">
                        <input type="hidden" name="id" value="<?php echo $id; ?>">
                        <input type="hidden" name="name" value="<?php echo htmlspecialchars($mou['name'] ? $mou['name'] : '', ENT_COMPAT, 'UTF-8'); ?>">
                        
                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">สถาบันที่ร่วม</label>
                            <input type="text" name="institution" class="form-control" value="<?php echo htmlspecialchars($mou['institution'] ? $mou['institution'] : '', ENT_COMPAT, 'UTF-8'); ?>">
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ผู้ประสานงาน</label>
                            <input type="text" name="contact" class="form-control" value="<?php echo htmlspecialchars($mou['contact'] ? $mou['contact'] : '', ENT_COMPAT, 'UTF-8'); ?>">
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ผู้รับผิดชอบ</label>
                            <input type="text" name="staff" class="form-control" value="<?php echo htmlspecialchars($mou['staff'] ? $mou['staff'] : '', ENT_COMPAT, 'UTF-8'); ?>">
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ระยะเวลา</label>
                            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center;">
                                <?php 
                                    $period_parts = explode(' ถึง ', $mou['period']);
                                    if(count($period_parts) < 2) {
                                        $period_parts = explode(' - ', $mou['period']);
                                    }
                                    $p_start = isset($period_parts[0]) ? trim($period_parts[0]) : '';
                                    $p_end = isset($period_parts[1]) ? trim($period_parts[1]) : '';
                                ?>
                                <input type="date" name="period_start" class="form-control" style="width: 100%;" value="<?php echo $p_start; ?>">
                                <span style="color:var(--text-muted); font-size:0.875rem;">ถึง</span>
                                <input type="date" name="period_end" class="form-control" style="width: 100%;" value="<?php echo $p_end; ?>">
                            </div>
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ประเภทความร่วมมือ</label>
                            <select name="type" class="form-control">
                                <option value="MOU" <?php echo $mou['type'] === 'MOU' ? 'selected' : ''; ?>>MOU</option>
                                <option value="MOA" <?php echo $mou['type'] === 'MOA' ? 'selected' : ''; ?>>MOA</option>
                                <option value="LOI" <?php echo $mou['type'] === 'LOI' ? 'selected' : ''; ?>>LOI</option>
                                <option value="LOA" <?php echo $mou['type'] === 'LOA' ? 'selected' : ''; ?>>LOA</option>
                            </select>
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ประเทศ</label>
                            <select name="nation" class="form-control">
                                <option value="">เลือกประเทศ</option>
                                <option value="ไทย" <?php echo $mou['nation'] === 'ไทย' ? 'selected' : ''; ?>>ไทย</option>
                                <?php foreach ($nations as $n): ?>
                                <option value="<?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?>" <?php echo $mou['nation'] === $n ? 'selected' : ''; ?>><?php echo htmlspecialchars($n, ENT_COMPAT, 'UTF-8'); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="form-group mb-4">
                            <label style="font-size:0.875rem; color:var(--text-muted); margin-bottom:0.25rem; display:block;">ประเภท (Inside/Outside)</label>
                            <select name="country_check" class="form-control">
                                <option value="InsideSpecial" <?php echo ($mou['country_check'] === 'InsideSpecial' || $mou['country_check'] === 'ภายในประเทศ ลักษณะเฉพาะกิจ') ? 'selected' : ''; ?>>ภายในประเทศ ลักษณะเฉพาะกิจ</option>
                                <option value="Outside" <?php echo ($mou['country_check'] === 'Outside' || $mou['country_check'] === 'ต่างประเทศ') ? 'selected' : ''; ?>>ต่างประเทศ</option>
                                <option value="Inside" <?php echo ($mou['country_check'] === 'Inside' || $mou['country_check'] === 'ภายในประเทศ') ? 'selected' : ''; ?>>ภายในประเทศ</option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" class="btn btn-secondary" onclick="toggleMouEdit();" style="padding: 0.5rem 1.5rem; border-radius: var(--radius-md); box-shadow:none; background: #fff; border: 1px solid var(--border);">ยกเลิก</button>
                            <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1.5rem; background: #4f46e5; border-radius: var(--radius-md); box-shadow:none;">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Activities Section -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <div class="section-title" style="margin-bottom:0;">
                        <span style="color:var(--primary); font-size:1.25rem; line-height:1;">■</span>
                        กิจกรรม
                    </div>
                    <button class="btn-add-light" onclick="toggleAddActivity()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                        เพิ่มกิจกรรม
                    </button>
                </div>

                <!-- Filter Toolbar -->
                <div class="section-card mb-4" style="padding: 0.75rem 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; align-items: end;">
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.2rem; font-weight: 500;">ประเภท</label>
                            <select id="filter-type" class="form-control" style="padding: 0.35rem 0.5rem; font-size: 0.8rem; width: 100%;">
                                <option value="">ทั้งหมด</option>
                                <option value="Inbound">Inbound</option>
                                <option value="Outbound">Outbound</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.2rem; font-weight: 500;">รูปแบบ</label>
                            <select id="filter-service" class="form-control" style="padding: 0.35rem 0.5rem; font-size: 0.8rem; width: 100%;">
                                <option value="">ทั้งหมด</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.2rem; font-weight: 500;">หมวดหมู่</label>
                            <select id="filter-category" class="form-control" style="padding: 0.35rem 0.5rem; font-size: 0.8rem; width: 100%;">
                                <option value="">ทั้งหมด</option>
                                <option value="ด้านการศึกษา">ด้านการศึกษา</option>
                                <option value="ด้านบริการวิชาการ">ด้านบริการวิชาการ</option>
                                <option value="ด้านการวิจัย">ด้านการวิจัย</option>
                                <option value="ด้านการแลกเปลี่ยน">ด้านการแลกเปลี่ยน</option>
                                <option value="ด้านการฝึกงาน/สหกิจ">ด้านการฝึกงาน/สหกิจ</option>
                                <option value="ด้านการประชุมวิชาการ">ด้านการประชุมวิชาการ</option>
                                <option value="ด้านการศึกษาดูงาน">ด้านการศึกษาดูงาน</option>
                                <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
                                
                                
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.2rem; font-weight: 500;">จัดเรียง</label>
                            <select id="sort-select" class="form-control" style="padding: 0.35rem 0.5rem; font-size: 0.8rem; width: 100%;">
                                <option value="newest">ใหม่สุด</option>
                                <option value="oldest">เก่าสุด</option>
                                <option value="date_newest">วันที่ (ใหม่)</option>
                                <option value="date_oldest">วันที่ (เก่า)</option>
                                <option value="budget_high">งบ (สูง-ต่ำ)</option>
                                <option value="budget_low">งบ (ต่ำ-สูง)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Add Activity Form (Hidden by default) -->
                <div class="section-card mb-4" id="add-activity-form" style="display: none; padding: 2rem;">
                    <h4 style="margin-bottom: 1.5rem; font-size: 1.125rem; font-weight: 600;">เพิ่มกิจกรรมใหม่</h4>
                    <form method="POST" action="/intern_mou2/actions/process_activity.php" enctype="multipart/form-data">
                        <input type="hidden" name="action" value="create">
                        <input type="hidden" name="mouid" value="<?php echo $id; ?>">
                        
                        <div class="form-group mb-4">
                            <input type="text" name="activities" class="form-control" required placeholder="ชื่อกิจกรรม *">
                        </div>
                        
                        <div class="form-group mb-4">
                            <textarea name="activities_desc" class="form-control" rows="4" placeholder="คำอธิบายกิจกรรม (ถ้ามี)" style="resize: vertical;"></textarea>
                        </div>
                        
                        <div class="form-row mb-4" style="gap: 1rem;">
                            <div class="form-col" style="flex: 1;">
                                <input type="date" name="activities_date" class="form-control" placeholder="mm/dd/yyyy">
                            </div>
                            <div class="form-col" style="flex: 1;">
                                <select name="activities_type" class="form-control">
                                    <option value="">เลือกประเภทกิจกรรม</option>
                                    <option value="Inbound">Inbound</option>
                                    <option value="Outbound">Outbound</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row mb-4" style="gap: 1rem;">
                            <div class="form-col" style="flex: 1;">
                                <select name="activities_service" class="form-control">
                                    <option value="">เลือกรูปแบบ</option>
                                    <option value="Onsite">Onsite</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                            <div class="form-col" style="flex: 1;">
                                <select name="activities_category" class="form-control">
                                    <option value="">เลือกหมวดหมู่</option>
                                    <option value="ด้านการศึกษา">ด้านการศึกษา</option>
                                    <option value="ด้านบริการวิชาการ">ด้านบริการวิชาการ</option>
                                    <option value="ด้านการวิจัย">ด้านการวิจัย</option>
                                    <option value="ด้านการแลกเปลี่ยน">ด้านการแลกเปลี่ยน</option>
                                    <option value="ด้านการฝึกงาน/สหกิจ">ด้านการฝึกงาน/สหกิจ</option>
                                    <option value="ด้านการประชุมวิชาการ">ด้านการประชุมวิชาการ</option>
                                    <option value="ด้านการศึกษาดูงาน">ด้านการศึกษาดูงาน</option>
                                    <option value="ด้านอื่นๆ">ด้านอื่นๆ</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group mb-4">
                            <input type="number" name="activities_budget" class="form-control" placeholder="งบประมาณ (บาท)">
                        </div>
                        
                        <div class="form-group mb-4">
                            <label class="btn-edit-text" style="color:var(--primary); font-weight:500; cursor:pointer;" id="pic-label-add">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
                                เพิ่มรูปภาพ
                                <input type="file" name="activities_pic[]" multiple style="display:none;" accept="image/*" onchange="handleFileSelect(this, 'add-pic-list')">
                            </label>
                            <div id="add-pic-list" style="display:none; margin-top:0.5rem; background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-md); border: 1px dashed var(--border);"></div>
                        </div>
                        
                        <div class="flex" style="justify-content: flex-end; gap: 0.75rem; margin-top: 2rem;">
                            <button type="button" class="btn btn-secondary" onclick="toggleAddActivity()" style="padding: 0.5rem 1.5rem; border-radius: var(--radius-md);">ยกเลิก</button>
                            <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1.5rem; border-radius: var(--radius-md); background: #4f46e5; box-shadow: none;">บันทึก</button>
                        </div>
                    </form>
                </div>

                <!-- Activities List / Empty State -->
                <?php if (mysqli_num_rows($act_result) === 0): ?>
                    <div class="empty-state-dashed">
                        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                        </svg>
                        <div>
                            <div class="empty-state-title">ยังไม่มีกิจกรรม</div>
                            <div class="empty-state-subtitle">กดปุ่ม "เพิ่มกิจกรรม" เพื่อเริ่มต้น</div>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="activities-grid">
                        <?php while ($act = mysqli_fetch_assoc($act_result)): ?>
                        <?php 
                            // Custom Date Formatting to match mockup (e.g. 18/6/2569)
                            $th_date = '-';
                            if ($act['activities_date']) {
                                $date_parts = explode('-', $act['activities_date']);
                                if (count($date_parts) == 3) {
                                    $year = intval($date_parts[0]) + 543;
                                    $th_date = ltrim($date_parts[2],'0') . '/' . ltrim($date_parts[1],'0') . '/' . $year;
                                }
                            }
                        ?>
                        <div class="activity-card" id="activity-card-<?php echo $act['mouid']; ?>"
                             data-mouid="<?php echo $act['mouid']; ?>"
                             data-type="<?php echo htmlspecialchars($act['activities_type'], ENT_COMPAT, 'UTF-8'); ?>"
                             data-service="<?php echo htmlspecialchars($act['activities_service'], ENT_COMPAT, 'UTF-8'); ?>"
                             data-category="<?php echo htmlspecialchars($act['activities_category'], ENT_COMPAT, 'UTF-8'); ?>"
                             data-date="<?php echo $act['activities_date']; ?>"
                             data-budget="<?php echo $act['activities_budget'] ? $act['activities_budget'] : 0; ?>"
                        >
                            <!-- View State -->
                            <div id="activity-view-<?php echo $act['mouid']; ?>" class="activity-view-wrapper" style="display:flex;">
                                <div class="activity-image-placeholder" style="padding:0;">
                                    <?php $imgs = isset($activity_images[$act['mouid']]) ? $activity_images[$act['mouid']] : array(); ?>
                                    <?php if (count($imgs) > 0): ?>
                                        <div style="position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 4px;">
                                            <div id="slider-track-<?php echo $act['mouid']; ?>" style="display: flex; width: 100%; height: 100%; transition: transform 0.3s ease-in-out;">
                                                <?php $idx=0; foreach($imgs as $img): ?>
                                                    <img src="data:image/jpeg;base64,<?php echo base64_encode($img['image_data']); ?>" alt="Activity Image" style="width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; cursor: pointer;" onclick="openFullImage(<?php echo $act['mouid']; ?>, <?php echo $idx; ?>)">
                                                <?php $idx++; endforeach; ?>
                                            </div>
                                            <?php if (count($imgs) > 1): ?>
                                                <button type="button" onclick="slideImage(<?php echo $act['mouid']; ?>, -1, <?php echo count($imgs); ?>)" style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">&#10094;</button>
                                                <button type="button" onclick="slideImage(<?php echo $act['mouid']; ?>, 1, <?php echo count($imgs); ?>)" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">&#10095;</button>
                                            <?php endif; ?>
                                        </div>
                                    <?php else: ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
                                        <span>ยังไม่มีรูปภาพ</span>
                                    <?php endif; ?>
                                </div>
                                <div class="activity-card-body">
                                    <div class="flex justify-between items-start mb-2">
                                        <div class="activity-title"><?php echo htmlspecialchars($act['activities'] ? $act['activities'] : '-', ENT_COMPAT, 'UTF-8'); ?></div>
                                        <div class="activity-actions" style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
                                            <button type="button" class="btn-icon" title="แก้ไข" onclick="toggleEditActivity(<?php echo $act['mouid']; ?>)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                            </button>
                                            <form method="POST" action="/intern_mou2/actions/process_activity.php" onsubmit="return confirm('ยืนยันการลบกิจกรรมนี้?');" style="margin: 0; padding: 0; display: flex; align-items: center;">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $act['mouid']; ?>">
                                                <input type="hidden" name="mouid" value="<?php echo $id; ?>">
                                                <button type="submit" class="btn-icon" title="ลบ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="activity-date">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                                        <span class="badge-date">วันที่จัดกิจกรรม: <?php echo htmlspecialchars($th_date, ENT_COMPAT, 'UTF-8'); ?></span>
                                    </div>
                                    <div class="activity-desc" style="margin-bottom: 1rem;">
                                        <?php echo nl2br(htmlspecialchars($act['activities_desc'] ? $act['activities_desc'] : '-', ENT_COMPAT, 'UTF-8')); ?>
                                    </div>
                                    <div class="flex flex-wrap" style="gap: 0.5rem; margin-bottom: 1rem;">
                                        <?php if(!empty($act['activities_type'])): ?>
                                            <span style="background: #f1f5f9; color: #475569; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">
                                                ประเภท: <?php echo htmlspecialchars($act['activities_type'], ENT_COMPAT, 'UTF-8'); ?>
                                            </span>
                                        <?php endif; ?>
                                        <?php if(!empty($act['activities_service'])): ?>
                                            <span style="background: #f1f5f9; color: #475569; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">
                                                รูปแบบ: <?php echo htmlspecialchars($act['activities_service'], ENT_COMPAT, 'UTF-8'); ?>
                                            </span>
                                        <?php endif; ?>
                                        <?php if(!empty($act['activities_category'])): ?>
                                            <span style="background: #f1f5f9; color: #475569; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">
                                                หมวดหมู่: <?php echo htmlspecialchars($act['activities_category'], ENT_COMPAT, 'UTF-8'); ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="mt-auto">
                                        <span class="badge-budget">งบประมาณ: <?php echo $act['activities_budget'] ? number_format($act['activities_budget']) . ' บาท' : 'ไม่มีงบประมาณ'; ?></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Edit State -->
                            <form method="POST" action="/intern_mou2/actions/process_activity.php" enctype="multipart/form-data" id="activity-edit-<?php echo $act['mouid']; ?>" class="activity-edit-wrapper" style="display:none;">
                                <input type="hidden" name="action" value="update">
                                <input type="hidden" name="id" value="<?php echo $act['mouid']; ?>">
                                <input type="hidden" name="mouid" value="<?php echo $id; ?>">
                                
                                <div class="activity-image-placeholder" style="padding:0;">
                                    <?php $imgs = isset($activity_images[$act['mouid']]) ? $activity_images[$act['mouid']] : array(); ?>
                                    <?php if (count($imgs) > 0): ?>
                                        <div style="display: flex; overflow-x: auto; flex-wrap: nowrap; gap: 0.5rem; width: 100%; padding: 0.5rem;">
                                            <?php $idx=0; foreach($imgs as $img): ?>
                                                <div id="edit-img-wrap-<?php echo $img['id']; ?>" style="position: relative; width: 100px; height: 100px; flex-shrink: 0;">
                                                    <img src="data:image/jpeg;base64,<?php echo base64_encode($img['image_data']); ?>" style="width:100%; height:100%; object-fit:cover; border-radius: 4px; cursor: pointer;" onclick="openFullImage(<?php echo $act['mouid']; ?>, <?php echo $idx; ?>)">
                                                    <button type="button" onclick="document.getElementById('edit-img-wrap-<?php echo $img['id']; ?>').style.display='none'; var inp = document.createElement('input'); inp.type='hidden'; inp.name='delete_image_ids[]'; inp.value='<?php echo $img['id']; ?>'; document.getElementById('activity-edit-<?php echo $act['mouid']; ?>').appendChild(inp);" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">X</button>
                                                </div>
                                            <?php $idx++; endforeach; ?>
                                        </div>
                                    <?php else: ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
                                        <span>ยังไม่มีรูปภาพ</span>
                                    <?php endif; ?>
                                </div>
                                <div class="activity-card-body" style="gap: 0.5rem; padding: 1rem;">
                                    <input type="text" name="activities" class="form-control" required value="<?php echo htmlspecialchars($act['activities'], ENT_COMPAT, 'UTF-8'); ?>">
                                    <textarea name="activities_desc" class="form-control" rows="4" placeholder="คำอธิบายกิจกรรม (ไม่บังคับ)" style="resize: vertical;"><?php echo htmlspecialchars($act['activities_desc'], ENT_COMPAT, 'UTF-8'); ?></textarea>
                                    
                                    <div class="form-row" style="gap: 0.5rem;">
                                        <div class="form-col" style="flex: 1;">
                                            <input type="date" name="activities_date" class="form-control" value="<?php echo $act['activities_date']; ?>">
                                        </div>
                                        <div class="form-col" style="flex: 1;">
                                            <select name="activities_type" class="form-control">
                                                <option value="">เลือกประเภทกิจกรรม</option>
                                                <option value="Inbound" <?php echo $act['activities_type'] == 'Inbound' ? 'selected' : ''; ?>>Inbound</option>
                                                <option value="Outbound" <?php echo $act['activities_type'] == 'Outbound' ? 'selected' : ''; ?>>Outbound</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="form-row" style="gap: 0.5rem;">
                                        <div class="form-col" style="flex: 1;">
                                            <select name="activities_service" class="form-control">
                                                <option value="">เลือกบริการ</option>
                                                <option value="Onsite" <?php echo $act['activities_service'] == 'Onsite' ? 'selected' : ''; ?>>Onsite</option>
                                                <option value="Online" <?php echo $act['activities_service'] == 'Online' ? 'selected' : ''; ?>>Online</option>
                                            </select>
                                        </div>
                                        <div class="form-col" style="flex: 1;">
                                            <select name="activities_category" class="form-control">
                                                <option value="">เลือกหมวดหมู่</option>
                                                <option value="ด้านการศึกษา" <?php echo $act['activities_category'] == 'ด้านการศึกษา' ? 'selected' : ''; ?>>ด้านการศึกษา</option>
                                                <option value="ด้านบริการวิชาการ" <?php echo $act['activities_category'] == 'ด้านบริการวิชาการ' ? 'selected' : ''; ?>>ด้านบริการวิชาการ</option>
                                                <option value="ด้านการวิจัย" <?php echo $act['activities_category'] == 'ด้านการวิจัย' ? 'selected' : ''; ?>>ด้านการวิจัย</option>
                                                <option value="ด้านการแลกเปลี่ยน" <?php echo $act['activities_category'] == 'ด้านการแลกเปลี่ยน' ? 'selected' : ''; ?>>ด้านการแลกเปลี่ยน</option>
                                                <option value="ด้านการฝึกงาน/สหกิจ" <?php echo $act['activities_category'] == 'ด้านการฝึกงาน/สหกิจ' ? 'selected' : ''; ?>>ด้านการฝึกงาน/สหกิจ</option>
                                                <option value="ด้านการประชุมวิชาการ" <?php echo $act['activities_category'] == 'ด้านการประชุมวิชาการ' ? 'selected' : ''; ?>>ด้านการประชุมวิชาการ</option>
                                                <option value="ด้านการศึกษาดูงาน" <?php echo $act['activities_category'] == 'ด้านการศึกษาดูงาน' ? 'selected' : ''; ?>>ด้านการศึกษาดูงาน</option>
                                                <option value="ด้านอื่นๆ" <?php echo $act['activities_category'] == 'ด้านอื่นๆ' ? 'selected' : ''; ?>>ด้านอื่นๆ</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <input type="number" name="activities_budget" class="form-control" value="<?php echo $act['activities_budget']; ?>">
                                    
                                    <div style="margin-top: 0.5rem;">
                                        <label class="btn-edit-text" style="color:var(--primary); font-weight:500; cursor:pointer;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align:-0.125em;"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>
                                            เพิ่ม/แก้ไข รูปภาพ
                                            <input type="file" name="activities_pic[]" multiple style="display:none;" accept="image/*" onchange="handleFileSelect(this, 'edit-pic-list-<?php echo $act['mouid']; ?>')">
                                        </label>
                                        <div id="edit-pic-list-<?php echo $act['mouid']; ?>" style="display:none; margin-top:0.5rem; background: #f8fafc; padding: 0.5rem; border-radius: var(--radius-md); border: 1px dashed var(--border);"></div>
                                    </div>
                                    
                                    <div class="flex" style="justify-content: flex-end; gap: 0.5rem; margin-top: auto;">
                                        <button type="button" class="btn btn-secondary" onclick="toggleEditActivity(<?php echo $act['mouid']; ?>)" style="padding: 0.25rem 1rem;">ยกเลิก</button>
                                        <button type="submit" class="btn btn-primary" style="padding: 0.25rem 1rem; background: #4f46e5; box-shadow: none;">บันทึก</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <?php endwhile; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Delete Button -->
            <div class="flex" style="justify-content: center; margin-top: 3rem; margin-bottom: 2rem;">
                <form method="POST" action="/intern_mou2/actions/process_mou.php" onsubmit="return confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูล MOU นี้? ข้อมูลกิจกรรมที่เกี่ยวข้องจะถูกลบด้วย');">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?php echo $id; ?>">
                    <button type="submit" class="btn-delete-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                        ลบข้อมูล MOU นี้
                    </button>
                </form>
            </div>
            
        </main>
    </div>

    <!-- Timeline Update Modal -->
    <div id="timeline-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
        <div class="section-card" style="width: 100%; max-width: 450px; padding: 2rem;">
            <div class="flex justify-between items-center mb-6">
                <h4 style="font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin: 0;">อัปเดตความคืบหน้า</h4>
                <button type="button" class="btn-icon" onclick="document.getElementById('timeline-modal').style.display='none';">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                </button>
            </div>
            <form method="POST" action="/intern_mou2/actions/process_mou.php" id="timeline-form" enctype="multipart/form-data">
                <input type="hidden" name="action" id="timeline-action-input" value="update_timeline">
                <input type="hidden" name="id" value="<?php echo $id; ?>">
                <input type="hidden" name="step_column" id="timeline_step_column" value="">
                <input type="hidden" name="step_label" id="timeline_step_label" value="">
                
                <div class="form-group mb-4">
                    <label style="font-size:0.875rem; font-weight:500; margin-bottom:0.5rem; display:block;">ขั้นตอน</label>
                    <input type="text" id="timeline_step_display" class="form-control" disabled style="background: #f8fafc; color: var(--text-muted);">
                </div>

                <div class="form-group mb-4">
                    <label style="font-size:0.875rem; font-weight:500; margin-bottom:0.5rem; display:block;">วันที่เสร็จสิ้น</label>
                    <input type="date" name="step_date" id="timeline_step_date" class="form-control" required>
                </div>
                
                <div class="form-group mb-4" id="timeline_pdf_group" style="display: none;">
                    <label style="font-size:0.875rem; font-weight:500; margin-bottom:0.5rem; display:block;">ไฟล์เอกสาร MOU ที่ลงนามแล้ว (PDF)</label>
                    <input type="file" name="mou_pdf" id="timeline_mou_pdf" accept="application/pdf" class="form-control" style="padding: 0.375rem 0.75rem;">
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" class="btn btn-secondary" style="padding: 0.5rem 1rem; border-color:var(--danger); color:var(--danger); margin-right: auto; display: none; align-items:center; gap:0.25rem;" id="timeline_clear_btn" onclick="clearTimelineStep()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>
                        ย้อนกลับ / ล้างข้อมูล
                    </button>
                    <button type="button" class="btn btn-secondary" style="padding: 0.5rem 1.5rem;" onclick="document.getElementById('timeline-modal').style.display='none';">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary" style="background:#4f46e5; padding: 0.5rem 1.5rem;">บันทึก</button>
                </div>
            </form>
        </div>
    </div>

<script>
    function handleFileSelect(input, displayContainerId) {
        var container = document.getElementById(displayContainerId);
        container.innerHTML = '';
        if (input.files && input.files.length > 0) {
            var list = document.createElement('ul');
            list.style.listStyleType = 'none';
            list.style.padding = '0';
            list.style.margin = '0';
            list.style.fontSize = '0.875rem';
            list.style.color = 'var(--text-muted)';
            
            for (var i = 0; i < input.files.length; i++) {
                var li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.gap = '0.5rem';
                li.style.marginBottom = '0.25rem';
                li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="color:var(--success); flex-shrink: 0;"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg> <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + input.files[i].name + '</span>';
                list.appendChild(li);
            }
            container.appendChild(list);
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }

    const currentSlides = {};
    function slideImage(mouid, direction, total) {
        if (typeof currentSlides[mouid] === "undefined") currentSlides[mouid] = 0;
        currentSlides[mouid] += direction;
        if (currentSlides[mouid] < 0) currentSlides[mouid] = total - 1;
        if (currentSlides[mouid] >= total) currentSlides[mouid] = 0;
        
        document.getElementById("slider-track-" + mouid).style.transform = "translateX(-" + (currentSlides[mouid] * 100) + "%)";
    }

    let currentModalMouid = null;
    let currentModalIndex = 0;

    function openFullImage(mouid, index) {
        currentModalMouid = mouid;
        currentModalIndex = index;
        updateModalImage();
        document.getElementById("image-modal").style.display = "flex";
    }

    function updateModalImage() {
        const track = document.getElementById("slider-track-" + currentModalMouid);
        if (track) {
            const images = track.getElementsByTagName("img");
            if (images[currentModalIndex]) {
                document.getElementById("full-image").src = images[currentModalIndex].src;
            }
            
            document.getElementById("modal-prev-btn").style.display = images.length > 1 ? "flex" : "none";
            document.getElementById("modal-next-btn").style.display = images.length > 1 ? "flex" : "none";
        }
    }

    function nextModalImage(direction) {
        if (!currentModalMouid) return;
        const track = document.getElementById("slider-track-" + currentModalMouid);
        if (track) {
            const images = track.getElementsByTagName("img");
            currentModalIndex += direction;
            if (currentModalIndex < 0) currentModalIndex = images.length - 1;
            if (currentModalIndex >= images.length) currentModalIndex = 0;
            updateModalImage();
        }
    }
</script>

<!-- Fullscreen Image Modal -->
<div id="image-modal" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden; background-color: rgba(0,0,0,0.85); align-items: center; justify-content: center; backdrop-filter: blur(5px);">
    <span onclick="document.getElementById('image-modal').style.display='none';" style="position: absolute; top: 20px; right: 40px; color: #fff; font-size: 50px; font-weight: bold; cursor: pointer; transition: 0.2s;">&times;</span>
    <button type="button" id="modal-prev-btn" onclick="nextModalImage(-1)" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; z-index: 10000; transition: 0.2s;">&#10094;</button>
    <img id="full-image" src="" style="max-width: 90%; max-height: 90%; object-fit: contain; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border-radius: 8px;">
    <button type="button" id="modal-next-btn" onclick="nextModalImage(1)" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; z-index: 10000; transition: 0.2s;">&#10095;</button>
</div>

</body>
</html>









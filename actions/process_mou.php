<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }
// process_mou.php - Handles POST actions for MOU
require_once '../includes/auth.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /intern_mou2/mou/list");
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'create') {
    // Determine nation value
    $nation = $_POST['nation'];
    if ($nation === 'Other' && !empty($_POST['nation_custom'])) {
        $nation = $_POST['nation_custom'];
    }

    $name = escape_string($conn, $_POST['name']);
    $institution = escape_string($conn, $_POST['institution']);
    $contact = escape_string($conn, $_POST['contact']);
    $staff = escape_string($conn, $_POST['staff']);
    
    $period_val = isset($_POST['period']) ? $_POST['period'] : '';
    if (isset($_POST['period_start']) || isset($_POST['period_end'])) {
        $p_start = isset($_POST['period_start']) ? $_POST['period_start'] : '';
        $p_end = isset($_POST['period_end']) ? $_POST['period_end'] : '';
        if ($p_start !== '' || $p_end !== '') {
            $period_val = $p_start . ' ถึง ' . $p_end;
        }
    }
    $period = escape_string($conn, $period_val);
    
    $type = escape_string($conn, $_POST['type']);
    $nation = escape_string($conn, $nation);
    $country_check = escape_string($conn, $_POST['country_check']);
    $status = escape_string($conn, 'รอดำเนินการ');

    $query = "INSERT INTO mou_data 
        (name, institution, contact, staff, period, type, nation, country_check, status) 
        VALUES ($name, $institution, $contact, $staff, $period, $type, $nation, $country_check, $status)";
    
    if (mysqli_query($conn, $query)) {
        header("Location: /intern_mou2/mou/list");
    } else {
        echo "Error: " . mysqli_error($conn);
    }
    exit;
}

if ($action === 'update_mou') {
    $id = intval($_POST['id']);
    
    // Determine nation value
    $nation = $_POST['nation'];
    if ($nation === 'Other' && !empty($_POST['nation_custom'])) {
        $nation = $_POST['nation_custom'];
    }

    $name = escape_string($conn, $_POST['name']);
    $institution = escape_string($conn, $_POST['institution']);
    $contact = escape_string($conn, $_POST['contact']);
    $staff = escape_string($conn, $_POST['staff']);
    
    $period_val = isset($_POST['period']) ? $_POST['period'] : '';
    if (isset($_POST['period_start']) || isset($_POST['period_end'])) {
        $p_start = isset($_POST['period_start']) ? $_POST['period_start'] : '';
        $p_end = isset($_POST['period_end']) ? $_POST['period_end'] : '';
        if ($p_start !== '' || $p_end !== '') {
            $period_val = $p_start . ' ถึง ' . $p_end;
        }
    }
    $period = escape_string($conn, $period_val);
    
    $type = escape_string($conn, $_POST['type']);
    $nation = escape_string($conn, $nation);
    $country_check = escape_string($conn, $_POST['country_check']);

    $query = "UPDATE mou_data SET 
        name = $name,
        institution = $institution,
        contact = $contact,
        staff = $staff,
        period = $period,
        type = $type,
        nation = $nation,
        country_check = $country_check
        WHERE ID = $id";
        
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_mou_title') {
    $id = intval($_POST['id']);
    $name = escape_string($conn, $_POST['name']);
    
    $query = "UPDATE mou_data SET name = $name WHERE ID = $id";
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_mou_notes') {
    $id = intval($_POST['id']);
    $notes = escape_string($conn, isset($_POST['notes']) ? $_POST['notes'] : '');
    
    $query = "UPDATE mou_data SET notes = $notes WHERE ID = $id";
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_timeline') {
    $id = intval($_POST['id']);
    $step_column = $_POST['step_column'];
    $step_label = $_POST['step_label'];
    $step_date = $_POST['step_date'];
    
    // Allowed columns to prevent SQL injection
    $allowed_columns = array('approval_date', 'submit_date', 'analyze_date', 'accept_date', 'edit_date', 'sign_date', 'legal_date', 'manager_date', 'council_date', 'notice_date');
    
    if (in_array($step_column, $allowed_columns)) {
        $date_val = escape_string($conn, $step_date);
        
        $has_pdf = false;
        if ($step_column === 'sign_date' && isset($_FILES['mou_pdf']) && $_FILES['mou_pdf']['error'] == UPLOAD_ERR_OK && $_FILES['mou_pdf']['size'] > 0) {
            $has_pdf = true;
        }

        if ($has_pdf) {
            $stmt = mysqli_prepare($conn, "UPDATE mou_data SET `$step_column` = ?, mou_pdf = ? WHERE ID = ?");
            $null_val = null;
            mysqli_stmt_bind_param($stmt, 'sbi', $step_date, $null_val, $id);
            
            // Send BLOB data in small chunks to avoid max_allowed_packet (1MB) error
            $fp = fopen($_FILES['mou_pdf']['tmp_name'], "rb");
            if ($fp) {
                while (!feof($fp)) {
                    mysqli_stmt_send_long_data($stmt, 1, fread($fp, 8192));
                }
                fclose($fp);
            }
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
        } else {
            // Update the specific date column
            $query = "UPDATE mou_data SET `$step_column` = $date_val WHERE ID = $id";
            mysqli_query($conn, $query);
        }
        
        // Recalculate status
        $res = mysqli_query($conn, "SELECT * FROM mou_data WHERE ID = $id");
        $mou = mysqli_fetch_assoc($res);
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
        
        $new_status = 'รอดำเนินการ';
        // Go through the steps backwards to find the highest completed step
        foreach (array_reverse($timeline_steps) as $step) {
            if (!empty($mou[$step['column']])) {
                $new_status = $step['label'];
                break;
            }
        }
        
        $status_esc = escape_string($conn, $new_status);
        mysqli_query($conn, "UPDATE mou_data SET status = $status_esc WHERE ID = $id");
    }
    
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'clear_timeline_step') {
    $id = intval($_POST['id']);
    $step_column = $_POST['step_column'];
    
    // Allowed columns to prevent SQL injection
    $allowed_columns = array('approval_date', 'submit_date', 'analyze_date', 'accept_date', 'edit_date', 'sign_date', 'legal_date', 'manager_date', 'council_date', 'notice_date');
    
    if (in_array($step_column, $allowed_columns)) {
        // Clear the date for this column by setting to NULL
        $extra_sql = "";
        if ($step_column === 'sign_date') {
            $extra_sql = ", mou_pdf = NULL";
        }
        $query = "UPDATE mou_data SET `$step_column` = NULL $extra_sql WHERE ID = $id";
        mysqli_query($conn, $query);
        
        // Recalculate status
        $res = mysqli_query($conn, "SELECT * FROM mou_data WHERE ID = $id");
        $mou = mysqli_fetch_assoc($res);
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
        
        $new_status = 'รอดำเนินการ';
        // Go through the steps backwards to find the highest completed step
        foreach (array_reverse($timeline_steps) as $step) {
            if (!empty($mou[$step['column']])) {
                $new_status = $step['label'];
                break;
            }
        }
        
        $status_esc = escape_string($conn, $new_status);
        mysqli_query($conn, "UPDATE mou_data SET status = $status_esc WHERE ID = $id");
    }
    
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'delete') {
    $id = intval($_POST['id']);
    if ($id > 0) {
        // Delete activities first
        mysqli_query($conn, "DELETE FROM activity_data WHERE ownerid = $id");
        // Delete MOU
        mysqli_query($conn, "DELETE FROM mou_data WHERE ID = $id");
    }
    header("Location: /intern_mou2/mou/list");
    exit;
}

if ($action === 'update_status') {
    $id = intval($_POST['id']);
    $status = escape_string($conn, $_POST['status']);
    
    if ($id > 0) {
        mysqli_query($conn, "UPDATE mou_data SET status = $status WHERE ID = $id");
    }
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

// Fallback
header("Location: /intern_mou2/mou/list");
exit;
?>



SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

// process_mou.php - Handles POST actions for MOU
require_once '../includes/auth.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /intern_mou2/mou/list");
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'create') {
    // Determine nation value
    $nation = $_POST['nation'];
    if ($nation === 'Other' && !empty($_POST['nation_custom'])) {
        $nation = $_POST['nation_custom'];
    }

    $name = escape_string($conn, $_POST['name']);
    $institution = escape_string($conn, $_POST['institution']);
    $contact = escape_string($conn, $_POST['contact']);
    $staff = escape_string($conn, $_POST['staff']);
    
    $period_val = isset($_POST['period']) ? $_POST['period'] : '';
    if (isset($_POST['period_start']) || isset($_POST['period_end'])) {
        $p_start = isset($_POST['period_start']) ? $_POST['period_start'] : '';
        $p_end = isset($_POST['period_end']) ? $_POST['period_end'] : '';
        if ($p_start !== '' || $p_end !== '') {
            $period_val = $p_start . ' ถึง ' . $p_end;
        }
    }
    $period = escape_string($conn, $period_val);
    
    $type = escape_string($conn, $_POST['type']);
    $nation = escape_string($conn, $nation);
    $country_check = escape_string($conn, $_POST['country_check']);
    $status = escape_string($conn, 'รอดำเนินการ');

    $query = "INSERT INTO mou_data 
        (name, institution, contact, staff, period, type, nation, country_check, status) 
        VALUES ($name, $institution, $contact, $staff, $period, $type, $nation, $country_check, $status)";
    
    if (mysqli_query($conn, $query)) {
        header("Location: /intern_mou2/mou/list");
    } else {
        echo "Error: " . mysqli_error($conn);
    }
    exit;
}

if ($action === 'update_mou') {
    $id = intval($_POST['id']);
    
    // Determine nation value
    $nation = $_POST['nation'];
    if ($nation === 'Other' && !empty($_POST['nation_custom'])) {
        $nation = $_POST['nation_custom'];
    }

    $name = escape_string($conn, $_POST['name']);
    $institution = escape_string($conn, $_POST['institution']);
    $contact = escape_string($conn, $_POST['contact']);
    $staff = escape_string($conn, $_POST['staff']);
    
    $period_val = isset($_POST['period']) ? $_POST['period'] : '';
    if (isset($_POST['period_start']) || isset($_POST['period_end'])) {
        $p_start = isset($_POST['period_start']) ? $_POST['period_start'] : '';
        $p_end = isset($_POST['period_end']) ? $_POST['period_end'] : '';
        if ($p_start !== '' || $p_end !== '') {
            $period_val = $p_start . ' ถึง ' . $p_end;
        }
    }
    $period = escape_string($conn, $period_val);
    
    $type = escape_string($conn, $_POST['type']);
    $nation = escape_string($conn, $nation);
    $country_check = escape_string($conn, $_POST['country_check']);

    $query = "UPDATE mou_data SET 
        name = $name,
        institution = $institution,
        contact = $contact,
        staff = $staff,
        period = $period,
        type = $type,
        nation = $nation,
        country_check = $country_check
        WHERE ID = $id";
        
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_mou_title') {
    $id = intval($_POST['id']);
    $name = escape_string($conn, $_POST['name']);
    
    $query = "UPDATE mou_data SET name = $name WHERE ID = $id";
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_mou_notes') {
    $id = intval($_POST['id']);
    $notes = escape_string($conn, isset($_POST['notes']) ? $_POST['notes'] : '');
    
    $query = "UPDATE mou_data SET notes = $notes WHERE ID = $id";
    mysqli_query($conn, $query);
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'update_timeline') {
    $id = intval($_POST['id']);
    $step_column = $_POST['step_column'];
    $step_label = $_POST['step_label'];
    $step_date = $_POST['step_date'];
    
    // Allowed columns to prevent SQL injection
    $allowed_columns = array('approval_date', 'submit_date', 'analyze_date', 'accept_date', 'edit_date', 'sign_date', 'legal_date', 'manager_date', 'council_date', 'notice_date');
    
    if (in_array($step_column, $allowed_columns)) {
        $date_val = escape_string($conn, $step_date);
        
        $has_pdf = false;
        if ($step_column === 'sign_date' && isset($_FILES['mou_pdf']) && $_FILES['mou_pdf']['error'] == UPLOAD_ERR_OK && $_FILES['mou_pdf']['size'] > 0) {
            $has_pdf = true;
        }

        if ($has_pdf) {
            $stmt = mysqli_prepare($conn, "UPDATE mou_data SET `$step_column` = ?, mou_pdf = ? WHERE ID = ?");
            $null_val = null;
            mysqli_stmt_bind_param($stmt, 'sbi', $step_date, $null_val, $id);
            
            // Send BLOB data in small chunks to avoid max_allowed_packet (1MB) error
            $fp = fopen($_FILES['mou_pdf']['tmp_name'], "rb");
            if ($fp) {
                while (!feof($fp)) {
                    mysqli_stmt_send_long_data($stmt, 1, fread($fp, 8192));
                }
                fclose($fp);
            }
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
        } else {
            // Update the specific date column
            $query = "UPDATE mou_data SET `$step_column` = $date_val WHERE ID = $id";
            mysqli_query($conn, $query);
        }
        
        // Recalculate status
        $res = mysqli_query($conn, "SELECT * FROM mou_data WHERE ID = $id");
        $mou = mysqli_fetch_assoc($res);
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
        
        $new_status = 'รอดำเนินการ';
        // Go through the steps backwards to find the highest completed step
        foreach (array_reverse($timeline_steps) as $step) {
            if (!empty($mou[$step['column']])) {
                $new_status = $step['label'];
                break;
            }
        }
        
        $status_esc = escape_string($conn, $new_status);
        mysqli_query($conn, "UPDATE mou_data SET status = $status_esc WHERE ID = $id");
    }
    
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'clear_timeline_step') {
    $id = intval($_POST['id']);
    $step_column = $_POST['step_column'];
    
    // Allowed columns to prevent SQL injection
    $allowed_columns = array('approval_date', 'submit_date', 'analyze_date', 'accept_date', 'edit_date', 'sign_date', 'legal_date', 'manager_date', 'council_date', 'notice_date');
    
    if (in_array($step_column, $allowed_columns)) {
        // Clear the date for this column by setting to NULL
        $extra_sql = "";
        if ($step_column === 'sign_date') {
            $extra_sql = ", mou_pdf = NULL";
        }
        $query = "UPDATE mou_data SET `$step_column` = NULL $extra_sql WHERE ID = $id";
        mysqli_query($conn, $query);
        
        // Recalculate status
        $res = mysqli_query($conn, "SELECT * FROM mou_data WHERE ID = $id");
        $mou = mysqli_fetch_assoc($res);
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
        
        $new_status = 'รอดำเนินการ';
        // Go through the steps backwards to find the highest completed step
        foreach (array_reverse($timeline_steps) as $step) {
            if (!empty($mou[$step['column']])) {
                $new_status = $step['label'];
                break;
            }
        }
        
        $status_esc = escape_string($conn, $new_status);
        mysqli_query($conn, "UPDATE mou_data SET status = $status_esc WHERE ID = $id");
    }
    
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

if ($action === 'delete') {
    $id = intval($_POST['id']);
    if ($id > 0) {
        // Delete activities first
        mysqli_query($conn, "DELETE FROM activity_data WHERE ownerid = $id");
        // Delete MOU
        mysqli_query($conn, "DELETE FROM mou_data WHERE ID = $id");
    }
    header("Location: /intern_mou2/mou/list");
    exit;
}

if ($action === 'update_status') {
    $id = intval($_POST['id']);
    $status = escape_string($conn, $_POST['status']);
    
    if ($id > 0) {
        mysqli_query($conn, "UPDATE mou_data SET status = $status WHERE ID = $id");
    }
    header("Location: /intern_mou2/mou/detail?id=$id");
    exit;
}

// Fallback
header("Location: /intern_mou2/mou/list");
exit;
?>





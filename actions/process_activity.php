<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once '../includes/auth.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /intern_mou2/mou/list");
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

// Function to handle multiple image uploads
function upload_activity_images($conn, $activity_id) {
    if (isset($_FILES['activities_pic'])) {
        $file_count = count($_FILES['activities_pic']['name']);
        for ($i = 0; $i < $file_count; $i++) {
            if ($_FILES['activities_pic']['error'][$i] == UPLOAD_ERR_OK && $_FILES['activities_pic']['size'][$i] > 0) {
                $stmt = mysqli_prepare($conn, "INSERT INTO activity_images (activity_id, image_data) VALUES (?, ?)");
                $null_val = NULL;
                mysqli_stmt_bind_param($stmt, 'ib', $activity_id, $null_val);
                
                $fp = fopen($_FILES['activities_pic']['tmp_name'][$i], "rb");
                if ($fp) {
                    while (!feof($fp)) {
                        mysqli_stmt_send_long_data($stmt, 1, fread($fp, 8192));
                    }
                    fclose($fp);
                }
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
            }
        }
    }
}

if ($action === 'create') {
    $mouid = intval($_POST['mouid']);
    if ($mouid <= 0) { header("Location: /intern_mou2/mou/list"); exit; }

    $activities = $_POST['activities'];
    $activities_desc = $_POST['activities_desc'];
    $activities_date = $_POST['activities_date'];
    $activities_budget = empty($_POST['activities_budget']) ? null : floatval($_POST['activities_budget']);
    $activities_type = isset($_POST['activities_type']) ? $_POST['activities_type'] : '';
    $activities_service = isset($_POST['activities_service']) ? $_POST['activities_service'] : '';
    $activities_category = isset($_POST['activities_category']) ? $_POST['activities_category'] : '';

    $stmt = mysqli_prepare($conn, "INSERT INTO activity_data 
        (ownerid, activities, activities_desc, activities_date, activities_budget, activities_type, activities_service, activities_category) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    mysqli_stmt_bind_param($stmt, 'isssdsss', 
        $mouid, $activities, $activities_desc, $activities_date, $activities_budget, 
        $activities_type, $activities_service, $activities_category);
    
    if (mysqli_stmt_execute($stmt)) {
        $activity_id = mysqli_insert_id($conn);
        upload_activity_images($conn, $activity_id);
        header("Location: /intern_mou2/mou/detail?id=$mouid");
    } else {
        echo "Error: " . mysqli_stmt_error($stmt);
    }
    mysqli_stmt_close($stmt);
    exit;
}

if ($action === 'update') {
    $id = intval($_POST['id']);
    $mouid = intval($_POST['mouid']);
    if ($id <= 0 || $mouid <= 0) { header("Location: /intern_mou2/mou/list"); exit; }

    $activities = $_POST['activities'];
    $activities_desc = $_POST['activities_desc'];
    $activities_date = $_POST['activities_date'];
    $activities_budget = empty($_POST['activities_budget']) ? null : floatval($_POST['activities_budget']);
    $activities_type = isset($_POST['activities_type']) ? $_POST['activities_type'] : '';
    $activities_service = isset($_POST['activities_service']) ? $_POST['activities_service'] : '';
    $activities_category = isset($_POST['activities_category']) ? $_POST['activities_category'] : '';

    $stmt = mysqli_prepare($conn, "UPDATE activity_data SET 
        activities = ?, activities_desc = ?, activities_date = ?, activities_budget = ?,
        activities_type = ?, activities_service = ?, activities_category = ?
        WHERE mouid = ?");
    
    mysqli_stmt_bind_param($stmt, 'sssdsssi', 
        $activities, $activities_desc, $activities_date, $activities_budget,
        $activities_type, $activities_service, $activities_category, $id);
    
    if (mysqli_stmt_execute($stmt)) {
        upload_activity_images($conn, $id);
        
        // Handle deferred image deletions
        if (isset($_POST['delete_image_ids']) && is_array($_POST['delete_image_ids'])) {
            foreach ($_POST['delete_image_ids'] as $del_img_id) {
                $del_img_id = intval($del_img_id);
                if ($del_img_id > 0) {
                    mysqli_query($conn, "DELETE FROM activity_images WHERE id = $del_img_id");
                }
            }
        }
        
        header("Location: /intern_mou2/mou/detail?id=$mouid");
    } else {
        echo "Error updating: " . mysqli_stmt_error($stmt);
    }
    mysqli_stmt_close($stmt);
    exit;
}

if ($action === 'delete_image') {
    $image_id = intval($_POST['image_id']);
    $mouid = intval($_POST['mouid']);
    if ($image_id > 0) {
        mysqli_query($conn, "DELETE FROM activity_images WHERE id = $image_id");
    }
    header("Location: /intern_mou2/mou/detail?id=$mouid");
    exit;
}

if ($action === 'delete') {
    $id = intval($_POST['id']);
    $mouid = intval($_POST['mouid']);
    if ($id > 0) {
        mysqli_query($conn, "DELETE FROM activity_images WHERE activity_id = $id");
        mysqli_query($conn, "DELETE FROM activity_data WHERE mouid = $id");
    }
    if ($mouid > 0) {
        header("Location: /intern_mou2/mou/detail?id=$mouid");
    } else {
        header("Location: /intern_mou2/mou/list");
    }
    exit;
}

header("Location: /intern_mou2/mou/list");
exit;
?>

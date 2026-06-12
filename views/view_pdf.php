<?php
session_start();
// view_pdf.php - View MOU PDF
require_once 'includes/auth.php';
require_once 'config/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $query = "SELECT mou_pdf, name FROM mou_data WHERE ID = $id";
    $result = mysqli_query($conn, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        
        if (!empty($row['mou_pdf'])) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="MOU_' . $id . '.pdf"');
            echo $row['mou_pdf'];
            exit;
        }
    }
}

// Fallback if not found
header("HTTP/1.0 404 Not Found");
echo "PDF not found.";
?>




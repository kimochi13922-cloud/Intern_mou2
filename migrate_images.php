<?php
require 'config/db.php';
$res = mysqli_query($conn, "SELECT mouid, activities_pic FROM activity_data WHERE activities_pic IS NOT NULL AND activities_pic != ''");
$count = 0;
while ($row = mysqli_fetch_assoc($res)) {
    $act_id = $row['mouid'];
    $img = $row['activities_pic'];
    
    // reconnect if needed
    if (!mysqli_ping($conn)) {
        require 'config/db.php';
    }
    
    $check = mysqli_query($conn, "SELECT id FROM activity_images WHERE activity_id = $act_id");
    if ($check && mysqli_num_rows($check) == 0) {
        $stmt = mysqli_prepare($conn, "INSERT INTO activity_images (activity_id, image_data) VALUES (?, ?)");
        $null = NULL;
        mysqli_stmt_bind_param($stmt, "ib", $act_id, $null);
        
        $chunk_size = 512 * 1024;
        $pos = 0;
        $len = strlen($img);
        while ($pos < $len) {
            $chunk = substr($img, $pos, $chunk_size);
            mysqli_stmt_send_long_data($stmt, 1, $chunk);
            $pos += $chunk_size;
        }
        
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        $count++;
    }
}
echo "Migrated $count images.\n";
?>

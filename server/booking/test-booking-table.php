<?php
// server/booking/test-booking-table.php
// Test if bookings table exists and is accessible

require_once '../config/cors.php';
require_once '../config/db.php';

header('Content-Type: application/json');

try {
    // Check if table exists
    $checkTable = $pdo->query("SHOW TABLES LIKE 'bookings'");
    $tableExists = $checkTable->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Bookings table does NOT exist in database',
            'solution' => 'Please run the SQL from server/config/bookings-table.sql'
        ]);
        exit;
    }
    
    // Get table structure
    $structure = $pdo->query("DESCRIBE bookings")->fetchAll(PDO::FETCH_ASSOC);
    
    // Count existing bookings
    $count = $pdo->query("SELECT COUNT(*) as total FROM bookings")->fetch();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Bookings table exists and is accessible',
        'tableStructure' => $structure,
        'totalBookings' => $count['total'],
        'database' => 'u627961759_zonixtec'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}

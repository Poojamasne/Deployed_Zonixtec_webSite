<?php
// server/admin/admin-get-bookings.php
// Fetch all booking requests for admin panel

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

// Check if admin is logged in (optional - add session check if needed)
// session_start();
// if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
//     http_response_code(401);
//     echo json_encode(['status' => false, 'statuscode' => 401, 'message' => 'Unauthorized']);
//     exit;
// }

try {
    // Get optional filter parameters
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Build query
    $sql = "SELECT id, name, email, phone, company, booking_date, booking_time, service, message, status, created_at, updated_at 
            FROM bookings";
    
    // Add status filter if provided
    if ($status && in_array($status, ['pending', 'confirmed', 'cancelled', 'completed'])) {
        $sql .= " WHERE status = :status";
    }
    
    $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    
    if ($status && in_array($status, ['pending', 'confirmed', 'cancelled', 'completed'])) {
        $stmt->bindParam(':status', $status);
    }
    
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get statistics
    $statsQuery = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                   FROM bookings";
    
    $statsStmt = $pdo->query($statsQuery);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => true,
        'statuscode' => 200,
        'message' => 'Bookings fetched successfully',
        'response' => $bookings,
        'stats' => [
            'total' => (int)$stats['total'],
            'pending' => (int)$stats['pending'],
            'confirmed' => (int)$stats['confirmed'],
            'cancelled' => (int)$stats['cancelled'],
            'completed' => (int)$stats['completed']
        ],
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset,
            'count' => count($bookings)
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Admin bookings fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'statuscode' => 500,
        'message' => 'Failed to fetch bookings',
        'response' => null
    ]);
} catch (Exception $e) {
    error_log("Admin bookings fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'statuscode' => 500,
        'message' => 'An error occurred',
        'response' => null
    ]);
}

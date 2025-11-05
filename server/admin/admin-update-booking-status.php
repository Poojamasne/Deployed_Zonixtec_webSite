<?php
// server/admin/admin-update-booking-status.php
// Update booking status (pending, confirmed, cancelled, completed)

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => false, 'statuscode' => 405, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['status' => false, 'statuscode' => 400, 'message' => 'Missing required fields']);
        exit;
    }
    
    $allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!in_array($input['status'], $allowedStatuses)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'statuscode' => 400, 'message' => 'Invalid status']);
        exit;
    }
    
    $sql = "UPDATE bookings SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':status', $input['status']);
    $stmt->bindParam(':id', $input['id'], PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => true,
            'statuscode' => 200,
            'message' => 'Booking status updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => false, 'statuscode' => 500, 'message' => 'Failed to update booking']);
    }
    
} catch (Exception $e) {
    error_log("Booking status update error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => false, 'statuscode' => 500, 'message' => 'An error occurred']);
}

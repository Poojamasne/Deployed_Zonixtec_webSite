<?php
// server/booking/save-booking.php
// Save booking request to database

require_once '../config/cors.php';
require_once '../config/db.php';

// Log for debugging
error_log("Booking request received - Method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    error_log("Booking data received: " . json_encode($input));
    
    // Validate required fields
    $requiredFields = ['name', 'email', 'phone', 'bookingDate', 'bookingTime', 'service'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }
    
    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    // Validate date format (YYYY-MM-DD)
    $dateTime = DateTime::createFromFormat('Y-m-d', $input['bookingDate']);
    if (!$dateTime || $dateTime->format('Y-m-d') !== $input['bookingDate']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid date format']);
        exit;
    }
    
    // Validate time format (HH:MM)
    $timeMatch = preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $input['bookingTime']);
    if (!$timeMatch) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid time format']);
        exit;
    }
    
    // Prepare SQL statement
    $sql = "INSERT INTO bookings (name, email, phone, company, booking_date, booking_time, service, message, status) 
            VALUES (:name, :email, :phone, :company, :booking_date, :booking_time, :service, :message, 'pending')";
    
    $stmt = $pdo->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':name', $input['name']);
    $stmt->bindParam(':email', $input['email']);
    $stmt->bindParam(':phone', $input['phone']);
    $stmt->bindParam(':company', $input['company']);
    $stmt->bindParam(':booking_date', $input['bookingDate']);
    $stmt->bindParam(':booking_time', $input['bookingTime']);
    $stmt->bindParam(':service', $input['service']);
    $stmt->bindParam(':message', $input['message']);
    
    // Execute query
    if ($stmt->execute()) {
        $bookingId = $pdo->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Booking saved successfully',
            'bookingId' => $bookingId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save booking']);
    }
    
} catch (PDOException $e) {
    error_log("Booking save error (PDO): " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Database error occurred',
        'error' => $e->getMessage() // Show actual error for debugging
    ]);
} catch (Exception $e) {
    error_log("Booking save error (General): " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An error occurred',
        'error' => $e->getMessage() // Show actual error for debugging
    ]);
}

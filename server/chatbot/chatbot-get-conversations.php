<?php
// chatbot-get-conversations.php - Get all chatbot conversations for admin panel
header('Content-Type: application/json');

// Include CORS configuration
require_once '../config/cors.php';

// Include database connection
require_once '../config/db.php';

try {
    // Get filter parameters
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    $session_id = isset($_GET['session_id']) ? $_GET['session_id'] : null;
    
    // Build query based on filters
    if ($session_id) {
        // Get specific session conversation
        $stmt = $pdo->prepare("
            SELECT * FROM chatbot_conversations 
            WHERE session_id = ? 
            ORDER BY created_at ASC
        ");
        $stmt->execute([$session_id]);
        $conversations = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'conversations' => $conversations
        ]);
    } else {
        // Get all unique sessions with latest message
        $stmt = $pdo->prepare("
            SELECT 
                session_id,
                user_name,
                user_email,
                user_phone,
                MAX(created_at) as last_message_time,
                COUNT(*) as message_count
            FROM chatbot_conversations 
            GROUP BY session_id, user_name, user_email, user_phone
            ORDER BY last_message_time DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
        $sessions = $stmt->fetchAll();
        
        // Get total count
        $countStmt = $pdo->query("
            SELECT COUNT(DISTINCT session_id) as total 
            FROM chatbot_conversations
        ");
        $total = $countStmt->fetch()['total'];
        
        // Get stats
        $statsStmt = $pdo->query("
            SELECT 
                COUNT(DISTINCT session_id) as total_sessions,
                COUNT(*) as total_messages,
                COUNT(DISTINCT user_email) as unique_users
            FROM chatbot_conversations
        ");
        $stats = $statsStmt->fetch();
        
        echo json_encode([
            'success' => true,
            'sessions' => $sessions,
            'total' => $total,
            'stats' => $stats
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Get all conversations grouped by user with last message
    $query = "SELECT 
                u.id as user_id,
                u.name as user_name,
                u.email as user_email,
                u.contact as user_contact,
                MAX(m.created_at) as last_message_time,
                (SELECT message FROM messages WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT sender FROM messages WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as last_sender,
                COUNT(CASE WHEN m.is_read = 0 AND m.sender = 'user' THEN 1 END) as unread_count
              FROM users u
              LEFT JOIN messages m ON u.id = m.user_id
              WHERE EXISTS (SELECT 1 FROM messages WHERE user_id = u.id)
              GROUP BY u.id, u.name, u.email, u.contact
              ORDER BY last_message_time DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($conversations),
        "data" => $conversations
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

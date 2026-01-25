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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->user_id) || empty($data->message)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID and message are required."
    ]);
    exit();
}

try {
    // Insert message
    $query = "INSERT INTO messages (user_id, message, sender) 
              VALUES (:user_id, :message, 'user')";

    $stmt = $db->prepare($query);

    // Bind values
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':message', $data->message);

    // Execute query
    if ($stmt->execute()) {
        $message_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Message sent successfully!",
            "message_id" => $message_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to send message."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

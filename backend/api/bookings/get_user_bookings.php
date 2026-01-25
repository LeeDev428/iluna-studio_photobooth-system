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

// Get user_id from query parameter
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);
    exit();
}

try {
    $query = "SELECT b.*, u.name as user_name, u.email, u.contact 
              FROM bookings b
              INNER JOIN users u ON b.user_id = u.id
              WHERE b.user_id = :user_id
              ORDER BY b.booking_date DESC, b.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($bookings),
        "data" => $bookings
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

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
if (empty($data->booking_id) || empty($data->status)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Booking ID and status are required."
    ]);
    exit();
}

// Validate status value
$validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
if (!in_array($data->status, $validStatuses)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid status. Must be: pending, confirmed, cancelled, or completed."
    ]);
    exit();
}

try {
    $query = "UPDATE bookings SET status = :status WHERE id = :booking_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':booking_id', $data->booking_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Booking status updated successfully!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to update booking status."
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

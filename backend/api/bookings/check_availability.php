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

// Get booking_date and booking_time from query parameters
$booking_date = isset($_GET['booking_date']) ? $_GET['booking_date'] : null;
$booking_time = isset($_GET['booking_time']) ? $_GET['booking_time'] : null;

if (empty($booking_date) || empty($booking_time)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Booking date and time are required."
    ]);
    exit();
}

try {
    $query = "SELECT COUNT(*) as count 
              FROM bookings 
              WHERE booking_date = :booking_date 
              AND booking_time = :booking_time 
              AND status != 'cancelled'";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':booking_date', $booking_date);
    $stmt->bindParam(':booking_time', $booking_time);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $isAvailable = $result['count'] == 0;

    echo json_encode([
        "success" => true,
        "available" => $isAvailable,
        "message" => $isAvailable ? "Time slot is available" : "Time slot is already booked"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

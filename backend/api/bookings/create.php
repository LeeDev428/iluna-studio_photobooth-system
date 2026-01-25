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
if (
    empty($data->user_id) ||
    empty($data->booking_date) ||
    empty($data->booking_day) ||
    empty($data->booking_time) ||
    empty($data->duration) ||
    empty($data->service_type) ||
    empty($data->payment_method)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All booking fields are required."
    ]);
    exit();
}

try {
    // Check if user has already booked (only one booking allowed per user)
    $checkQuery = "SELECT COUNT(*) as booking_count FROM bookings WHERE user_id = :user_id AND status != 'cancelled'";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':user_id', $data->user_id);
    $checkStmt->execute();
    $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['booking_count'] > 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "You already have an active booking. You can only book once."
        ]);
        exit();
    }

    // Check if the time slot is already taken
    $slotCheckQuery = "SELECT COUNT(*) as slot_count FROM bookings 
                       WHERE booking_date = :booking_date 
                       AND booking_time = :booking_time 
                       AND status != 'cancelled'";
    $slotStmt = $db->prepare($slotCheckQuery);
    $slotStmt->bindParam(':booking_date', $data->booking_date);
    $slotStmt->bindParam(':booking_time', $data->booking_time);
    $slotStmt->execute();
    $slotResult = $slotStmt->fetch(PDO::FETCH_ASSOC);

    if ($slotResult['slot_count'] > 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "This time slot is already booked. Please choose another time."
        ]);
        exit();
    }

    // Insert booking
    $query = "INSERT INTO bookings 
              (user_id, booking_date, booking_day, booking_time, duration, service_type, payment_method, status) 
              VALUES 
              (:user_id, :booking_date, :booking_day, :booking_time, :duration, :service_type, :payment_method, 'pending')";

    $stmt = $db->prepare($query);

    // Bind values
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':booking_date', $data->booking_date);
    $stmt->bindParam(':booking_day', $data->booking_day);
    $stmt->bindParam(':booking_time', $data->booking_time);
    $stmt->bindParam(':duration', $data->duration);
    $stmt->bindParam(':service_type', $data->service_type);
    $stmt->bindParam(':payment_method', $data->payment_method);

    // Execute query
    if ($stmt->execute()) {
        $booking_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Booking created successfully!",
            "booking_id" => $booking_id,
            "data" => [
                "booking_date" => $data->booking_date,
                "booking_day" => $data->booking_day,
                "booking_time" => $data->booking_time,
                "service_type" => $data->service_type,
                "duration" => $data->duration,
                "payment_method" => $data->payment_method,
                "status" => "pending"
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Unable to create booking."
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

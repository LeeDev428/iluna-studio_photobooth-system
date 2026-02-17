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

// Function to parse time slot and convert to minutes from midnight
function parseTimeToMinutes($timeSlot) {
    // Extract hour from time slot (e.g., "9-10 AM" -> 9)
    preg_match('/(\d+)-/', $timeSlot, $matches);
    if (empty($matches)) {
        return null;
    }
    
    $hour = (int)$matches[1];
    
    // Check if PM
    if (stripos($timeSlot, 'PM') !== false && $hour !== 12) {
        $hour += 12;
    } elseif (stripos($timeSlot, 'AM') !== false && $hour === 12) {
        $hour = 0;
    }
    
    return $hour * 60; // Convert to minutes
}

// Function to calculate end time based on duration
function calculateEndTime($startMinutes, $duration) {
    $durationMinutes = 0;
    
    if (strpos($duration, 'hr') !== false) {
        $hours = (int)str_replace('hr', '', $duration);
        $durationMinutes = $hours * 60;
    } else {
        $durationMinutes = (int)$duration;
    }
    
    return $startMinutes + $durationMinutes;
}

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
    // Get time values - either from frontend calculation or parse from time string
    if (isset($data->start_time_minutes) && isset($data->end_time_minutes)) {
        $startTimeMinutes = $data->start_time_minutes;
        $endTimeMinutes = $data->end_time_minutes;
    } else {
        // Fallback: Calculate start and end time in minutes (for backward compatibility)
        $startTimeMinutes = parseTimeToMinutes($data->booking_time);
        $endTimeMinutes = calculateEndTime($startTimeMinutes, $data->duration);
        
        if ($startTimeMinutes === null) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid time format."
            ]);
            exit();
        }
    }
    
    // Check if user has already booked (only one booking allowed per user)
    $checkQuery = "SELECT COUNT(*) as booking_count FROM bookings WHERE user_id = :user_id";
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

    // Check for overlapping bookings using time ranges
    $overlapQuery = "SELECT COUNT(*) as overlap_count FROM bookings 
                     WHERE booking_date = :booking_date 
                     AND (
                         (start_time_minutes < :end_time AND end_time_minutes > :start_time)
                     )";
    $overlapStmt = $db->prepare($overlapQuery);
    $overlapStmt->bindParam(':booking_date', $data->booking_date);
    $overlapStmt->bindParam(':start_time', $startTimeMinutes);
    $overlapStmt->bindParam(':end_time', $endTimeMinutes);
    $overlapStmt->execute();
    $overlapResult = $overlapStmt->fetch(PDO::FETCH_ASSOC);

    if ($overlapResult['overlap_count'] > 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "This time slot overlaps with an existing booking. Please choose another time."
        ]);
        exit();
    }

    // Insert booking with time range
    $query = "INSERT INTO bookings 
              (user_id, booking_date, booking_day, booking_time, start_time_minutes, end_time_minutes, duration, service_type, payment_method) 
              VALUES 
              (:user_id, :booking_date, :booking_day, :booking_time, :start_time_minutes, :end_time_minutes, :duration, :service_type, :payment_method)";

    $stmt = $db->prepare($query);

    // Bind values
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':booking_date', $data->booking_date);
    $stmt->bindParam(':booking_day', $data->booking_day);
    $stmt->bindParam(':booking_time', $data->booking_time);
    $stmt->bindParam(':start_time_minutes', $startTimeMinutes);
    $stmt->bindParam(':end_time_minutes', $endTimeMinutes);
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
                "payment_method" => $data->payment_method
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

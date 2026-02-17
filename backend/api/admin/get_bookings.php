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

// Get filter parameters
$date = isset($_GET['date']) ? $_GET['date'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$service_type = isset($_GET['service_type']) ? $_GET['service_type'] : null;
$is_history = isset($_GET['history']) && $_GET['history'] === 'true';

try {
    // Base query
    $query = "SELECT b.*, u.name as user_name, u.email as user_email, u.contact as user_contact 
              FROM bookings b
              INNER JOIN users u ON b.user_id = u.id";
    
    $conditions = [];
    $params = [];
    
    // Filter by date or history
    if ($is_history) {
        $conditions[] = "b.booking_date < CURDATE()";
    } elseif ($date) {
        $conditions[] = "b.booking_date = :date";
        $params[':date'] = $date;
    } else {
        // Default to today
        $conditions[] = "b.booking_date = CURDATE()";
    }
    
    // Filter by status
    if ($status) {
        $conditions[] = "b.status = :status";
        $params[':status'] = $status;
    }
    
    // Filter by service type
    if ($service_type) {
        $conditions[] = "b.service_type = :service_type";
        $params[':service_type'] = $service_type;
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $query .= " ORDER BY b.booking_date DESC, b.start_time_minutes ASC";

    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
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

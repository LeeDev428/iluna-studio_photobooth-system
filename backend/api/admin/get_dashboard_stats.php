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
    // Total bookings
    $totalQuery = "SELECT COUNT(*) as total FROM bookings";
    $totalStmt = $db->prepare($totalQuery);
    $totalStmt->execute();
    $totalResult = $totalStmt->fetch(PDO::FETCH_ASSOC);
    
    // Today's bookings
    $todayQuery = "SELECT COUNT(*) as today FROM bookings WHERE booking_date = CURDATE()";
    $todayStmt = $db->prepare($todayQuery);
    $todayStmt->execute();
    $todayResult = $todayStmt->fetch(PDO::FETCH_ASSOC);
    
    // Pending bookings
    $pendingQuery = "SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'";
    $pendingStmt = $db->prepare($pendingQuery);
    $pendingStmt->execute();
    $pendingResult = $pendingStmt->fetch(PDO::FETCH_ASSOC);
    
    // Confirmed bookings
    $confirmedQuery = "SELECT COUNT(*) as confirmed FROM bookings WHERE status = 'confirmed'";
    $confirmedStmt = $db->prepare($confirmedQuery);
    $confirmedStmt->execute();
    $confirmedResult = $confirmedStmt->fetch(PDO::FETCH_ASSOC);
    
    // Completed bookings
    $completedQuery = "SELECT COUNT(*) as completed FROM bookings WHERE status = 'completed'";
    $completedStmt = $db->prepare($completedQuery);
    $completedStmt->execute();
    $completedResult = $completedStmt->fetch(PDO::FETCH_ASSOC);
    
    // Calculate total sales from completed bookings
    $salesQuery = "SELECT duration FROM bookings WHERE status = 'completed'";
    $salesStmt = $db->prepare($salesQuery);
    $salesStmt->execute();
    $sales = $salesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalSales = 0;
    foreach ($sales as $booking) {
        $duration = $booking['duration'];
        if ($duration === '20') $totalSales += 250;
        elseif ($duration === '30') $totalSales += 350;
        elseif ($duration === '1hr') $totalSales += 650;
        elseif ($duration === '8hr') $totalSales += 5000;
    }
    
    // This month's sales
    $monthSalesQuery = "SELECT duration FROM bookings 
                        WHERE status = 'completed' 
                        AND MONTH(booking_date) = MONTH(CURDATE()) 
                        AND YEAR(booking_date) = YEAR(CURDATE())";
    $monthSalesStmt = $db->prepare($monthSalesQuery);
    $monthSalesStmt->execute();
    $monthSales = $monthSalesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $monthlyTotal = 0;
    foreach ($monthSales as $booking) {
        $duration = $booking['duration'];
        if ($duration === '20') $monthlyTotal += 250;
        elseif ($duration === '30') $monthlyTotal += 350;
        elseif ($duration === '1hr') $monthlyTotal += 650;
        elseif ($duration === '8hr') $monthlyTotal += 5000;
    }
    
    // Recent bookings (last 5)
    $recentQuery = "SELECT b.*, u.name as user_name, u.email as user_email, u.contact as user_contact 
                    FROM bookings b
                    INNER JOIN users u ON b.user_id = u.id
                    ORDER BY b.created_at DESC
                    LIMIT 5";
    $recentStmt = $db->prepare($recentQuery);
    $recentStmt->execute();
    $recentBookings = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "total_bookings" => (int)$totalResult['total'],
            "today_bookings" => (int)$todayResult['today'],
            "pending_bookings" => (int)$pendingResult['pending'],
            "confirmed_bookings" => (int)$confirmedResult['confirmed'],
            "completed_bookings" => (int)$completedResult['completed'],
            "total_sales" => $totalSales,
            "monthly_sales" => $monthlyTotal,
            "recent_bookings" => $recentBookings
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

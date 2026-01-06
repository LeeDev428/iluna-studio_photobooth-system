<?php
// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Unable to sign in. Please provide email and password."
    ]);
    exit();
}

// Set user property values
$user->email = $data->email;

// Check if email exists and verify password
if ($user->emailExists()) {
    // Verify password
    if (password_verify($data->password, $user->password)) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Sign in successful.",
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "contact" => $user->contact
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid password."
        ]);
    }
} else {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Email not found. Please register first."
    ]);
}
?>

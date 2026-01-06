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

require_once '../../config/database.php';
require_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Log received data for debugging
error_log("Received registration data: " . print_r($data, true));

// Validate required fields
if (
    empty($data->name) ||
    empty($data->email) ||
    empty($data->contact) ||
    empty($data->password)
) {
    http_response_code(400);
    error_log("Missing fields - Name: " . ($data->name ?? 'empty') . ", Email: " . ($data->email ?? 'empty') . ", Contact: " . ($data->contact ?? 'empty'));
    echo json_encode([
        "success" => false,
        "message" => "Unable to register. Please fill in all required fields.",
        "received" => [
            "name" => isset($data->name) ? "yes" : "no",
            "email" => isset($data->email) ? "yes" : "no",
            "contact" => isset($data->contact) ? "yes" : "no",
            "password" => isset($data->password) ? "yes" : "no"
        ]
    ]);
    exit();
}

// Set user property values
$user->name = $data->name;
$user->email = $data->email;
$user->contact = $data->contact;
$user->password = $data->password;

// Check if email already exists
if ($user->emailExists()) {
    http_response_code(400);
    error_log("Email already exists: " . $data->email);
    echo json_encode([
        "success" => false,
        "message" => "Email already registered. Please use a different email."
    ]);
    exit();
}

// Check if contact already exists
if ($user->contactExists()) {
    http_response_code(400);
    error_log("Contact already exists: " . $data->contact);
    echo json_encode([
        "success" => false,
        "message" => "Contact number already registered."
    ]);
    exit();
}

// Create the user
if ($user->create()) {
    http_response_code(201);
    error_log("User created successfully: " . $user->id);
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully.",
        "user" => [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "contact" => $user->contact
        ]
    ]);
} else {
    http_response_code(503);
    error_log("Failed to create user - Database error");
    echo json_encode([
        "success" => false,
        "message" => "Unable to register user. Please try again."
    ]);
}
?>

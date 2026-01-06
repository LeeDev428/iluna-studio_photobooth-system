<?php
require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (
    empty($data->name) ||
    empty($data->email) ||
    empty($data->contact) ||
    empty($data->password)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Unable to register. Please fill in all required fields."
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
    echo json_encode([
        "success" => false,
        "message" => "Email already registered. Please use a different email."
    ]);
    exit();
}

// Check if contact already exists
if ($user->contactExists()) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Contact number already registered."
    ]);
    exit();
}

// Create the user
if ($user->create()) {
    http_response_code(201);
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
    echo json_encode([
        "success" => false,
        "message" => "Unable to register user. Please try again."
    ]);
}
?>

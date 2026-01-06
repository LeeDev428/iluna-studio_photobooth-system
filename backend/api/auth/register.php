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
    empty($data->surname) ||
    empty($data->firstName) ||
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
$user->surname = $data->surname;
$user->first_name = $data->firstName;
$user->middle_initial = isset($data->middleInitial) ? $data->middleInitial : '';
$user->email = $data->email;
$user->contact = $data->contact;
$user->address = isset($data->address) ? $data->address : '';
$user->message = isset($data->message) ? $data->message : '';
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
        "data" => [
            "id" => $user->id,
            "surname" => $user->surname,
            "first_name" => $user->first_name,
            "middle_initial" => $user->middle_initial,
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

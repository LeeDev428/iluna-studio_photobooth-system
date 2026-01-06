<?php
require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->email) || empty($data->contact)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Unable to sign in. Please provide email and contact number."
    ]);
    exit();
}

// Set user property values
$user->email = $data->email;

// Check if email exists
if ($user->emailExists()) {
    // Verify contact number matches
    if ($user->contact === $data->contact) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Sign in successful.",
            "data" => [
                "id" => $user->id,
                "surname" => $user->surname,
                "first_name" => $user->first_name,
                "middle_initial" => $user->middle_initial,
                "email" => $user->email,
                "contact" => $user->contact,
                "address" => $user->address
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid contact number."
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

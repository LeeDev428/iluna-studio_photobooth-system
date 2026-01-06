<?php
require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get user ID from request
$user_id = isset($_GET['id']) ? $_GET['id'] : die();

$user->id = $user_id;

if ($user->getUserById()) {
    $user_arr = array(
        "success" => true,
        "data" => array(
            "id" => $user->id,
            "surname" => $user->surname,
            "first_name" => $user->first_name,
            "middle_initial" => $user->middle_initial,
            "email" => $user->email,
            "contact" => $user->contact,
            "address" => $user->address
        )
    );

    http_response_code(200);
    echo json_encode($user_arr);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
}
?>

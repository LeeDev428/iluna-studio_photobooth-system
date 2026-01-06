<?php
echo json_encode([
    "success" => true,
    "message" => "Illuna Studio Photobooth API",
    "version" => "1.0.0",
    "endpoints" => [
        "auth" => [
            "register" => "/api/auth/register.php",
            "signin" => "/api/auth/signin.php"
        ],
        "user" => [
            "get_user" => "/api/user/get_user.php?id={user_id}"
        ]
    ]
]);
?>

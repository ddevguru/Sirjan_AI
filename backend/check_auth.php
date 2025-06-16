<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (isset($_SESSION['user_id'])) {
    require_once 'db_connect.php';
    $stmt = $pdo->prepare('SELECT full_name FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    echo json_encode([
        'authenticated' => true,
        'user' => ['fullName' => $user['full_name']]
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>
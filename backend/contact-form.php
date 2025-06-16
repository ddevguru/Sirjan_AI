<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Validate required fields
$requiredFields = ['name', 'email', 'message'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
        exit;
    }
}

// Validate email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Sanitize input
$name = htmlspecialchars(trim($input['name']));
$email = htmlspecialchars(trim($input['email']));
$message = htmlspecialchars(trim($input['message']));
$phone = isset($input['phone']) ? htmlspecialchars(trim($input['phone'])) : '';

// Here you would typically:
// 1. Save to database
// 2. Send email notification
// 3. Send auto-reply to user

// For demo purposes, we'll just log the message
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$logFile = $_SERVER['DOCUMENT_ROOT'] . '/logs/contact-messages.log';
$logDir = dirname($logFile);

if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);

// Send email (configure your SMTP settings)
$to = 'admin@yourwebsite.com'; // Change this to your email
$subject = 'New Contact Form Submission';
$emailMessage = "
Name: $name
Email: $email
Phone: $phone

Message:
$message

Sent from: " . ($_SERVER['HTTP_HOST'] ?? 'Website Contact Form');

$headers = [
    'From: noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8'
];

// Uncomment the line below to actually send emails
// mail($to, $subject, $emailMessage, implode("\r\n", $headers));

echo json_encode([
    'success' => true,
    'message' => 'Thank you for your message! We will get back to you soon.'
]);
?>

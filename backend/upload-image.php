<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
$uploadUrl = 'http://localhost/uploads/';
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 10 * 1024 * 1024; // 10MB

// Create upload directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No image provided']);
    exit;
}

$file = $_FILES['image'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File upload error']);
    exit;
}

// Check file size
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File too large (max 10MB)']);
    exit;
}

// Check file type
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
    exit;
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '_' . time() . '.' . $extension;
$destination = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Optimize image (optional)
    optimizeImage($destination, $file['type']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'imageUrl' => $uploadUrl . $filename,
        'filename' => $filename
    ]);
} else {
    error_log('Failed to move uploaded file to ' . $destination);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
}

function optimizeImage($filePath, $mimeType) {
    // Basic image optimization
    $maxWidth = 1920;
    $maxHeight = 1080;
    $quality = 85;
    
    switch ($mimeType) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($filePath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($filePath);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($filePath);
            break;
        default:
            return; // Skip optimization for unsupported types
    }
    
    if (!$image) return;
    
    $width = imagesx($image);
    $height = imagesy($image);
    
    // Calculate new dimensions
    if ($width > $maxWidth || $height > $maxHeight) {
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = intval($width * $ratio);
        $newHeight = intval($height * $ratio);
        
        $resized = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve transparency for PNG and GIF
        if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
            imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);
        }
        
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        
        // Save optimized image
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($resized, $filePath, $quality);
                break;
            case 'image/png':
                imagepng($resized, $filePath, 9);
                break;
            case 'image/gif':
                imagegif($resized, $filePath);
                break;
        }
        
        imagedestroy($resized);
    }
    
    imagedestroy($image);
}
?>

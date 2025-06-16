<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $input['user_id'] ?? null;
    $website_name = $input['website_name'] ?? 'Untitled Website';
    $website_type = $input['website_type'] ?? 'Business';
    $website_data = $input['website_data'] ?? null;
    $is_draft = $input['is_draft'] ?? true;
    
    if (!$user_id || !$website_data) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    try {
        // Check if draft already exists
        $stmt = $pdo->prepare("SELECT id FROM website_drafts WHERE user_id = ? AND website_name = ?");
        $stmt->execute([$user_id, $website_name]);
        
        if ($stmt->rowCount() > 0) {
            // Update existing draft
            $stmt = $pdo->prepare("
                UPDATE website_drafts 
                SET website_type = ?, website_data = ?, updated_at = NOW()
                WHERE user_id = ? AND website_name = ?
            ");
            $stmt->execute([$website_type, $website_data, $user_id, $website_name]);
        } else {
            // Insert new draft
            $stmt = $pdo->prepare("
                INSERT INTO website_drafts 
                (user_id, website_name, website_type, website_data, created_at, updated_at) 
                VALUES (?, ?, ?, ?, NOW(), NOW())
            ");
            $stmt->execute([$user_id, $website_name, $website_type, $website_data]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Website saved successfully']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>

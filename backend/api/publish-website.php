<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
    // Publish new website
    $input = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $input['user_id'] ?? null;
    $website_name = $input['website_name'] ?? null;
    $website_type = $input['website_type'] ?? 'Business';
    $website_data = $input['website_data'] ?? null;
    $html_content = $input['html_content'] ?? null;
    $domain_name = $input['domain_name'] ?? null;
    $is_active = $input['is_active'] ?? true;
    
    if (!$user_id || !$website_name || !$website_data) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    // Generate unique domain if not provided
    if (!$domain_name) {
        $domain_name = strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $website_name)) . '-' . time();
    }
    
    // Create website URL
    $website_url = "https://buildflow.studio/" . $domain_name;
    
    try {
        // Check if website already exists for this user with same name
        $stmt = $pdo->prepare("SELECT id FROM published_websites WHERE user_id = ? AND website_name = ?");
        $stmt->execute([$user_id, $website_name]);
        
        if ($stmt->rowCount() > 0) {
            // Update existing website
            $stmt = $pdo->prepare("
                UPDATE published_websites 
                SET website_type = ?, website_data = ?, html_content = ?, 
                    domain_name = ?, website_url = ?, is_active = ?, updated_at = NOW()
                WHERE user_id = ? AND website_name = ?
            ");
            $stmt->execute([
                $website_type, $website_data, $html_content, 
                $domain_name, $website_url, $is_active, 
                $user_id, $website_name
            ]);
        } else {
            // Insert new website
            $stmt = $pdo->prepare("
                INSERT INTO published_websites 
                (user_id, website_name, website_type, website_data, html_content, 
                 domain_name, website_url, is_active, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            $stmt->execute([
                $user_id, $website_name, $website_type, $website_data, 
                $html_content, $domain_name, $website_url, $is_active
            ]);
        }
        
        // Create physical HTML file (optional - for static hosting)
        $websites_dir = '../published-websites/';
        if (!file_exists($websites_dir)) {
            mkdir($websites_dir, 0755, true);
        }
        
        $html_file = $websites_dir . $domain_name . '.html';
        file_put_contents($html_file, $html_content);
        
        // Update website analytics
        $stmt = $pdo->prepare("
            INSERT INTO website_analytics (website_id, user_id, page_views, unique_visitors, created_at)
            VALUES (LAST_INSERT_ID(), ?, 0, 0, NOW())
            ON DUPLICATE KEY UPDATE updated_at = NOW()
        ");
        $stmt->execute([$user_id]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Website published successfully',
            'website_url' => $website_url,
            'domain_name' => $domain_name
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user's published websites
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'User ID required']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT pw.*, wa.page_views, wa.unique_visitors, wa.last_visit
            FROM published_websites pw
            LEFT JOIN website_analytics wa ON pw.id = wa.website_id
            WHERE pw.user_id = ? AND pw.is_active = 1
            ORDER BY pw.updated_at DESC
        ");
        $stmt->execute([$user_id]);
        $websites = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'websites' => $websites
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete website
    $input = json_decode(file_get_contents('php://input'), true);
    $website_id = $input['website_id'] ?? null;
    $user_id = $input['user_id'] ?? null;
    
    if (!$website_id || !$user_id) {
        echo json_encode(['success' => false, 'message' => 'Website ID and User ID required']);
        exit;
    }
    
    try {
        // Get domain name before deletion
        $stmt = $pdo->prepare("SELECT domain_name FROM published_websites WHERE id = ? AND user_id = ?");
        $stmt->execute([$website_id, $user_id]);
        $website = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($website) {
            // Delete from database
            $stmt = $pdo->prepare("DELETE FROM published_websites WHERE id = ? AND user_id = ?");
            $stmt->execute([$website_id, $user_id]);
            
            // Delete physical file
            $html_file = '../published-websites/' . $website['domain_name'] . '.html';
            if (file_exists($html_file)) {
                unlink($html_file);
            }
            
            // Delete analytics
            $stmt = $pdo->prepare("DELETE FROM website_analytics WHERE website_id = ?");
            $stmt->execute([$website_id]);
            
            echo json_encode(['success' => true, 'message' => 'Website deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Website not found']);
        }
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>

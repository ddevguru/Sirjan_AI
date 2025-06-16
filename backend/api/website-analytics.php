<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Track website visit
    $input = json_decode(file_get_contents('php://input'), true);
    
    $website_id = $input['website_id'] ?? null;
    $visitor_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $referrer = $_SERVER['HTTP_REFERER'] ?? '';
    $page_url = $input['page_url'] ?? '';
    
    if (!$website_id) {
        echo json_encode(['success' => false, 'message' => 'Website ID required']);
        exit;
    }
    
    try {
        // Log the visit
        $stmt = $pdo->prepare("
            INSERT INTO website_visits (website_id, visitor_ip, user_agent, referrer, page_url) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$website_id, $visitor_ip, $user_agent, $referrer, $page_url]);
        
        // Update analytics
        $stmt = $pdo->prepare("
            UPDATE website_analytics 
            SET page_views = page_views + 1, 
                last_visit = NOW(),
                updated_at = NOW()
            WHERE website_id = ?
        ");
        $stmt->execute([$website_id]);
        
        // Update unique visitors (simplified - based on IP)
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT visitor_ip) as unique_count 
            FROM website_visits 
            WHERE website_id = ?
        ");
        $stmt->execute([$website_id]);
        $unique_count = $stmt->fetch(PDO::FETCH_ASSOC)['unique_count'];
        
        $stmt = $pdo->prepare("
            UPDATE website_analytics 
            SET unique_visitors = ?
            WHERE website_id = ?
        ");
        $stmt->execute([$unique_count, $website_id]);
        
        echo json_encode(['success' => true, 'message' => 'Visit tracked']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to track visit']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get analytics data
    $website_id = $_GET['website_id'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$website_id && !$user_id) {
        echo json_encode(['success' => false, 'message' => 'Website ID or User ID required']);
        exit;
    }
    
    try {
        if ($website_id) {
            // Get specific website analytics
            $stmt = $pdo->prepare("
                SELECT wa.*, pw.website_name, pw.domain_name, pw.website_url
                FROM website_analytics wa
                JOIN published_websites pw ON wa.website_id = pw.id
                WHERE wa.website_id = ?
            ");
            $stmt->execute([$website_id]);
            $analytics = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Get recent visits
            $stmt = $pdo->prepare("
                SELECT visitor_ip, user_agent, referrer, page_url, created_at
                FROM website_visits 
                WHERE website_id = ? 
                ORDER BY created_at DESC 
                LIMIT 50
            ");
            $stmt->execute([$website_id]);
            $recent_visits = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'analytics' => $analytics,
                'recent_visits' => $recent_visits
            ]);
            
        } else {
            // Get all user's website analytics
            $stmt = $pdo->prepare("
                SELECT wa.*, pw.website_name, pw.domain_name, pw.website_url
                FROM website_analytics wa
                JOIN published_websites pw ON wa.website_id = pw.id
                WHERE wa.user_id = ?
                ORDER BY wa.page_views DESC
            ");
            $stmt->execute([$user_id]);
            $analytics = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'analytics' => $analytics
            ]);
        }
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get analytics']);
    }
}
?>

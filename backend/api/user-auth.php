<?php
session_start();
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
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch($action) {
    case 'login':
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        if (!$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'Email and password required']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, password_hash, subscription_plan FROM users WHERE email = ? AND is_active = 1");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Create session
                $session_token = bin2hex(random_bytes(32));
                $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
                
                $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
                $stmt->execute([$user['id'], $session_token, $expires_at]);
                
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['session_token'] = $session_token;
                
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'subscription' => $user['subscription_plan']
                    ],
                    'session_token' => $session_token
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Login failed']);
        }
        break;
        
    case 'register':
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        if (!$name || !$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'All fields required']);
            exit;
        }
        
        if (strlen($password) < 6) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
            exit;
        }
        
        try {
            // Check if email exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'Email already registered']);
                exit;
            }
            
            // Create user
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $password_hash]);
            
            $user_id = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful',
                'user_id' => $user_id
            ]);
            
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
        break;
        
    case 'logout':
        if (isset($_SESSION['session_token'])) {
            try {
                $stmt = $pdo->prepare("DELETE FROM user_sessions WHERE session_token = ?");
                $stmt->execute([$_SESSION['session_token']]);
            } catch(PDOException $e) {
                // Continue with logout even if DB operation fails
            }
        }
        
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        break;
        
    case 'verify':
        $session_token = $input['session_token'] ?? $_SESSION['session_token'] ?? '';
        
        if (!$session_token) {
            echo json_encode(['success' => false, 'message' => 'No session token']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare("
                SELECT u.id, u.name, u.email, u.subscription_plan 
                FROM users u 
                JOIN user_sessions s ON u.id = s.user_id 
                WHERE s.session_token = ? AND s.expires_at > NOW() AND u.is_active = 1
            ");
            $stmt->execute([$session_token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'subscription' => $user['subscription_plan']
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
            }
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Session verification failed']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>

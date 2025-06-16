<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
require_once 'controllers/WebsiteController.php';
require_once 'controllers/UserController.php';
require_once 'controllers/MediaController.php';
require_once 'controllers/VoiceController.php';
require_once 'middleware/AuthMiddleware.php';

$database = new Database();
$db = $database->getConnection();

// Parse the request
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$method = $_SERVER['REQUEST_METHOD'];

// Route the request
$router = new Router($db);
$router->route($method, $path);

class Router {
    private $db;
    private $websiteController;
    private $userController;
    private $mediaController;
    private $voiceController;
    private $authMiddleware;

    public function __construct($db) {
        $this->db = $db;
        $this->websiteController = new WebsiteController($db);
        $this->userController = new UserController($db);
        $this->mediaController = new MediaController($db);
        $this->voiceController = new VoiceController($db);
        $this->authMiddleware = new AuthMiddleware($db);
    }

    public function route($method, $path) {
        $segments = explode('/', trim($path, '/'));
        
        try {
            switch ($segments[0]) {
                case 'auth':
                    $this->handleAuth($method, $segments);
                    break;
                case 'websites':
                    $this->handleWebsites($method, $segments);
                    break;
                case 'media':
                    $this->handleMedia($method, $segments);
                    break;
                case 'voice':
                    $this->handleVoice($method, $segments);
                    break;
                default:
                    $this->sendResponse(404, ['error' => 'Endpoint not found']);
            }
        } catch (Exception $e) {
            $this->sendResponse(500, ['error' => $e->getMessage()]);
        }
    }

    private function handleAuth($method, $segments) {
        switch ($method) {
            case 'POST':
                if ($segments[1] === 'login') {
                    $this->userController->login();
                } elseif ($segments[1] === 'register') {
                    $this->userController->register();
                }
                break;
        }
    }

    private function handleWebsites($method, $segments) {
        $user = $this->authMiddleware->authenticate();
        
        switch ($method) {
            case 'GET':
                if (isset($segments[1])) {
                    $this->websiteController->getWebsite($segments[1], $user['id']);
                } else {
                    $this->websiteController->getUserWebsites($user['id']);
                }
                break;
            case 'POST':
                if (isset($segments[1]) && $segments[1] !== '' && isset($segments[2]) && $segments[2] === 'publish') {
                    $this->websiteController->publishWebsite($segments[1], $user['id']);
                } else {
                    $this->websiteController->createWebsite($user['id']);
                }
                break;
            case 'PUT':
                if (isset($segments[1])) {
                    $this->websiteController->updateWebsite($segments[1], $user['id']);
                }
                break;
            case 'DELETE':
                if (isset($segments[1])) {
                    $this->websiteController->deleteWebsite($segments[1], $user['id']);
                }
                break;
        }
    }

    private function handleMedia($method, $segments) {
        $user = $this->authMiddleware->authenticate();
        
        switch ($method) {
            case 'POST':
                $this->mediaController->uploadMedia($user['id']);
                break;
            case 'GET':
                $this->mediaController->getUserMedia($user['id']);
                break;
            case 'DELETE':
                if (isset($segments[1])) {
                    $this->mediaController->deleteMedia($segments[1], $user['id']);
                }
                break;
        }
    }

    private function handleVoice($method, $segments) {
        $user = $this->authMiddleware->authenticate();
        
        switch ($method) {
            case 'POST':
                if ($segments[1] === 'transcribe') {
                    $this->voiceController->transcribeAudio($user['id']);
                } elseif ($segments[1] === 'generate') {
                    $this->voiceController->generateFromVoice($user['id']);
                }
                break;
        }
    }

    private function sendResponse($status, $data) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
?>

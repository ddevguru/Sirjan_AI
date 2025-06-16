<?php
require_once 'models/User.php';

class UserController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
            $this->sendResponse(400, ['error' => 'Missing required fields']);
            return;
        }

        if ($this->user->emailExists($data['email'])) {
            $this->sendResponse(409, ['error' => 'Email already exists']);
            return;
        }

        $userId = $this->user->create($data['name'], $data['email'], $data['password']);
        
        if ($userId) {
            $token = $this->generateJWT($userId, $data['email']);
            $this->sendResponse(201, [
                'success' => true,
                'data' => [
                    'id' => $userId,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'token' => $token
                ]
            ]);
        } else {
            $this->sendResponse(500, ['error' => 'Failed to create user']);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['email']) || empty($data['password'])) {
            $this->sendResponse(400, ['error' => 'Missing email or password']);
            return;
        }

        $user = $this->user->authenticate($data['email'], $data['password']);
        
        if ($user) {
            $token = $this->generateJWT($user['id'], $user['email']);
            $this->sendResponse(200, [
                'success' => true,
                'data' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'token' => $token
                ]
            ]);
        } else {
            $this->sendResponse(401, ['error' => 'Invalid credentials']);
        }
    }

    private function generateJWT($userId, $email) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $userId,
            'email' => $email,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]);
        
        $headerEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $payloadEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, 'your-secret-key', true);
        $signatureEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
    }

    private function sendResponse($status, $data) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
?>

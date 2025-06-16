<?php
class AuthMiddleware {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $this->sendUnauthorized();
        }
        
        $token = $matches[1];
        $user = $this->validateJWT($token);
        
        if (!$user) {
            $this->sendUnauthorized();
        }
        
        return $user;
    }

    private function validateJWT($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, 'your-secret-key', true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($signatureEncoded !== $expectedSignature) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payloadEncoded)), true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }

    private function sendUnauthorized() {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
?>

<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($name, $email, $password) {
        $query = "INSERT INTO " . $this->table_name . " (name, email, password) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        if ($stmt->execute([$name, $email, $hashedPassword])) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }

    public function authenticate($email, $password) {
        $query = "SELECT id, name, email, password FROM " . $this->table_name . " WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$email]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return $user;
        }
        
        return false;
    }

    public function emailExists($email) {
        $query = "SELECT COUNT(*) FROM " . $this->table_name . " WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$email]);
        
        return $stmt->fetchColumn() > 0;
    }

    public function findById($id) {
        $query = "SELECT id, name, email FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>

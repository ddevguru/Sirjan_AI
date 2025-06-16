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
    echo json_encode(['success' => false, 'message' => 'You must be logged in']);
    exit;
}

if (!isset($_FILES['audio'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No audio file provided']);
    exit;
}

$audioFile = $_FILES['audio'];
$uploadDir = 'C:/xampp/htdocs/uploads/audio/';
$allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm'];

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!in_array($audioFile['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid audio file type']);
    exit;
}

$filename = uniqid() . '_' . basename($audioFile['name']);
$destination = $uploadDir . $filename;

if (move_uploaded_file($audioFile['tmp_name'], $destination)) {
    error_log("Audio file saved to: $destination");
    $transcript = transcribeAudio($destination);
    
    if ($transcript) {
        unlink($destination); // Clean up
        echo json_encode([
            'success' => true,
            'transcript' => $transcript,
            'message' => 'Audio processed successfully'
        ]);
    } else {
        unlink($destination);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to transcribe audio'
        ]);
    }
} else {
    error_log("Failed to save audio file: " . $audioFile['name']);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save audio file']);
}

function transcribeAudio($audioPath) {
    // Option 1: Use local Whisper installation
    $transcript = transcribeWithLocalWhisper($audioPath);
    if ($transcript) {
        return $transcript;
    }
    
    // Option 2: Fallback to mock transcript
    return "Mock transcript: Create a business website with a contact form and about page.";
}

function transcribeWithLocalWhisper($audioPath) {
    // Ensure Whisper is installed: pip install openai-whisper
    $command = "whisper \"$audioPath\" --model tiny --output_format txt --output_dir temp/ 2>&1";
    $output = shell_exec($command);
    
    error_log("Whisper command output: $output");
    
    $transcriptFile = 'temp/' . pathinfo($audioPath, PATHINFO_FILENAME) . '.txt';
    if (file_exists($transcriptFile)) {
        $transcript = file_get_contents($transcriptFile);
        unlink($transcriptFile); // Clean up
        if (!is_dir('temp')) {
            rmdir('temp');
        }
        return trim($transcript);
    }
    
    error_log("Transcription failed: No transcript file found at $transcriptFile");
    return false;
}
?>
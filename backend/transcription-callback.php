<?php
header('Content-Type: application/json');

// Handle transcription callback from Twilio
$transcriptionText = $_POST['TranscriptionText'] ?? '';
$callSid = $_POST['CallSid'] ?? '';

error_log("Transcription received: CallSid=$callSid, Text=$transcriptionText");

if ($transcriptionText) {
    // Store the transcription and generate website
    $websiteData = generateWebsiteFromTranscription($transcriptionText);
    
    // Here you can save to a database or send an email
    // For simplicity, we'll just return the transcript
    echo json_encode([
        'success' => true,
        'message' => 'Transcription processed successfully',
        'transcript' => $transcriptionText
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No transcription received'
    ]);
}

function generateWebsiteFromTranscription($transcript) {
    // Mock implementation - replace with actual AI generation logic
    return [
        'websiteName' => 'Voice Generated Website',
        'components' => [
            ['type' => 'hero', 'config' => ['title' => 'Voice Generated', 'subtitle' => $transcript]],
            ['type' => 'text', 'config' => ['content' => 'Created from voice input']],
            ['type' => 'footer', 'config' => ['copyright' => '© 2025 Voice Website']]
        ],
        'transcript' => $transcript
    ];
}
?>
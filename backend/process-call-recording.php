<?php
header('Content-Type: text/xml');

$recordingUrl = $_POST['RecordingUrl'] ?? '';
$callSid = $_POST['CallSid'] ?? '';

error_log("Processing recording: CallSid=$callSid, RecordingUrl=$recordingUrl");

if ($recordingUrl) {
    $uploadDir = 'C:/xampp/htdocs/uploads/audio/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $filename = 'call_recording_' . $callSid . '.wav';
    $filepath = $uploadDir . $filename;
    
    $audioContent = file_get_contents($recordingUrl);
    if ($audioContent !== false && file_put_contents($filepath, $audioContent)) {
        error_log("Recording saved to: $filepath");
    } else {
        error_log("Failed to save recording for CallSid=$callSid");
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<Response>
    <Say voice="alice">Recording received. Processing your website request.</Say>
</Response>
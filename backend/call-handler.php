<?php
header('Content-Type: text/xml');

$ngrokUrl = 'https://your-ngrok-url.ngrok.io'; // Replace with your ngrok URL

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<Response>
    <Say voice="alice">
        Hello! Welcome to AI Website Builder. 
        Please describe the website you would like to create. 
        You can mention the type of business, colors you prefer, 
        and any specific features you need. 
        Start speaking after the beep.
    </Say>
    <Record 
        action="<?php echo $ngrokUrl; ?>/Promptos/process-call-recording.php"
        method="POST"
        maxLength="120"
        finishOnKey="#"
        transcribe="true"
        transcribeCallback="<?php echo $ngrokUrl; ?>/Promptos/transcription-callback.php"
    />
    <Say voice="alice">
        Thank you for your description. 
        We will process your request and create your website. 
        You will receive an email with the details shortly.
    </Say>
</Response>
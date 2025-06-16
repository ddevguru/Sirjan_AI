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

$data = json_decode(file_get_contents('php://input'), true);
$phoneNumber = $data['phoneNumber'] ?? '';

if (empty($phoneNumber) || !preg_match('/^\+?[1-9]\d{1,14}$/', $phoneNumber)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
    exit;
}

// Twilio credentials - replace with your actual credentials
$accountSid = 'your_twilio_account_sid'; // Get from Twilio dashboard
$authToken = 'your_twilio_auth_token';   // Get from Twilio dashboard
$twilioNumber = 'your_twilio_phone_number'; // Get from Twilio dashboard
$twimlUrl = 'https://your-ngrok-url.ngrok.io/Promptos/call-handler.php'; // Replace with your ngrok URL

error_log("Initiating call to: $phoneNumber");

$result = initiateCallWithTwilio($phoneNumber, $accountSid, $authToken, $twilioNumber, $twimlUrl);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Call initiated successfully',
        'callSid' => $result['callSid']
    ]);
} else {
    error_log("Call initiation failed: " . $result['message']);
    echo json_encode([
        'success' => false,
        'message' => $result['message']
    ]);
}

function initiateCallWithTwilio($phoneNumber, $accountSid, $authToken, $twilioNumber, $twimlUrl) {
    $url = "https://api.twilio.com/2010-04-01/Accounts/$accountSid/Calls.json";
    
    $data = [
        'From' => $twilioNumber,
        'To' => $phoneNumber,
        'Url' => $twimlUrl,
        'Method' => 'POST'
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_USERPWD => "$accountSid:$authToken",
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/x-www-form-urlencoded'
        ]
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    
    if ($httpCode === 201) {
        $data = json_decode($response, true);
        return [
            'success' => true,
            'callSid' => $data['sid']
        ];
    } else {
        return [
            'success' => false,
            'message' => $error ?: "Failed to initiate call (HTTP $httpCode)"
        ];
    }
}
?>
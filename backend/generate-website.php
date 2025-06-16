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
$prompt = $data['prompt'] ?? '';

if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Prompt is required']);
    exit;
}

// Analyze the prompt and generate website structure
$analysis = analyzePrompt($prompt);

echo json_encode([
    'success' => true,
    'websiteName' => $analysis['websiteName'],
    'websiteType' => $analysis['websiteType'],
    'components' => $analysis['components'],
    'message' => 'Website generated successfully'
]);

function analyzePrompt($prompt) {
    $prompt = strtolower($prompt);
    
    // Determine website type
    $websiteType = 'Business'; // default
    if (strpos($prompt, 'restaurant') !== false || strpos($prompt, 'food') !== false) {
        $websiteType = 'Restaurant';
    } elseif (strpos($prompt, 'shop') !== false || strpos($prompt, 'store') !== false || strpos($prompt, 'ecommerce') !== false) {
        $websiteType = 'E-Commerce';
    } elseif (strpos($prompt, 'portfolio') !== false || strpos($prompt, 'artist') !== false) {
        $websiteType = 'Portfolio';
    } elseif (strpos($prompt, 'blog') !== false || strpos($prompt, 'news') !== false) {
        $websiteType = 'Blog';
    }
    
    // Extract website name
    $websiteName = extractWebsiteName($prompt);
    
    // Generate components based on type and prompt
    $components = generateComponents($websiteType, $prompt);
    
    return [
        'websiteName' => $websiteName,
        'websiteType' => $websiteType,
        'components' => $components
    ];
}

function extractWebsiteName($prompt) {
    // Simple name extraction - can be enhanced with NLP
    if (preg_match('/(?:called|named|for)\s+([a-zA-Z\s]+)/', $prompt, $matches)) {
        return trim($matches[1]);
    }
    return 'AI Generated Website';
}

function generateComponents($type, $prompt) {
    $components = [];
    
    // Always add hero section
    $components[] = [
        'type' => 'hero',
        'config' => [
            'title' => getHeroTitle($type),
            'subtitle' => getHeroSubtitle($type, $prompt)
        ]
    ];
    
    // Add type-specific components
    switch ($type) {
        case 'Restaurant':
            $components[] = ['type' => 'text', 'config' => ['content' => 'Our delicious menu and specialties...']];
            $components[] = ['type' => 'gallery', 'config' => ['images' => []]];
            break;
        case 'E-Commerce':
            $components[] = ['type' => 'gallery', 'config' => ['images' => []]];
            $components[] = ['type' => 'text', 'config' => ['content' => 'Featured products and categories...']];
            break;
        case 'Portfolio':
            $components[] = ['type' => 'gallery', 'config' => ['images' => []]];
            $components[] = ['type' => 'text', 'config' => ['content' => 'About my work and experience...']];
            break;
        default:
            $components[] = ['type' => 'text', 'config' => ['content' => 'About our company and services...']];
    }
    
    // Always add contact and footer
    $components[] = ['type' => 'contact', 'config' => ['title' => 'Get In Touch']];
    $components[] = ['type' => 'footer', 'config' => ['copyright' => '© 2024 Your Company']];
    
    return $components;
}

function getHeroTitle($type) {
    $titles = [
        'Restaurant' => 'Welcome to Our Restaurant',
        'E-Commerce' => 'Shop Our Collection',
        'Portfolio' => 'My Portfolio',
        'Blog' => 'Welcome to My Blog',
        'Business' => 'Welcome to Our Business'
    ];
    return $titles[$type] ?? 'Welcome';
}

function getHeroSubtitle($type, $prompt) {
    // Extract key features from prompt
    if (strpos($prompt, 'modern') !== false) {
        return 'Modern and innovative solutions';
    } elseif (strpos($prompt, 'professional') !== false) {
        return 'Professional services you can trust';
    }
    return 'Creating amazing experiences';
}
?>

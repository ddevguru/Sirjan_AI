<?php
// Ensure no output before headers
ob_start();

// Set CORS headers immediately
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Enable error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    error_log('OPTIONS request handled successfully');
    ob_end_flush();
    exit;
}

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    error_log('Authentication failed: No user_id in session');
    ob_end_flush();
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data: ' . json_last_error_msg()]);
    error_log('Invalid JSON data: ' . json_last_error_msg());
    ob_end_flush();
    exit;
}

if (!is_array($input) || empty($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Empty or invalid input data']);
    error_log('Empty or invalid input data');
    ob_end_flush();
    exit;
}

function generatePreviewHTML($websiteData) {
    $name = htmlspecialchars($websiteData['name'] ?? 'My Website');
    $primaryColor = htmlspecialchars($websiteData['primaryColor'] ?? '#3b82f6');
    $secondaryColor = htmlspecialchars($websiteData['secondaryColor'] ?? '#10b981');
    $fontFamily = htmlspecialchars($websiteData['fontFamily'] ?? 'Inter');
    $fontSize = htmlspecialchars($websiteData['fontSize'] ?? '16px');
    $theme = $websiteData['theme'] ?? 'Modern';
    
    $seoTitle = htmlspecialchars($websiteData['seoSettings']['title'] ?? $name);
    $seoDescription = htmlspecialchars($websiteData['seoSettings']['description'] ?? '');
    $seoKeywords = htmlspecialchars($websiteData['seoSettings']['keywords'] ?? '');
    
    $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$seoTitle</title>
    <meta name="description" content="$seoDescription">
    <meta name="keywords" content="$seoKeywords">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: '$fontFamily', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: $fontSize;
            line-height: 1.6;
            color: #1f2937;
        }
        .hero-section {
            background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
            color: white;
            padding: 80px 20px;
            text-align: center;
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        .hero-content p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        .btn-primary {
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 12px 32px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        .btn-primary:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .section {
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .text-section {
            padding: 60px 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        .text-section h2 {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #1f2937;
        }
        .text-section h3 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        .text-section p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #4b5563;
            margin-bottom: 1.5rem;
        }
        .gallery-section {
            padding: 60px 20px;
            background-color: #f9fafb;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery-item {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .gallery-item:hover {
            transform: translateY(-4px);
        }
        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .contact-section {
            padding: 80px 20px;
            background-color: #f3f4f6;
        }
        .contact-container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .contact-form {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            margin-top: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
        }
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: $primaryColor;
        }
        .btn-submit {
            background-color: $primaryColor;
            color: white;
            padding: 12px 32px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        .btn-submit:hover {
            background-color: $secondaryColor;
        }
        .footer {
            background-color: #1f2937;
            color: white;
            padding: 60px 20px 30px;
            text-align: center;
        }
        .social-links {
            margin-bottom: 2rem;
        }
        .social-links a {
            color: #9ca3af;
            text-decoration: none;
            margin: 0 15px;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .social-links a:hover {
            color: white;
        }
        .copyright {
            color: #9ca3af;
            font-size: 0.9rem;
            border-top: 1px solid #374151;
            padding-top: 2rem;
        }
        @media (max-width: 768px) {
            .hero-content h1 {
                font-size: 2.5rem;
            }
            .hero-content p {
                font-size: 1.1rem;
            }
            .text-section h2 {
                font-size: 2rem;
            }
            .gallery-grid {
                grid-template-columns: 1fr;
            }
            .contact-form {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
HTML;

    // Generate components
    if (!isset($websiteData['components']) || !is_array($websiteData['components'])) {
        error_log('No valid components provided in websiteData');
        return $html . '</body></html>';
    }

    foreach ($websiteData['components'] as $component) {
        $html .= generateComponentHTML($component);
    }
    
    $html .= <<<HTML
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Thank you for your message! This is a preview - form submission is not active.');
                });
            });
        });
    </script>
</body>
</html>
HTML;

    return $html;
}

function generateComponentHTML($component) {
    if (!isset($component['type']) || !isset($component['config'])) {
        error_log('Invalid component structure: ' . json_encode($component));
        return '';
    }

    $html = '';
    switch ($component['type']) {
        case 'hero':
            $title = htmlspecialchars($component['config']['title'] ?? '');
            $subtitle = htmlspecialchars($component['config']['subtitle'] ?? '');
            $buttonText = htmlspecialchars($component['config']['buttonText'] ?? 'Get Started');
            
            $html = <<<HTML
<section class="hero-section">
    <div class="hero-content">
        <h1>$title</h1>
        <p>$subtitle</p>
        <a href="#" class="btn-primary">$buttonText</a>
    </div>
</section>
HTML;
            break;
            
        case 'text':
            $content = htmlspecialchars($component['config']['content'] ?? '');
            $heading = htmlspecialchars($component['config']['heading'] ?? 'p');
            
            if ($heading === 'p') {
                $html = <<<HTML
<section class="text-section">
    <p>$content</p>
</section>
HTML;
            } else {
                $html = <<<HTML
<section class="text-section">
    <$heading>$content</$heading>
</section>
HTML;
            }
            break;
            
        case 'image':
            $src = htmlspecialchars($component['config']['src'] ?? '/placeholder.svg?height=400&width=800');
            $alt = htmlspecialchars($component['config']['alt'] ?? 'Image');
            $caption = htmlspecialchars($component['config']['caption'] ?? '');
            
            $html = <<<HTML
<section class="section">
    <div style="text-align: center;">
        <img src="$src" alt="$alt" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
            
    </div>
</section>
HTML;
            break;
            
        case 'gallery':
            $images = $component['config']['images'] ?? [];
            if (!is_array($images)) {
                error_log('Gallery images not an array: ' . json_encode($component));
                return '';
            }
            
            $html = '<section class="gallery-section"><div class="gallery-grid">';
            foreach ($images as $image) {
                $imageSrc = htmlspecialchars($image);
                $html .= <<<HTML
<div class="gallery-item">
    <img src="$imageSrc" alt="Gallery Image">
</div>
HTML;
            }
            $html .= '</div></section>';
            break;
            
        case 'contact':
            $title = htmlspecialchars($component['config']['title'] ?? 'Contact Us');
            $submitText = htmlspecialchars($component['config']['submitText'] ?? 'Send Message');
            $fields = $component['config']['fields'] ?? ['name', 'email', 'message'];
            
            $html = <<<HTML
<section class="contact-section">
    <div class="contact-container">
        <h2>$title</h2>
        <div class="contact-form">
            <form>
HTML;
            
            foreach ($fields as $field) {
                if ($field === 'message') {
                    $html .= <<<HTML
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
HTML;
                } else {
                    $fieldType = $field === 'email' ? 'email' : 'text';
                    $fieldLabel = ucfirst($field);
                    $html .= <<<HTML
                <div class="form-group">
                    <label for="$field">$fieldLabel</label>
                    <input type="$fieldType" id="$field" name="$field" required>
                </div>
HTML;
                }
            }
            
            $html .= <<<HTML
                <button type="submit" class="btn-submit">$submitText</button>
            </form>
        </div>
    </div>
</section>
HTML;
            break;
            
        case 'footer':
            $copyright = htmlspecialchars($component['config']['copyright'] ?? '');
            $socialLinks = $component['config']['socialLinks'] ?? [];
            
            $html = <<<HTML
<footer class="footer">
    <div class="social-links">
HTML;
            
            foreach ($socialLinks as $platform => $url) {
                if (!empty($url)) {
                    $platformName = ucfirst($platform);
                    $html .= "<a href=\"" . htmlspecialchars($url) . "\" target=\"_blank\">$platformName</a>";
                }
            }
            
            $html .= <<<HTML
    </div>
    <div class="copyright">
        <p>$copyright</p>
    </div>
</footer>
HTML;
            break;
    }
    
    return $html;
}

try {
    $html = generatePreviewHTML($input);
    echo json_encode([
        'success' => true,
        'message' => 'Preview generated successfully',
        'html' => $html
    ]);
} catch (Exception $e) {
    error_log('Error in preview-website.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to generate preview: ' . $e->getMessage()
    ]);
}

ob_end_flush();
?>
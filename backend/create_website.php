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

require_once 'db_connect.php';

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/php/logs/php_error_log');

$data = json_decode(file_get_contents('php://input'), true);
$type = $data['type'] ?? '';

if ($type === 'builder') {
    $requiredFields = [
        'websiteName', 'websiteType', 'theme', 'primaryColor',
        'secondaryColor', 'fontStyle', 'fontSize', 'components', 'seoSettings'
    ];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
            exit;
        }
    }

    $websiteName = htmlspecialchars($data['websiteName']);
    $websiteType = $data['websiteType'];
    $theme = $data['theme'];
    $primaryColor = $data['primaryColor'];
    $secondaryColor = $data['secondaryColor'];
    $fontStyle = $data['fontStyle'];
    $fontSize = $data['fontSize'];
    $components = $data['components'];
    $seoSettings = $data['seoSettings'];

    $validTypes = ['Restaurant', 'E-Commerce', 'Portfolio', 'Blog', 'Other'];
    if (!in_array($websiteType, $validTypes)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid website type']);
        exit;
    }

    $fileName = 'site_' . uniqid() . '.html';
    $websiteLink = 'http://localhost/generated/' . $fileName;
    $filePath = 'C:/xampp/htdocs/generated/' . $fileName;

    try {
        $htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$seoSettings['title'] ? htmlspecialchars($seoSettings['title']) : $websiteName}</title>
    <meta name="description" content="{$seoSettings['description'] ? htmlspecialchars($seoSettings['description']) : ''}">
    <meta name="keywords" content="{$seoSettings['keywords'] ? htmlspecialchars($seoSettings['keywords']) : ''}">
    <link href="https://cdn.tailwindcss.com/2.2.19/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            font-family: '$fontStyle', sans-serif;
            font-size: $fontSize;
            background-color: {$theme === 'Dark' ? '#1a202c' : '#f7fafc'};
            color: {$theme === 'Dark' ? '#f7fafc' : '#2d3748'};
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background-color: $primaryColor;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .hero {
            background-color: $secondaryColor;
            padding: 4rem 2rem;
            text-align: center;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 2rem;
        }
        .contact-form input, .contact-form textarea {
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
        }
        footer {
            background-color: $primaryColor;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .social-links a {
            margin: 0 1rem;
            color: white;
            text-decoration: none;
        }
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1 class="text-4xl font-bold">$websiteName</h1>
    </header>
    <div class="container">
HTML;

        foreach ($components as $comp) {
            if ($comp['type'] === 'hero') {
                $title = htmlspecialchars($comp['config']['title'] ?? '');
                $subtitle = htmlspecialchars($comp['config']['subtitle'] ?? '');
                $htmlContent .= <<<HTML
<div class="hero">
    <h2 class="text-3xl font-bold">$title</h2>
    <p class="text-lg mt-2">$subtitle</p>
</div>
HTML;
            } elseif ($comp['type'] === 'text') {
                $content = htmlspecialchars($comp['config']['content'] ?? '');
                $htmlContent .= "<div class=\"p-4\">$content</div>";
            } elseif ($comp['type'] === 'image') {
                $image = htmlspecialchars($comp['config']['image'] ?? '');
                $htmlContent .= "<div class=\"p-4\"><img src=\"$image\" alt=\"Image\" class=\"w-full h-auto rounded\"></div>";
            } elseif ($comp['type'] === 'gallery') {
                $images = $comp['config']['images'] ?? [];
                $htmlContent .= '<div class="gallery">';
                foreach ($images as $image) {
                    $image = htmlspecialchars($image);
                    $htmlContent .= "<img src=\"$image\" alt=\"Gallery Image\" class=\"w-full h-auto rounded\">";
                }
                $htmlContent .= '</div>';
            } elseif ($comp['type'] === 'contact') {
                $htmlContent .= '<div class="contact-form p-4"><h2 class="text-2xl font-semibold">Contact Us</h2><form>';
                foreach ($comp['config']['fields'] as $field) {
                    if ($field === 'message') {
                        $htmlContent .= '<textarea placeholder="Message" rows="4" required></textarea>';
                    } else {
                        $type = $field === 'email' ? 'email' : 'text';
                        $htmlContent .= "<input type=\"$type\" placeholder=\"" . ucfirst($field) . "\" required>";
                    }
                }
                $htmlContent .= '<button type="button" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button></form></div>';
            } elseif ($comp['type'] === 'footer') {
                $socialLinks = $comp['config']['socialLinks'] ?? [];
                $htmlContent .= '<footer><div class="social-links">';
                if ($socialLinks['facebook']) {
                    $facebook = htmlspecialchars($socialLinks['facebook']);
                    $htmlContent .= "<a href=\"$facebook\" target=\"_blank\">Facebook</a>";
                }
                if ($socialLinks['twitter']) {
                    $twitter = htmlspecialchars($socialLinks['twitter']);
                    $htmlContent .= "<a href=\"$twitter\" target=\"_blank\">Twitter</a>";
                }
                if ($socialLinks['instagram']) {
                    $instagram = htmlspecialchars($socialLinks['instagram']);
                    $htmlContent .= "<a href=\"$instagram\" target=\"_blank\">Instagram</a>";
                }
                $htmlContent .= '</div><p>&copy; ' . date('Y') . " $websiteName</p></footer>";
            }
        }

        $htmlContent .= '</div></body></html>';

        if (!file_put_contents($filePath, $htmlContent)) {
            error_log("Failed to write file to $filePath");
            throw new Exception('Failed to write website file');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO websites (
                user_id, website_name, website_type, theme, primary_color, 
                secondary_color, font_style, font_size, components, seo_settings, website_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $componentsJson = json_encode($components);
        $seoSettingsJson = json_encode($seoSettings);

        if ($componentsJson === false || $seoSettingsJson === false) {
            error_log('Failed to encode JSON data');
            throw new Exception('Invalid data format');
        }

        $stmt->execute([
            $_SESSION['user_id'],
            $websiteName,
            $websiteType,
            $theme,
            $primaryColor,
            $secondaryColor,
            $fontStyle,
            $fontSize,
            $componentsJson,
            $seoSettingsJson,
            $websiteLink
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Website created successfully',
            'websiteLink' => $websiteLink
        ]);
    } catch (Exception $e) {
        error_log('Error in create_website.php: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Website creation failed: ' . $e->getMessage()]);
    }
} elseif ($type === 'template') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Template creation not implemented yet']);
    exit;
}
?>
<?php
class VoiceController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function transcribeAudio($userId) {
        if (!isset($_FILES['audio'])) {
            $this->sendResponse(400, ['error' => 'No audio file provided']);
            return;
        }

        $audioFile = $_FILES['audio'];
        $uploadDir = '../uploads/audio/';
        
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = uniqid() . '_' . $audioFile['name'];
        $filePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($audioFile['tmp_name'], $filePath)) {
            // In a real implementation, you would use a speech-to-text service like:
            // - Google Cloud Speech-to-Text
            // - AWS Transcribe
            // - Azure Speech Services
            // - OpenAI Whisper API
            
            $transcript = $this->processAudioFile($filePath);
            
            // Clean up the uploaded file
            unlink($filePath);
            
            $this->sendResponse(200, [
                'success' => true,
                'data' => ['transcript' => $transcript]
            ]);
        } else {
            $this->sendResponse(500, ['error' => 'Failed to upload audio file']);
        }
    }

    public function generateFromVoice($userId) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (empty($data['transcript'])) {
            $this->sendResponse(400, ['error' => 'No transcript provided']);
            return;
        }

        $transcript = $data['transcript'];
        $websiteData = $this->generateWebsiteFromTranscript($transcript);
        
        $this->sendResponse(200, [
            'success' => true,
            'data' => $websiteData
        ]);
    }

    private function processAudioFile($filePath) {
        // Simulate speech-to-text processing
        // In a real implementation, you would:
        // 1. Convert audio to the required format
        // 2. Send to speech-to-text API
        // 3. Return the transcript
        
        $sampleTranscripts = [
            "Create a modern restaurant website with menu, about section, and contact form. Use warm colors and elegant design.",
            "I want to create a portfolio website for a graphic designer with project gallery and contact information.",
            "Design an e-commerce store for handmade jewelry with product showcase and shopping cart.",
            "Build a business website with hero section, services, testimonials, and contact form.",
            "Create a blog website with recent posts, about page, and newsletter signup."
        ];
        
        return $sampleTranscripts[array_rand($sampleTranscripts)];
    }

    private function generateWebsiteFromTranscript($transcript) {
        $prompt = strtolower($transcript);
        $components = [];
        
        // Always add hero
        $components[] = [
            'type' => 'hero',
            'config' => [
                'title' => $this->extractTitle($prompt),
                'subtitle' => $this->extractSubtitle($prompt),
                'buttonText' => 'Get Started',
                'textColor' => '#ffffff',
                'buttonColor' => '#3b82f6'
            ]
        ];
        
        // Add components based on keywords
        if (strpos($prompt, 'about') !== false || strpos($prompt, 'story') !== false) {
            $components[] = [
                'type' => 'text',
                'config' => [
                    'content' => 'About Us - Tell your story here...',
                    'heading' => 'h2'
                ]
            ];
        }
        
        if (strpos($prompt, 'menu') !== false) {
            $components[] = [
                'type' => 'menu',
                'config' => [
                    'title' => 'Our Menu',
                    'categories' => ['Appetizers', 'Main Course', 'Desserts', 'Beverages']
                ]
            ];
        }
        
        if (strpos($prompt, 'product') !== false || strpos($prompt, 'shop') !== false || strpos($prompt, 'store') !== false) {
            $components[] = [
                'type' => 'product',
                'config' => [
                    'name' => 'Featured Product',
                    'price' => '$99.99',
                    'description' => 'Amazing product description goes here...'
                ]
            ];
        }
        
        if (strpos($prompt, 'gallery') !== false || strpos($prompt, 'portfolio') !== false) {
            $components[] = [
                'type' => 'gallery',
                'config' => [
                    'images' => [],
                    'columns' => 3
                ]
            ];
        }
        
        if (strpos($prompt, 'contact') !== false || strpos($prompt, 'form') !== false) {
            $components[] = [
                'type' => 'contact',
                'config' => [
                    'title' => 'Contact Us',
                    'fields' => ['name', 'email', 'message']
                ]
            ];
        }
        
        // Always add footer
        $components[] = [
            'type' => 'footer',
            'config' => [
                'copyright' => '© 2025 Your Company. All rights reserved.'
            ]
        ];
        
        return [
            'name' => 'Voice Generated Website',
            'type' => $this->extractWebsiteType($prompt),
            'theme' => 'Modern',
            'primaryColor' => '#3b82f6',
            'secondaryColor' => '#f97316',
            'components' => $components
        ];
    }

    private function extractTitle($prompt) {
        if (strpos($prompt, 'restaurant') !== false) {
            return 'Welcome to Our Restaurant';
        } elseif (strpos($prompt, 'portfolio') !== false) {
            return 'My Portfolio';
        } elseif (strpos($prompt, 'shop') !== false || strpos($prompt, 'store') !== false) {
            return 'Shop Now';
        } elseif (strpos($prompt, 'blog') !== false) {
            return 'My Blog';
        } else {
            return 'Welcome to Our Website';
        }
    }

    private function extractSubtitle($prompt) {
        if (strpos($prompt, 'restaurant') !== false) {
            return 'Delicious food and great atmosphere';
        } elseif (strpos($prompt, 'portfolio') !== false) {
            return 'Showcasing my best work';
        } elseif (strpos($prompt, 'shop') !== false || strpos($prompt, 'store') !== false) {
            return 'Discover amazing products';
        } elseif (strpos($prompt, 'blog') !== false) {
            return 'Thoughts, stories, and insights';
        } else {
            return 'Create amazing experiences with our platform';
        }
    }

    private function extractWebsiteType($prompt) {
        if (strpos($prompt, 'restaurant') !== false) {
            return 'Restaurant';
        } elseif (strpos($prompt, 'portfolio') !== false) {
            return 'Portfolio';
        } elseif (strpos($prompt, 'shop') !== false || strpos($prompt, 'store') !== false || strpos($prompt, 'ecommerce') !== false) {
            return 'E-Commerce';
        } elseif (strpos($prompt, 'blog') !== false) {
            return 'Blog';
        } else {
            return 'Business';
        }
    }

    private function sendResponse($status, $data) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
?>

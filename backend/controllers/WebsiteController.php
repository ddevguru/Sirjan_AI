<?php
class WebsiteController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createWebsite($userId) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $query = "INSERT INTO websites (user_id, name, type, theme, primary_color, secondary_color, font_family, font_size, components, seo_settings, global_styles, subdomain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->db->prepare($query);
        
        $subdomain = $this->generateSubdomain($data['name']);
        $components = json_encode($data['components'] ?? []);
        $seoSettings = json_encode($data['seoSettings'] ?? []);
        $globalStyles = json_encode($data['globalStyles'] ?? []);
        
        $stmt->execute([
            $userId,
            $data['name'],
            $data['type'],
            $data['theme'],
            $data['primaryColor'],
            $data['secondaryColor'],
            $data['fontFamily'],
            $data['fontSize'],
            $components,
            $seoSettings,
            $globalStyles,
            $subdomain
        ]);

        $websiteId = $this->db->lastInsertId();
        
        // Generate static files
        $this->generateStaticFiles($websiteId, $data);
        
        $this->sendResponse(201, [
            'success' => true,
            'data' => ['id' => $websiteId, 'subdomain' => $subdomain]
        ]);
    }

    public function updateWebsite($websiteId, $userId) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $query = "UPDATE websites SET name = ?, type = ?, theme = ?, primary_color = ?, secondary_color = ?, font_family = ?, font_size = ?, components = ?, seo_settings = ?, global_styles = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";
        
        $stmt = $this->db->prepare($query);
        
        $components = json_encode($data['components'] ?? []);
        $seoSettings = json_encode($data['seoSettings'] ?? []);
        $globalStyles = json_encode($data['globalStyles'] ?? []);
        
        $stmt->execute([
            $data['name'],
            $data['type'],
            $data['theme'],
            $data['primaryColor'],
            $data['secondaryColor'],
            $data['fontFamily'],
            $data['fontSize'],
            $components,
            $seoSettings,
            $globalStyles,
            $websiteId,
            $userId
        ]);

        // Regenerate static files
        $this->generateStaticFiles($websiteId, $data);
        
        $this->sendResponse(200, ['success' => true]);
    }

    public function getWebsite($websiteId, $userId) {
        $query = "SELECT * FROM websites WHERE id = ? AND user_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$websiteId, $userId]);
        
        $website = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($website) {
            $website['components'] = json_decode($website['components'], true);
            $website['seoSettings'] = json_decode($website['seo_settings'], true);
            $website['globalStyles'] = json_decode($website['global_styles'], true);
            
            $this->sendResponse(200, ['success' => true, 'data' => $website]);
        } else {
            $this->sendResponse(404, ['error' => 'Website not found']);
        }
    }

    public function getUserWebsites($userId) {
        $query = "SELECT id, name, type, subdomain, is_published, created_at, updated_at FROM websites WHERE user_id = ? ORDER BY updated_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$userId]);
        
        $websites = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $this->sendResponse(200, ['success' => true, 'data' => $websites]);
    }

    public function publishWebsite($websiteId, $userId) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Get website data
        $query = "SELECT * FROM websites WHERE id = ? AND user_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$websiteId, $userId]);
        $website = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$website) {
            $this->sendResponse(404, ['error' => 'Website not found']);
            return;
        }

        $subdomain = $data['subdomain'] ?? $website['subdomain'];
        $customDomain = $data['customDomain'] ?? null;
        
        // Update website as published
        $updateQuery = "UPDATE websites SET is_published = 1, subdomain = ?, custom_domain = ?, published_at = CURRENT_TIMESTAMP WHERE id = ?";
        $updateStmt = $this->db->prepare($updateQuery);
        $updateStmt->execute([$subdomain, $customDomain, $websiteId]);
        
        // Generate and deploy static files
        $websiteData = [
            'name' => $website['name'],
            'type' => $website['type'],
            'theme' => $website['theme'],
            'primaryColor' => $website['primary_color'],
            'secondaryColor' => $website['secondary_color'],
            'fontFamily' => $website['font_family'],
            'fontSize' => $website['font_size'],
            'components' => json_decode($website['components'], true),
            'seoSettings' => json_decode($website['seo_settings'], true),
            'globalStyles' => json_decode($website['global_styles'], true)
        ];
        
        $this->deployWebsite($websiteId, $subdomain, $websiteData);
        
        $publishedUrl = "https://{$subdomain}.buildflow.app";
        if ($customDomain) {
            $publishedUrl = "https://{$customDomain}";
        }
        
        $this->sendResponse(200, [
            'success' => true,
            'data' => [
                'subdomain' => $subdomain,
                'url' => $publishedUrl
            ]
        ]);
    }

    public function deleteWebsite($websiteId, $userId) {
        $query = "DELETE FROM websites WHERE id = ? AND user_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$websiteId, $userId]);
        
        if ($stmt->rowCount() > 0) {
            // Clean up static files
            $this->cleanupStaticFiles($websiteId);
            $this->sendResponse(200, ['success' => true]);
        } else {
            $this->sendResponse(404, ['error' => 'Website not found']);
        }
    }

    private function generateSubdomain($name) {
        $subdomain = strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $name));
        $subdomain = preg_replace('/-+/', '-', $subdomain);
        $subdomain = trim($subdomain, '-');
        
        // Check if subdomain exists
        $query = "SELECT COUNT(*) FROM websites WHERE subdomain = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$subdomain]);
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            $subdomain .= '-' . time();
        }
        
        return $subdomain;
    }

    private function generateStaticFiles($websiteId, $websiteData) {
        $html = $this->generateHTML($websiteData);
        $css = $this->generateCSS($websiteData);
        $js = $this->generateJS($websiteData);
        
        // Create directory structure
        $websiteDir = "../public/sites/{$websiteId}";
        if (!file_exists($websiteDir)) {
            mkdir($websiteDir, 0755, true);
        }
        
        // Write files
        file_put_contents("{$websiteDir}/index.html", $html);
        file_put_contents("{$websiteDir}/styles.css", $css);
        file_put_contents("{$websiteDir}/script.js", $js);
    }

    private function generateHTML($websiteData) {
        $components = $websiteData['components'] ?? [];
        $seoSettings = $websiteData['seoSettings'] ?? [];
        
        $componentHTML = '';
        foreach ($components as $component) {
            $componentHTML .= $this->renderComponent($component);
        }
        
        return "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{$seoSettings['title']}</title>
    <meta name=\"description\" content=\"{$seoSettings['description']}\">
    <meta name=\"keywords\" content=\"{$seoSettings['keywords']}\">
    <link rel=\"stylesheet\" href=\"styles.css\">
</head>
<body>
    {$componentHTML}
    <script src=\"script.js\"></script>
</body>
</html>";
    }

    private function generateCSS($websiteData) {
        $globalStyles = $websiteData['globalStyles'] ?? [];
        
        return "
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: {$websiteData['fontFamily']};
            font-size: {$websiteData['fontSize']};
            background-color: {$globalStyles['backgroundColor']};
            color: {$globalStyles['textColor']};
            line-height: 1.6;
        }
        
        .component {
            margin: 20px 0;
        }
        
        .hero {
            text-align: center;
            padding: 80px 20px;
            background-size: cover;
            background-position: center;
            position: relative;
            min-height: 500px;
        }
        
        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .product-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        
        .product-info {
            padding: 1.5rem;
        }
        
        .product-name {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .product-description {
            color: #6b7280;
            margin-bottom: 1rem;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #059669;
        }
        
        .menu-section {
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .menu-category {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .menu-item {
            display: flex;
            justify-content: space-between;
            align-items: start;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .menu-item-name {
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .menu-item-description {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .menu-item-price {
            font-weight: 600;
            color: #059669;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .product-card {
                max-width: 100%;
            }
        }
        ";
    }

    private function generateJS($websiteData) {
        return "
        // Website functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize interactive components
            initializeComponents();
            
            // Add smooth scrolling
            document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
        
        function initializeComponents() {
            // Initialize cart functionality
            initializeCart();
            
            // Initialize contact forms
            initializeContactForms();
            
            // Initialize reservation forms
            initializeReservationForms();
        }
        
        function initializeCart() {
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.productId;
                    const productName = this.dataset.productName;
                    const productPrice = this.dataset.productPrice;
                    
                    addToCart(productId, productName, productPrice);
                    showNotification('Product added to cart!');
                });
            });
        }
        
        function addToCart(id, name, price) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
        
        function updateCartDisplay() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = cartCount;
            });
        }
        
        function initializeContactForms() {
            const contactForms = document.querySelectorAll('.contact-form');
            contactForms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    
                    // Simulate form submission
                    setTimeout(() => {
                        showNotification('Message sent successfully!');
                        this.reset();
                    }, 1000);
                });
            });
        }
        
        function initializeReservationForms() {
            const reservationForms = document.querySelectorAll('.reservation-form');
            reservationForms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    
                    // Simulate reservation submission
                    setTimeout(() => {
                        showNotification('Reservation confirmed!');
                        this.reset();
                    }, 1000);
                });
            });
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #059669;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        ";
    }

    private function renderComponent($component) {
        switch ($component['type']) {
            case 'hero':
                return $this->renderHero($component);
            case 'text':
                return $this->renderText($component);
            case 'image':
                return $this->renderImage($component);
            case 'product':
                return $this->renderProduct($component);
            case 'menu':
                return $this->renderMenu($component);
            case 'contact':
                return $this->renderContact($component);
            case 'footer':
                return $this->renderFooter($component);
            default:
                return "<div class=\"component\">Unknown component: {$component['type']}</div>";
        }
    }

    private function renderHero($component) {
        $config = $component['config'];
        $styles = $component['styles'] ?? [];
        
        $backgroundStyle = '';
        if (!empty($config['backgroundImage'])) {
            $backgroundStyle = "background-image: url('{$config['backgroundImage']}');";
        }
        
        return "
        <section class=\"hero component\" style=\"{$backgroundStyle}\">
            " . ($config['overlay'] ? "<div class=\"hero-overlay\"></div>" : "") . "
            <div class=\"hero-content\">
                <h1 style=\"color: {$config['textColor']};\">{$config['title']}</h1>
                <p style=\"color: {$config['textColor']};\">{$config['subtitle']}</p>
                <button class=\"btn\" style=\"background: {$config['buttonColor']}; color: white;\">{$config['buttonText']}</button>
            </div>
        </section>";
    }

    private function renderText($component) {
        $config = $component['config'];
        $heading = $config['heading'];
        
        return "
        <div class=\"component text-component\" style=\"padding: {$config['padding']};\">
            <{$heading} style=\"color: {$config['color']}; font-size: {$config['fontSize']}; text-align: {$config['alignment']};\">{$config['content']}</{$heading}>
        </div>";
    }

    private function renderImage($component) {
        $config = $component['config'];
        
        return "
        <div class=\"component image-component\" style=\"text-align: {$config['alignment']}; padding: 20px;\">
            <img src=\"{$config['src']}\" alt=\"{$config['alt']}\" style=\"width: {$config['width']}; height: {$config['height']}; border-radius: {$config['borderRadius']};\">
            " . (!empty($config['caption']) ? "<p style=\"text-align: center; margin-top: 0.5rem; color: #666;\">{$config['caption']}</p>" : "") . "
        </div>";
    }

    private function renderProduct($component) {
        $config = $component['config'];
        $image = !empty($config['images']) ? $config['images'][0]['src'] : '/placeholder.svg?height=300&width=400';
        
        return "
        <div class=\"component product-component\" style=\"padding: 20px;\">
            <div class=\"product-card\">
                <img src=\"{$image}\" alt=\"{$config['name']}\" class=\"product-image\">
                <div class=\"product-info\">
                    <h3 class=\"product-name\">{$config['name']}</h3>
                    <p class=\"product-description\">{$config['description']}</p>
                    <div style=\"display: flex; justify-content: space-between; align-items: center;\">
                        <span class=\"product-price\">{$config['price']}</span>
                        <button class=\"btn add-to-cart\" data-product-id=\"{$config['sku']}\" data-product-name=\"{$config['name']}\" data-product-price=\"{$config['price']}\" style=\"background: #3b82f6; color: white;\">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>";
    }

    private function renderMenu($component) {
        $config = $component['config'];
        $categoriesHTML = '';
        
        foreach ($config['categories'] as $category) {
            $categoriesHTML .= "
            <div class=\"menu-section\">
                <h3 class=\"menu-category\">{$category}</h3>
                <div class=\"menu-items\">
                    <div class=\"menu-item\">
                        <div>
                            <h4 class=\"menu-item-name\">Sample Item</h4>
                            <p class=\"menu-item-description\">Delicious description of the menu item</p>
                        </div>
                        <span class=\"menu-item-price\">$12.99</span>
                    </div>
                </div>
            </div>";
        }
        
        return "
        <div class=\"component menu-component\" style=\"padding: 40px 20px;\">
            <h2 style=\"text-align: center; margin-bottom: 2rem; font-size: 2rem; font-weight: 700;\">{$config['title']}</h2>
            <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;\">
                {$categoriesHTML}
            </div>
        </div>";
    }

    private function renderContact($component) {
        $config = $component['config'];
        $fieldsHTML = '';
        
        foreach ($config['fields'] as $field) {
            switch ($field) {
                case 'name':
                    $fieldsHTML .= '<input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;">';
                    break;
                case 'email':
                    $fieldsHTML .= '<input type="email" name="email" placeholder="Your Email" required style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;">';
                    break;
                case 'phone':
                    $fieldsHTML .= '<input type="tel" name="phone" placeholder="Your Phone" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;">';
                    break;
                case 'message':
                    $fieldsHTML .= '<textarea name="message" placeholder="Your Message" rows="5" required style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"></textarea>';
                    break;
            }
        }
        
        return "
        <div class=\"component contact-component\" style=\"padding: 40px 20px; background: {$config['backgroundColor']};\">
            <h2 style=\"color: {$config['textColor']}; margin-bottom: 2rem; text-align: center;\">{$config['title']}</h2>
            <form class=\"contact-form\" style=\"max-width: 600px; margin: 0 auto;\">
                {$fieldsHTML}
                <button type=\"submit\" class=\"btn\" style=\"background: {$config['buttonColor']}; color: white; width: 100%;\">{$config['submitText']}</button>
            </form>
        </div>";
    }

    private function renderFooter($component) {
        $config = $component['config'];
        $socialLinksHTML = '';
        
        foreach ($config['socialLinks'] as $platform => $url) {
            if (!empty($url)) {
                $socialLinksHTML .= "<a href=\"{$url}\" style=\"color: {$config['textColor']}; text-decoration: none; margin: 0 0.5rem;\">{$platform}</a>";
            }
        }
        
        return "
        <footer class=\"component footer-component\" style=\"padding: 40px 20px; background: {$config['backgroundColor']}; color: {$config['textColor']};\">
            <div style=\"text-align: center;\">
                <p style=\"margin-bottom: 1rem;\">{$config['copyright']}</p>
                <div>{$socialLinksHTML}</div>
            </div>
        </footer>";
    }

    private function deployWebsite($websiteId, $subdomain, $websiteData) {
        // Create deployment directory
        $deployDir = "../public/live/{$subdomain}";
        if (!file_exists($deployDir)) {
            mkdir($deployDir, 0755, true);
        }
        
        // Copy static files to deployment directory
        $sourceDir = "../public/sites/{$websiteId}";
        if (file_exists($sourceDir)) {
            $this->copyDirectory($sourceDir, $deployDir);
        }
        
        // Create .htaccess for custom routing
        $htaccess = "
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.html [L]
        ";
        file_put_contents("{$deployDir}/.htaccess", $htaccess);
    }

    private function copyDirectory($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->copyDirectory($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }

    private function cleanupStaticFiles($websiteId) {
        $websiteDir = "../public/sites/{$websiteId}";
        if (file_exists($websiteDir)) {
            $this->deleteDirectory($websiteDir);
        }
    }

    private function deleteDirectory($dir) {
        if (!file_exists($dir)) return;
        
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->deleteDirectory($path) : unlink($path);
        }
        rmdir($dir);
    }

    private function sendResponse($status, $data) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
?>

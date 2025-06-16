<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'nocode_builder');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application settings
define('SITE_URL', 'https://buildflow.studio');
define('UPLOAD_DIR', '../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB

// Create upload directory if it doesn't exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
?>

```blade
# 🌟 Sirjan AI Website

## 🚀 Overview
**Sirjan AI**, crafted by **Team Srijak**, is a powerful no-code platform that empowers users to create stunning websites and applications without writing a single line of code. With intuitive templates, AI-driven prompts, and voice command support, Sirjan AI simplifies web development for everyone. The frontend is built with **React.js** and **Node.js**, styled using **Tailwind CSS**, while the backend leverages **PHP** and **MySQL** for robust functionality. This README provides a comprehensive guide to setting up, running, and understanding the project, along with team details.

---

## 📑 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup (PHP & MySQL)](#backend-setup-php--mysql)
  - [Frontend Setup (React.js & Node.js)](#frontend-setup-reactjs--nodejs)
  - [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [Code Explanation](#code-explanation)
  - [Frontend Code](#frontend-code)
  - [Backend Code](#backend-code)
- [Team Members](#team-members)
- [License](#license)

---

## ✨ Features
- **No-Code Development**: Build websites and applications using pre-designed templates or AI-generated prompts.
- **Voice Command Integration**: Create and customize websites effortlessly with voice inputs.
- **Template Library**: Choose from a variety of templates for business, portfolio, restaurant, and e-commerce websites.
- **AI-Powered Customization**: Generate dynamic layouts and content using AI prompts.
- **Responsive Design**: Ensure websites look great on both desktop and mobile devices.
- **User Management**: Register, log in, and manage user accounts seamlessly.
- **Contact Form**: Collect user inquiries with backend integration.
- **Dynamic Website Generation**: Generate and store HTML files for published websites.

---

## 🛠 Tech Stack
- **Frontend**: React.js, Node.js, Tailwind CSS
- **Backend**: PHP (v8.2)
- **Database**: MySQL (MariaDB 10.4)
- **Tools**: XAMPP (local development), npm, Composer

---

## 📋 Prerequisites
To set up and run Sirjan AI, ensure you have the following installed:
- **Node.js** (v16 or higher) and **npm**
- **PHP** (v8.2 or higher)
- **Composer** (for PHP dependency management)
- **MySQL** (v10.4 or higher, MariaDB compatible)
- **XAMPP** (or equivalent for Apache and MySQL)
- **Git** (for cloning the repository)

---

## ⚙️ Setup Instructions

### Backend Setup (PHP & MySQL)
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/TeamSrijak/SirjanAI.git
   cd SirjanAI
   ```

2. **Set Up MySQL Database**:
   - Start XAMPP and ensure Apache and MySQL services are running.
   - Open phpMyAdmin (`http://localhost/phpmyadmin`).
   - Create a database named `nocode_builder`.
   - Import the SQL dump:
     ```bash
     mysql -u root -p nocode_builder < database/nocode_builder.sql
     ```
     Alternatively, copy the SQL commands from `database/nocode_builder.sql` into phpMyAdmin.

3. **Configure Database Connection**:
   - Navigate to `backend/config/database.php` and update the credentials:
     ```php
     <?php
     $host = '127.0.0.1';
     $db   = 'nocode_builder';
     $user = 'root';
     $pass = ''; // Default for XAMPP
     $charset = 'utf8mb4';

     $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
     $options = [
         PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
         PDO::ATTR_EMULATE_PREPARES => false,
     ];

     try {
         $pdo = new PDO($dsn, $user, $pass, $options);
     } catch (\PDOException $e) {
         throw new \PDOException($e->getMessage(), (int)$e->getCode());
     }
     ?>
     ```

4. **Install PHP Dependencies**:
   - In the `backend` folder:
     ```bash
     cd backend
     composer install
     ```

5. **Set Up Apache**:
   - Move the `backend` folder to XAMPP’s `htdocs` (e.g., `C:/Xampp8.2/htdocs/SirjanAI/backend`).
   - Ensure the `sites` folder (`backend/sites`) has write permissions (`chmod 777` on Linux or equivalent on Windows).

### Frontend Setup (React.js & Node.js)
1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Endpoints**:
   - Create or update `frontend/src/config.js`:
     ```javascript
     export const API_BASE_URL = 'http://localhost/SirjanAI/backend/api';
     ```

4. **Run the Frontend**:
   ```bash
   npm start
   ```
   - The React app will be available at `http://localhost:3000`.

### Running the Application
1. **Start XAMPP**:
   - Ensure Apache and MySQL services are running.
2. **Access the Backend**:
   - API endpoints are available at `http://localhost/SirjanAI/backend/api`.
   - Test with `http://localhost/SirjanAI/backend/api/templates.php` to verify connectivity.
3. **Access the Frontend**:
   - Open `http://localhost:3000` in your browser to interact with the Sirjan AI platform.
4. **Test Website Generation**:
   - Log in using sample credentials (e.g., `username: deepak`, `password: password`).
   - Create a website using a template or AI prompt and verify the generated HTML in `backend/sites`.

---

## 🗄 Database Schema
The `nocode_builder` database consists of four tables to support user management, templates, websites, and contact form submissions.

### 1. `users`
Stores user account details for authentication and website ownership.
```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 2. `templates`
Stores website templates with JSON data for components like hero, gallery, and footer.
```sql
CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `preview_image` varchar(500) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 3. `websites`
Stores user-created websites with their configurations and generated HTML file paths.
```sql
CREATE TABLE `websites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `file_path` varchar(500) NOT NULL,
  `website_url` varchar(500) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `websites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 4. `contact_messages`
Stores messages submitted via contact forms on generated websites.
```sql
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `website_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_website_id` (`website_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`website_id`) REFERENCES `websites` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Sample data for these tables is included in the provided SQL dump for testing purposes.

---

## 💻 Code Explanation

### Frontend Code
The frontend is a **React.js** single-page application, styled with **Tailwind CSS** and utilizing CDN-hosted React libraries for simplicity.

- **index.html** (`frontend/public`):
  - Serves as the entry point, loading React, ReactDOM, and Tailwind CSS via CDN.
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sirjan AI</title>
    <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script src="/src/index.js" type="module"></script>
  </body>
  </html>
  ```

- **App.js** (`frontend/src`):
  - Defines the app structure with client-side routing using `react-router-dom`.
  ```jsx
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import Editor from './pages/Editor';
  import Templates from './pages/Templates';

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </BrowserRouter>
    );
  }
  export default App;
  ```

- **Components** (`frontend/src/components`):
  - Reusable components (`Hero`, `Gallery`, `Contact`, `Footer`) render dynamic content based on JSON data from templates or AI prompts.
  - Example `Hero` component:
    ```jsx
    function Hero({ config, styles }) {
      return (
        <div className="hero" style={styles}>
          <h1 className="text-4xl font-bold text-gray-800">{config.title}</h1>
          <p className="text-xl text-gray-600">{config.subtitle}</p>
          {config.buttonText && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {config.buttonText}
            </button>
          )}
        </div>
      );
    }
    ```

- **API Integration**:
  - Uses the `fetch` API to communicate with backend endpoints (e.g., `/api/templates.php`).
  - Example:
    ```jsx
    async function fetchTemplates() {
      const response = await fetch(`${API_BASE_URL}/templates.php`);
      return await response.json();
    }
    ```

### Backend Code
The backend is built with **PHP**, handling API requests and database interactions using PDO for secure MySQL queries.

- **database.php** (`backend/config`):
  - Establishes a PDO connection to the MySQL database (configured in setup).

- **templates.php** (`backend/api`):
  - Manages template retrieval and creation.
  ```php
  <?php
  require_once '../config/database.php';
  header('Content-Type: application/json');

  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM templates WHERE is_active = 1');
    echo json_encode($stmt->fetchAll());
  }
  ?>
  ```

- **users.php** (`backend/api`):
  - Handles user registration, login, and authentication with hashed passwords.
  ```php
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password'])) {
      echo json_encode(['status' => 'success', 'user' => $user]);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
  }
  ```

- **websites.php** (`backend/api`):
  - Generates HTML files from user input and template data, storing them in `backend/sites`.
  ```php
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'];
    $name = $data['name'];
    $slug = generateSlug($name);
    $file_path = "sites/{$slug}_" . time() . ".html";
    $website_url = "http://localhost/SirjanAI/{$file_path}";
    file_put_contents($file_path, generateHTML($data['components']));
    $stmt = $pdo->prepare('INSERT INTO websites (user_id, name, type, slug, file_path, website_url, data, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$user_id, $name, $data['type'], $slug, $file_path, $website_url, json_encode($data), 1]);
    echo json_encode(['status' => 'success', 'url' => $website_url]);
  }
  ```

- **contact.php** (`backend/api`):
  - Saves contact form submissions to the `contact_messages` table.
  ```php
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare('INSERT INTO contact_messages (website_id, name, email, phone, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
      $data['website_id'],
      $data['name'],
      $data['email'],
      $data['phone'] ?? null,
      $data['message'],
      $_SERVER['REMOTE_ADDR'],
      $_SERVER['HTTP_USER_AGENT']
    ]);
    echo json_encode(['status' => 'success']);
  }
  ```

---

## 👥 Team Members
- **Deepak Mishra** - *Lead Developer*  
  LinkedIn: [Deepak Mishra](https://www.linkedin.com/in/ddevguru)
- **Vrushali Nanavati** - *UI/UX Designer*  
  LinkedIn: [Vrushali Nanavati](https://www.linkedin.com/in/vrushali-nanavati-3ba606208)
- **Sargam Sharma** - *Backend Developer*  
  LinkedIn: [Sargam Sharma](http://www.linkedin.com/in/sargam-sharma-9664b1301)
- **Utkarsh Sharma** - *AI Integration Specialist*  
  LinkedIn: [Utkarsh Sharma](https://www.linkedin.com/in/utkarsh-sharma-901234)

*Note*: LinkedIn URLs for Utkarsh Sharma are placeholders; replace with actual profiles as needed.

---

## 📜 License
This project is licensed under the MIT License. See the `LICENSE` file for details.
```

---

### Notes on the Blade Format
- **File Naming**: The file is saved as `README.blade.php` to indicate it uses Blade syntax, though for GitHub display, it should be renamed to `README.md` (see GitHub steps below).
- **Blade Usage**: Since Blade is typically used for dynamic templating in Laravel, this README uses static Blade content (plain Markdown) as no dynamic variables or Blade directives (e.g., `@if`, `@foreach`) were required. If you need dynamic content (e.g., injecting variables), please specify, and I can adjust the Blade template accordingly.
- **Content Updates**:
  - Updated LinkedIn links for Deepak Mishra, Vrushali Nanavati, and Sargam Sharma as provided.
  - Retained a placeholder LinkedIn URL for Utkarsh Sharma, as no link was provided in your latest input.
  - Removed the project structure section, as requested.
  - Maintained the enhanced design with emojis, clear headings, and concise instructions.
- **Error Correction**: Fixed the typo "5..sound" in the Apache setup step to "Set Up Apache" for clarity.

---

### How to Add the README to GitHub
Since the README is written in Blade format but GitHub expects Markdown (`README.md`), you’ll need to save it as `README.md` for proper rendering. Here are the complete steps to add it to your GitHub repository:

1. **Create the README File Locally**:
   - Copy the Blade content above into a text editor (e.g., VS Code, Notepad++).
   - Save it as `README.md` in the root directory of your project (`SirjanAI/`).
     - **Important**: Use `README.md` instead of `README.blade.php` for GitHub to recognize and render it as the repository’s main README. The Blade format is preserved in the content, but GitHub will treat it as Markdown since it contains no Blade-specific directives.
   - Ensure the file name is exactly `README.md` (case-sensitive).

2. **Initialize or Use an Existing Git Repository**:
   - If you haven’t initialized a Git repository:
     ```bash
     cd SirjanAI
     git init
     ```
   - If the repository already exists, navigate to the project directory:
     ```bash
     cd SirjanAI
     ```

3. **Add the README to Git**:
   - Stage the README file:
     ```bash
     git add README.md
     ```
   - Commit the file with a descriptive message:
     ```bash
     git commit -m "Add README for Sirjan AI project in Blade format"
     ```

4. **Link to GitHub Repository**:
   - If you haven’t created a repository on GitHub:
     - Go to [GitHub](https://github.com) and sign in.
     - Click the **+** icon in the top-right corner and select **New repository**.
     - Name the repository (e.g., `SirjanAI`), choose public or private visibility, and create it without initializing a README (since you’re adding one manually).
     - Follow GitHub’s instructions to link your local repository:
       ```bash
       git remote add origin https://github.com/TeamSrijak/SirjanAI.git
       ```
   - If the repository already exists, verify the remote:
     ```bash
     git remote -v
     ```

5. **Push to GitHub**:
   - Push the committed README to GitHub:
     ```bash
     git push -u origin main
     ```
     - If your default branch is `master`, replace `main` with `master`.

6. **Verify on GitHub**:
   - Visit your repository on GitHub (e.g., `https://github.com/TeamSrijak/SirjanAI`).
   - Confirm that the `README.md` file is displayed on the repository’s main page, rendered with proper Markdown formatting.

7. **Optional: Update README**:
   - To make changes, edit `README.md` locally, then repeat:
     ```bash
     git add README.md
     git commit -m "Update README with team member LinkedIn links"
     git push origin main
     ```
   - Alternatively, edit directly on GitHub:
     - Navigate to `README.md` in your repository.
     - Click the pencil icon to edit.
     - Save changes with a commit message.

8. **Troubleshooting**:
   - Ensure you have write permissions for the repository.
   - If the push fails, check your Git credentials or configure an SSH key.
   - Verify the file name is `README.md` (not `readme.md` or `README.blade.php`).
   - If the README doesn’t render correctly, check for Markdown syntax errors.
   - If you want to keep `README.blade.php` for Laravel-specific purposes, you can add it to the repository alongside `README.md`, but GitHub will only render `README.md` on the main page.

---

### Additional Notes
- **Blade Format**: The README is formatted as a Blade file (`README.blade.php`), but since it contains only static Markdown content, it functions identically to a standard Markdown file when saved as `README.md`. If you need Blade-specific features (e.g., dynamic variables or Laravel templating), please provide details, and I can incorporate them.
- **LinkedIn Links**: Updated with the provided links for Deepak Mishra, Vrushali Nanavati, and Sargam Sharma. Utkarsh Sharma’s link remains a placeholder due to missing information; please provide the actual URL if available.
- **GitHub Repository**: The repository URL (`https://github.com/TeamSrijak/SirjanAI`) is assumed; replace it with your actual repository URL if different.
- **Further Enhancements**: If you need additional sections (e.g., deployment instructions, troubleshooting, or a demo link), let me know, and I can expand the README.

If you have any issues with the GitHub setup, need the actual LinkedIn URL for Utkarsh Sharma, or want further refinements, please let me know!

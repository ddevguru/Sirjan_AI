# Sirjan AI Website

## Overview
Sirjan AI is a no-code platform developed by **Team Srijak** that enables users to create websites and applications without coding. It leverages templates, AI prompts, and voice commands for seamless website and application development. The frontend is built using **React.js** and **Node.js**, styled with **Tailwind CSS**, while the backend uses **PHP** with a **MySQL** database. This README provides a detailed guide to setting up and running the project, explaining the code structure, database schema, and team details.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
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

## Features
- **No-Code Development**: Create websites and applications using pre-designed templates or AI-generated prompts.
- **Voice Command Integration**: Build and customize websites using voice inputs.
- **Template Library**: Choose from templates for business, portfolio, restaurant, and e-commerce websites.
- **AI-Powered Customization**: Generate dynamic layouts and content using AI prompts.
- **Responsive Design**: Websites are optimized for both desktop and mobile devices.
- **User Management**: Register, log in, and manage user accounts.
- **Contact Form**: Collect user inquiries with backend integration.
- **Dynamic Website Generation**: Generate and store HTML files for published websites.

## Tech Stack
- **Frontend**: React.js, Node.js, Tailwind CSS
- **Backend**: PHP (v8.2)
- **Database**: MySQL (MariaDB 10.4)
- **Tools**: XAMPP (local development), npm, Composer

## Project Structure

SirjanAI/ ├── frontend/ # React.js frontend code │ ├── public/ # Public assets and index.html │ ├── src/ # React components, styles, and logic │ │ ├── components/ # Reusable components (Hero, Gallery, Footer, etc.) │ │ ├── pages/ # Page components (Home, Templates, Editor) │ │ ├── assets/ # Images, fonts, and static files │ │ ├── App.js # Main App component │ │ ├── index.js # React entry point │ │ └── styles/ # Tailwind CSS and custom styles │ ├── package.json # Node.js dependencies and scripts │ └── README.md # Frontend-specific README ├── backend/ # PHP backend code │ ├── api/ # API endpoints for CRUD operations │ │ ├── templates.php # Template management │ │ ├── users.php # User authentication and management │ │ ├── websites.php # Website creation and publishing │ │ └── contact.php # Contact form submissions │ ├── config/ # Configuration files │ │ └── database.php # Database connection settings │ ├── models/ # Database models │ ├── sites/ # Generated website HTML files │ ├── composer.json # PHP dependencies │ └── index.php # Backend entry point ├── database/ # Database scripts │ └── nocode_builder.sql # MySQL schema and sample data └── README.md # This file


## Prerequisites
- **Node.js** (v16 or higher) and **npm**
- **PHP** (v8.2 or higher)
- **Composer** (for PHP dependencies)
- **MySQL** (v10.4 or higher, MariaDB compatible)
- **XAMPP** (or equivalent for Apache and MySQL)
- **Git** (for cloning the repository)

## Setup Instructions

### Backend Setup (PHP & MySQL)
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/TeamSrijak/SirjanAI.git
   cd SirjanAI





Set Up MySQL Database:





Start XAMPP and ensure Apache and MySQL are running.



Open phpMyAdmin (http://localhost/phpmyadmin).



Create a database named nocode_builder.



Import the SQL dump:

mysql -u root -p nocode_builder < database/nocode_builder.sql

Alternatively, copy the SQL commands from database/nocode_builder.sql (provided in the user input) into phpMyAdmin.



Configure Database Connection:





Navigate to backend/config/database.php and update credentials:

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



Install PHP Dependencies:





In the backend folder:

cd backend
composer install



Set Up Apache:





Move the backend folder to XAMPP’s htdocs (e.g., C:/Xampp8.2/htdocs/SirjanAI/backend).



Ensure the sites folder (backend/sites) has write permissions.

Frontend Setup (React.js & Node.js)





Navigate to Frontend Directory:

cd frontend



Install Dependencies:

npm install



Configure API Endpoints:





Create or update frontend/src/config.js:

export const API_BASE_URL = 'http://localhost/SirjanAI/backend/api';



Run the Frontend:

npm start





The app will be available at http://localhost:3000.

Running the Application





Start XAMPP:





Ensure Apache and MySQL are running.



Access the Backend:





API endpoints are at http://localhost/SirjanAI/backend/api.



Test with http://localhost/SirjanAI/backend/api/templates.php.



Access the Frontend:





Open http://localhost:3000 to use the platform.



Test Website Generation:





Log in with sample credentials (e.g., deepak/password).



Create a website using a template or AI prompt and verify the generated HTML in backend/sites.

Database Schema

The nocode_builder database includes four tables:

1. users

Stores user account details.

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

2. templates

Stores website templates with JSON data for components.

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

3. websites

Stores user-created websites with their configurations.

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

4. contact_messages

Stores messages submitted via contact forms.

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

Sample data is included in the provided SQL dump for testing.

Code Explanation

Frontend Code

The frontend is a React.js single-page application styled with Tailwind CSS, using CDN-hosted React libraries.





index.html (in frontend/public):





Loads React, ReactDOM, and Tailwind CSS via CDN.



Serves as the entry point for the React app.

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



App.js (in frontend/src):





Defines the main app structure with routing and components.



Example structure:

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



Components:





Reusable components like Hero, Gallery, Contact, and Footer render dynamic content based on template or AI-generated JSON data.



Example Hero component:

function Hero({ config, styles }) {
  return (
    <div className="hero" style={styles}>
      <h1 className="text-4xl font-bold">{config.title}</h1>
      <p className="text-xl">{config.subtitle}</p>
      {config.buttonText && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {config.buttonText}
        </button>
      )}
    </div>
  );
}



API Integration:





Uses fetch to interact with backend APIs (e.g., /api/templates.php for template data).



Example API call:

async function fetchTemplates() {
  const response = await fetch(`${API_BASE_URL}/templates.php`);
  return await response.json();
}

Backend Code

The backend is built with PHP, handling API requests and database operations.





database.php (in backend/config):





Establishes a PDO connection to MySQL (as shown in setup).



templates.php (in backend/api):





Handles GET requests to fetch templates and POST requests to create new ones.



Example:

<?php
require_once '../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->query('SELECT * FROM templates WHERE is_active = 1');
  echo json_encode($stmt->fetchAll());
}
?>



users.php (in backend/api):





Manages user registration, login, and authentication using hashed passwords.



Example login logic:

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



websites.php (in backend/api):





Generates and saves HTML files to backend/sites based on user input and template data.



Example:

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



contact.php (in backend/api):





Saves contact form submissions to the contact_messages table.



Example:

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

Team Members





Deepak Mishra - Lead Developer
LinkedIn: Deepak Mishra



Vrushali Nanavati - UI/UX Designer
LinkedIn: Vrushali Nanavati



Sargam Sharma - Backend Developer
LinkedIn: Sargam Sharma



Utkarsh Sharma - AI Integration Specialist
LinkedIn: Utkarsh Sharma

Note: LinkedIn URLs are placeholders; update with actual profiles as needed.

License

This project is licensed under the MIT License. See the LICENSE file for details.

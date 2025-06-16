-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 07:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nocode_builder`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `website_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `preview_image` varchar(500) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `name`, `category`, `preview_image`, `data`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Modern Business', 'Business', '/templates/modern-business.jpg', '{\"components\": [{\"type\": \"hero\", \"config\": {\"title\": \"Welcome to Our Business\", \"subtitle\": \"Professional services for modern companies\"}}, {\"type\": \"text\", \"config\": {\"content\": \"We provide exceptional services to help your business grow and succeed in today\'s competitive market.\"}}, {\"type\": \"contact\", \"config\": {\"title\": \"Get In Touch\"}}]}', 1, '2025-06-15 17:11:52', '2025-06-15 17:11:52'),
(2, 'Creative Portfolio', 'Portfolio', '/templates/creative-portfolio.jpg', '{\"components\": [{\"type\": \"hero\", \"config\": {\"title\": \"Creative Portfolio\", \"subtitle\": \"Showcasing innovative design and development\"}}, {\"type\": \"gallery\", \"config\": {\"images\": []}}, {\"type\": \"text\", \"config\": {\"content\": \"Explore my creative work and innovative solutions.\"}}]}', 1, '2025-06-15 17:11:52', '2025-06-15 17:11:52'),
(3, 'Restaurant Menu', 'Restaurant', '/templates/restaurant.jpg', '{\"components\": [{\"type\": \"hero\", \"config\": {\"title\": \"Delicious Dining Experience\", \"subtitle\": \"Fresh ingredients, exceptional flavors\"}}, {\"type\": \"text\", \"config\": {\"content\": \"Our menu features carefully crafted dishes using the finest local ingredients.\"}}, {\"type\": \"contact\", \"config\": {\"title\": \"Make a Reservation\"}}]}', 1, '2025-06-15 17:11:52', '2025-06-15 17:11:52'),
(4, 'E-Commerce Store', 'E-Commerce', '/templates/ecommerce.jpg', '{\"components\": [{\"type\": \"hero\", \"config\": {\"title\": \"Shop Premium Products\", \"subtitle\": \"Quality items at unbeatable prices\"}}, {\"type\": \"gallery\", \"config\": {\"images\": []}}, {\"type\": \"text\", \"config\": {\"content\": \"Discover our curated collection of premium products.\"}}]}', 1, '2025-06-15 17:11:52', '2025-06-15 17:11:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password`, `phone_number`, `created_at`) VALUES
(1, 'Deepak Mishra ', 'deepak', 'deepakm7778@gmail.com', '$2y$10$SFmO1h0U2DmqoPU6qGBUP.7UNw1AUPqy.aAsyhXwfZnQO9skRDf12', '7028196172', '2025-06-15 06:45:53');

-- --------------------------------------------------------

--
-- Table structure for table `websites`
--

CREATE TABLE `websites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `website_url` varchar(500) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `websites`
--

INSERT INTO `websites` (`id`, `user_id`, `name`, `type`, `slug`, `file_path`, `website_url`, `data`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'My Website', 'Portfolio', 'my-website', 'C:/Xampp8.2/htdocs/Promptos/sites/my-website_1750012981.html', 'http://localhost/Promptos/sites/my-website_1750012981.html', '{\"name\":\"My Website\",\"type\":\"Portfolio\",\"theme\":\"Modern\",\"primaryColor\":\"#3b82f6\",\"secondaryColor\":\"#10b981\",\"fontFamily\":\"Inter\",\"fontSize\":\"16px\",\"components\":[{\"id\":\"hero_1750012926\",\"type\":\"hero\",\"config\":{\"title\":\"Creative Work That Inspires\",\"subtitle\":\"Showcasing creative projects and innovative solutions.\",\"buttonText\":\"Get Started\",\"backgroundImage\":\"\",\"alignment\":\"center\"},\"styles\":{\"padding\":\"80px 20px\",\"backgroundColor\":\"#f8fafc\",\"textAlign\":\"center\"}},{\"id\":\"gallery_1750012928\",\"type\":\"gallery\",\"config\":{\"images\":[\"\\/placeholder.svg?height=300&width=400\",\"\\/placeholder.svg?height=300&width=400\",\"\\/placeholder.svg?height=300&width=400\"],\"columns\":3,\"spacing\":\"10px\",\"showCaptions\":false},\"styles\":{\"padding\":\"40px 20px\"}},{\"id\":\"footer_1750012930\",\"type\":\"footer\",\"config\":{\"copyright\":\"\\u00a9 2025 Your Company. All rights reserved.\",\"socialLinks\":{\"facebook\":\"\",\"twitter\":\"\",\"instagram\":\"\",\"linkedin\":\"\"},\"links\":[]},\"styles\":{\"padding\":\"40px 20px\",\"backgroundColor\":\"#1f2937\",\"color\":\"#ffffff\"}}],\"seoSettings\":{\"title\":\"\",\"description\":\"\",\"keywords\":\"\"}}', 1, '2025-06-15 18:43:01', '2025-06-15 18:43:01'),
(2, 1, 'Online Store', 'ecommerce', 'online-store', 'C:/Xampp8.2/htdocs/Promptos/sites/online-store_1750016210.html', 'http://localhost/Promptos/sites/online-store_1750016210.html', '{\"name\":\"Online Store\",\"type\":\"ecommerce\",\"theme\":\"Modern\",\"primaryColor\":\"#3b82f6\",\"secondaryColor\":\"#10b981\",\"fontFamily\":\"Inter\",\"fontSize\":\"16px\",\"components\":[{\"id\":\"hero_1750016203777_0\",\"type\":\"hero\",\"config\":{\"title\":\"Shop Now\",\"subtitle\":\"Discover amazing products\",\"buttonText\":\"Get Started\",\"backgroundImage\":\"\",\"alignment\":\"center\"},\"styles\":{\"padding\":\"80px 20px\",\"backgroundColor\":\"#f8fafc\",\"textAlign\":\"center\"}},{\"id\":\"gallery_1750016203777_1\",\"type\":\"gallery\",\"config\":{\"images\":[],\"columns\":3,\"spacing\":\"10px\",\"showCaptions\":false},\"styles\":{\"padding\":\"20px\"}},{\"id\":\"text_1750016203777_2\",\"type\":\"text\",\"config\":{\"content\":\"Featured products and categories...\",\"heading\":\"h2\",\"alignment\":\"left\"},\"styles\":{\"padding\":\"20px\",\"fontSize\":\"16px\",\"lineHeight\":\"1.6\"}},{\"id\":\"contact_1750016203777_3\",\"type\":\"contact\",\"config\":{\"title\":\"Customer Support\",\"fields\":[\"name\",\"email\",\"message\"],\"submitText\":\"Send Message\",\"successMessage\":\"Thank you for your message!\"},\"styles\":{\"padding\":\"40px 20px\",\"backgroundColor\":\"#f9fafb\"}},{\"id\":\"footer_1750016203777_4\",\"type\":\"footer\",\"config\":{\"copyright\":\"\\u00a9 2024 Your Store\",\"socialLinks\":{\"facebook\":\"\",\"twitter\":\"\",\"instagram\":\"\",\"linkedin\":\"\"},\"links\":[]},\"styles\":{\"padding\":\"40px 20px\",\"backgroundColor\":\"#1f2937\",\"color\":\"#ffffff\"}}],\"seoSettings\":{\"title\":\"\",\"description\":\"\",\"keywords\":\"\"}}', 1, '2025-06-15 19:36:50', '2025-06-15 19:36:50'),
(3, 1, 'Personal Blog', 'blog', 'personal-blog', 'C:/Xampp8.2/htdocs/Promptos/sites/personal-blog_1750016308.html', 'http://localhost/Promptos/sites/personal-blog_1750016308.html', '{\"name\":\"Personal Blog\",\"type\":\"blog\",\"theme\":\"Modern\",\"primaryColor\":\"#3b82f6\",\"secondaryColor\":\"#10b981\",\"fontFamily\":\"Inter\",\"fontSize\":\"16px\",\"components\":[{\"id\":\"hero_1750016296147_0\",\"type\":\"hero\",\"config\":{\"title\":\"My Blog\",\"subtitle\":\"Thoughts, stories, and insights\",\"buttonText\":\"Get Started\",\"backgroundImage\":\"\",\"alignment\":\"center\"},\"styles\":{\"padding\":\"80px 20px\",\"backgroundColor\":\"#f8fafc\",\"textAlign\":\"center\"}},{\"id\":\"text_1750016296147_1\",\"type\":\"text\",\"config\":{\"content\":\"Welcome to my blog...\",\"heading\":\"h2\",\"alignment\":\"left\"},\"styles\":{\"padding\":\"20px\",\"fontSize\":\"16px\",\"lineHeight\":\"1.6\"}},{\"id\":\"contact_1750016296147_3\",\"type\":\"contact\",\"config\":{\"title\":\"Subscribe\",\"fields\":[\"name\",\"email\",\"message\"],\"submitText\":\"Send Message\",\"successMessage\":\"Thank you for your message!\"},\"styles\":{\"padding\":\"40px 20px\",\"backgroundColor\":\"#f9fafb\"}},{\"id\":\"footer_1750016296147_4\",\"type\":\"footer\",\"config\":{\"copyright\":\"\\u00a9 2024 Blog Name\",\"socialLinks\":{\"facebook\":\"\",\"twitter\":\"\",\"instagram\":\"\",\"linkedin\":\"\"},\"links\":[]},\"styles\":{\"padding\":\"40px 20px\",\"backgroundColor\":\"#1f2937\",\"color\":\"#ffffff\"}}],\"seoSettings\":{\"title\":\"\",\"description\":\"\",\"keywords\":\"\"}}', 1, '2025-06-15 19:38:28', '2025-06-15 19:38:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_website_id` (`website_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `websites`
--
ALTER TABLE `websites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `websites`
--
ALTER TABLE `websites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`website_id`) REFERENCES `websites` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `websites`
--
ALTER TABLE `websites`
  ADD CONSTRAINT `websites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

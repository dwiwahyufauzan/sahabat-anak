-- Create events table
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `venue` varchar(255) NOT NULL,
  `event_type` enum('offline', 'online') NOT NULL,
  `objectives` text,
  `target_audience` varchar(255),
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `start_time` varchar(10) NOT NULL,
  `end_time` varchar(10) NOT NULL,
  `image` varchar(255),
  `status` enum('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

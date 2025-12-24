-- Add new fields to programs table for detail page support

ALTER TABLE programs
ADD COLUMN full_description TEXT AFTER description,
ADD COLUMN category_color VARCHAR(50) DEFAULT 'blue' AFTER category,
ADD COLUMN icon VARCHAR(100) DEFAULT 'menu_book' AFTER category_color,
ADD COLUMN hero_image VARCHAR(255) AFTER image,
ADD COLUMN locations TEXT AFTER location,
ADD COLUMN target_audience TEXT AFTER locations,
ADD COLUMN schedule_frequency VARCHAR(255) AFTER target_audience,
ADD COLUMN schedule_duration VARCHAR(255) AFTER schedule_frequency,
ADD COLUMN objectives TEXT AFTER schedule_duration,
ADD COLUMN activities TEXT AFTER objectives,
ADD COLUMN testimonials TEXT AFTER activities,
ADD COLUMN impact TEXT AFTER testimonials;

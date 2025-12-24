-- Update team_members table to match frontend tim-kami requirements

ALTER TABLE team_members
ADD COLUMN position VARCHAR(100) AFTER role,
ADD COLUMN quote TEXT AFTER position,
ADD COLUMN photo VARCHAR(255) AFTER image,
ADD COLUMN alt VARCHAR(255) AFTER photo,
ADD COLUMN email_contact VARCHAR(255) AFTER alt,
ADD COLUMN linkedin VARCHAR(255) AFTER email_contact,
ADD COLUMN verified TINYINT(1) DEFAULT 0 AFTER linkedin,
ADD COLUMN experience VARCHAR(100) AFTER verified,
ADD COLUMN expertise JSON AFTER experience,
ADD COLUMN team_type ENUM('leadership', 'coordinator') DEFAULT 'coordinator' AFTER expertise,
ADD COLUMN program VARCHAR(100) AFTER team_type,
ADD COLUMN program_short VARCHAR(50) AFTER program;

-- Add comment for clarity
ALTER TABLE team_members COMMENT = 'Team members data for Tim Kami page with leadership and coordinator types';
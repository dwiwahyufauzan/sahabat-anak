-- Remove unused fields from team_members table
ALTER TABLE team_members DROP COLUMN IF EXISTS position;
ALTER TABLE team_members DROP COLUMN IF EXISTS image;
ALTER TABLE team_members DROP COLUMN IF EXISTS alt;
ALTER TABLE team_members DROP COLUMN IF EXISTS linkedin;

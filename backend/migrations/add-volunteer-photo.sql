-- Add photo column to volunteers table
ALTER TABLE volunteers ADD COLUMN photo VARCHAR(255) AFTER availability;
